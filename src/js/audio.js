/**
 * Web Audio Engine with Synthesized Malayalam Hit Melodies ("Raave") & Mood Audio Layers
 */

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.volume = 0.75; // Default 75% - loud enough to hear!
    this.isPlaying = false;
    this.currentTrack = "why_me"; // Default to user's Spotify requested song!
    this.timerId = null;
    this.noteStep = 0;
    this.audioElement = null;
    this.mediaSourceNode = null;

    // Track Presets including iconic Malayalam Melody "Raave" & Spotify "Why Me"
    this.tracks = {
      why_me: {
        name: "Why Me (Spotify - Manhar, Richie 🎧)",
        type: "stream",
        url: "https://p.scdn.co/mp3-preview/c9a5a4da461665067eb34caeee22113a3863afa4",
        bpm: 100,
        notes: [440.00, 523.25, 659.25, 587.33, 523.25, 440.00, 392.00, 440.00],
        bass: [220.00, 220.00, 174.61, 196.00]
      },
      raave: {
        name: "Raave (Malayalam Hit Melody 🎵)",
        bpm: 98,
        // Raave pentatonic / melodic sequence: E4, G4, A4, B4, C5, B4, A4, G4, E4, A4, B4, C5, E5, D5, C5, B4
        notes: [329.63, 392.00, 440.00, 493.88, 523.25, 493.88, 440.00, 392.00, 329.63, 440.00, 493.88, 523.25, 659.25, 587.33, 523.25, 493.88],
        bass: [164.81, 164.81, 220.00, 220.00, 174.61, 174.61, 196.00, 196.00]
      },
      synthwave: {
        name: "Cyberpunk Synthwave ⚡",
        bpm: 120,
        notes: [130.81, 164.81, 196.00, 246.94, 261.63, 329.63, 392.00, 493.88],
        bass: [65.41, 65.41, 73.42, 73.42, 87.31, 87.31, 98.00, 98.00]
      },
      lofi: {
        name: "Chill Lofi Beats ☕",
        bpm: 85,
        notes: [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 293.66, 392.00],
        bass: [130.81, 130.81, 174.61, 174.61, 146.83, 146.83, 196.00, 196.00]
      },
      chiptune: {
        name: "8-Bit Arcade Hero 🕹️",
        bpm: 140,
        notes: [523.25, 659.25, 783.99, 1046.50, 880.00, 698.46, 587.33, 783.99],
        bass: [261.63, 261.63, 349.23, 349.23, 293.66, 293.66, 392.00, 392.00]
      }
    };
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Booster pre-amp node: amplifies all audio by 2.5x before master gain
      this.boosterGain = this.ctx.createGain();
      this.boosterGain.gain.setValueAtTime(2.5, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      // Chain: sources -> boosterGain -> masterGain -> analyser -> destination
      this.masterGain.connect(this.boosterGain);
      this.boosterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  initAudioStream(url) {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = "anonymous";
      this.audioElement.loop = true;
      this.audioElement.volume = 1.0; // Always max HTML5 volume, let Web Audio control gain
    }
    if (this.audioElement.src !== url) {
      this.audioElement.src = url;
      this.audioElement.volume = 1.0;
    }
    if (this.ctx && !this.mediaSourceNode) {
      try {
        this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioElement);
        this.mediaSourceNode.connect(this.masterGain);
      } catch (e) {
        // Fallback if media element node fails
      }
    }
  }

  setVolume(volPercent) {
    this.volume = Math.max(0, Math.min(1, volPercent / 100));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    // Keep HTML5 audio element at max (1.0) and let Web Audio booster control perceived volume
    if (this.audioElement) {
      this.audioElement.volume = 1.0;
    }
  }

  setPlaybackSpeed(speed = 1.0) {
    this.playbackSpeed = speed;
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
  }

  startMusic() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const track = this.tracks[this.currentTrack] || this.tracks.why_me;

    if (track.type === "stream" && track.url) {
      this.stopSynth();
      this.initAudioStream(track.url);
      if (this.audioElement) {
        this.audioElement.volume = 1.0; // Always max - Web Audio booster handles gain
        this.audioElement.playbackRate = this.playbackSpeed || 1.0;
        this.audioElement.play().catch(() => {
          // If streaming blocked, fallback to synth notes
          this.scheduleNextBeat();
        });
      }
    } else {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.noteStep = 0;
      this.scheduleNextBeat();
    }
  }

  stopMusic() {
    this.isPlaying = false;
    this.stopSynth();
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  stopSynth() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  setTrack(trackKey) {
    if (this.tracks[trackKey]) {
      const wasPlaying = this.isPlaying;
      if (wasPlaying) {
        this.stopMusic();
      }
      this.currentTrack = trackKey;
      if (wasPlaying) {
        this.startMusic();
      }
    }
  }

  scheduleNextBeat() {
    if (!this.isPlaying || !this.ctx) return;

    const track = this.tracks[this.currentTrack] || this.tracks.why_me;
    if (track.type === "stream") return; // Streaming handles playback

    const speed = this.playbackSpeed || 1.0;
    const intervalMs = (60 / (track.bpm * speed) / 2) * 1000;

    const freq = track.notes[this.noteStep % track.notes.length];
    const bassFreq = track.bass[this.noteStep % track.bass.length];

    if (this.volume > 0.01) {
      // Warm sine melody oscillator for "Raave" & stream fallbacks — boosted gain!
      const synthType = (this.currentTrack === "raave" || this.currentTrack === "why_me") ? "sine" : "triangle";
      this.playSynthNote(freq * (speed > 1.5 ? 1.5 : 1), 0.22 / speed, synthType, 0.85);
      
      if (this.noteStep % 2 === 0) {
        this.playSynthNote(bassFreq * (speed > 1.5 ? 1.5 : 1), 0.3 / speed, "sine", 0.9);
      }
    }

    this.noteStep++;
    this.timerId = setTimeout(() => this.scheduleNextBeat(), intervalMs);
  }

  // --- Sound Effects & Dramatic Audio Layers ---

  playFreakoutSFX() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sfxGain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
      osc.frequency.linearRampToValueAtTime(100, now + 0.6);

      sfxGain.gain.setValueAtTime(0.8, now);
      sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(sfxGain);
      sfxGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {}
  }

  playReverseSFX(speed = 3.0) {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.5 / speed;
      const notes = [1000, 800, 600, 400, 200];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + idx * (0.08 / speed));

        sfxGain.gain.setValueAtTime(0.4, now + idx * (0.08 / speed));
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + idx * (0.08 / speed) + duration);

        osc.connect(sfxGain);
        sfxGain.connect(this.ctx.destination);

        osc.start(now + idx * (0.08 / speed));
        osc.stop(now + idx * (0.08 / speed) + duration + 0.05);
      });
    } catch (e) {}
  }

  playSynthNote(freq, duration, type = "sine", gainAmount = 0.3) {
    if (!this.ctx || this.volume <= 0.001) return;

    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(gainAmount, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {}
  }

  // --- Sound Effects & Dramatic Audio Layers ---

  playBetrayalSFX() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sfxGain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

      sfxGain.gain.setValueAtTime(0.8, now);
      sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(sfxGain);
      sfxGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {}
  }

  playApologySFX() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [329.63, 392.00, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        sfxGain.gain.setValueAtTime(0, now + idx * 0.08);
        sfxGain.gain.linearRampToValueAtTime(0.35, now + idx * 0.08 + 0.02);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(sfxGain);
        sfxGain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  playComplimentSFX(franticScore = 1) {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = franticScore > 6 ? 523.25 : 392.00;
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        sfxGain.gain.setValueAtTime(0, now + idx * 0.06);
        sfxGain.gain.linearRampToValueAtTime(0.3, now + idx * 0.06 + 0.01);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

        osc.connect(sfxGain);
        sfxGain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch (e) {}
  }

  playFanfareSFX() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const sfxGain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        sfxGain.gain.setValueAtTime(0, now + idx * 0.1);
        sfxGain.gain.linearRampToValueAtTime(0.4, now + idx * 0.1 + 0.02);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(sfxGain);
        sfxGain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.45);
      });
    } catch (e) {}
  }

  playDragPreventSFX() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sfxGain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.15);

      sfxGain.gain.setValueAtTime(0.3, now);
      sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(sfxGain);
      sfxGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  attachVisualizer(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");

    const render = () => {
      requestAnimationFrame(render);
      const width = canvas.width = canvas.clientWidth;
      const height = canvas.height = canvas.clientHeight;

      ctx2d.clearRect(0, 0, width, height);

      if (!this.analyser || this.volume <= 0.001 || !this.isPlaying) {
        ctx2d.strokeStyle = "#7067e8";
        ctx2d.lineWidth = 2;
        ctx2d.beginPath();
        ctx2d.moveTo(0, height / 2);
        ctx2d.lineTo(width, height / 2);
        ctx2d.stroke();
        return;
      }

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.85;

        const grad = ctx2d.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, "#00e5ff");
        grad.addColorStop(0.5, "#9d4edd");
        grad.addColorStop(1, "#ff5992");

        ctx2d.fillStyle = grad;
        ctx2d.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth + 1;
      }
    };

    render();
  }
}
