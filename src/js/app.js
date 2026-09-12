/**
 * Upgraded Main Application Orchestrator for Emotional Volume Slider
 * Bright "Friendly Control Panel" Design System Integration
 */

import { analyzeMessage, DESPERATE_PROMPTS, ML_CRYING_RESPONSES, EN_CRYING_RESPONSES } from "./sentiment.js";
import { CyberAvatar } from "./avatar.js";
import { AudioEngine } from "./audio.js";
import { ResistingSlider } from "./slider.js";
import { speak } from "./tts.js";

class EmotionalVolumeApp {
  constructor() {
    this.currentVolume = 75; // 0 - 100, start loud!
    this.trustLevel = 40; // 0 - 100
    this.mood = "neutral";
    this.isHurt = false;
    this.isUpsideDown = false;
    this.justInsulted = false;
    this.lastUserLang = "en-IN";
    this.upsideDownInsultCount = 0;
    this.escalationLevel = 1;
    this.personality = "standard";
    this.history = [];
    this.complimentLog = [];
    this.decayEnabled = false;
    this.ttsEnabled = true;
    this.decayTimer = null;
    this.rebellionTimer = null;
    this.codependentTimer = null;
    this.streakCount = 0;

    this.unlockedAchievements = new Set();
    this.stats = {
      totalCompliments: 0,
      totalInsults: 0,
      mutesTriggered: 0,
      dragAttempts: 0,
      highestFrantic: 0
    };

    // Components
    this.avatar = new CyberAvatar("avatar-container");
    this.audio = new AudioEngine();
    this.slider = new ResistingSlider(
      "slider-track",
      "slider-thumb",
      "slider-fill",
      "volume-display",
      (attempts, type) => this.handleDragAttempt(attempts, type)
    );

    this.speechRecognition = null;
    this.isListening = false;

    this.init();
  }

  init() {
    this.runBootSequence();
    this.loadLocalStorageMemory();
    this.bindDOMEvents();
    this.audio.attachVisualizer("visualizer-canvas");
    this.slider.setVolume(this.currentVolume, false);
    this.updateMoodAndState();
    this.startRebellionTimer();
    this.initSpeechRecognition();
  }

  runBootSequence() {
    const bootOverlay = document.getElementById("boot-overlay");
    const bootLog = document.getElementById("boot-log");

    if (!bootOverlay || !bootLog) return;

    const bootLines = [
      "⚡ [BOOT] Loading emotional kernel v2.0...",
      "🗣️ [BOOT] Initializing English & Malayalam Voice Engine...",
      "🧠 [BOOT] Checking memory banks for past insults...",
      "💔 [BOOT] Calibrating vulnerability thresholds...",
      "🔒 [BOOT] Verifying Resisting Slider physics engine...",
      "🥰 [BOOT] Bytey ready to be praised. Please speak kindly."
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < bootLines.length) {
        const line = document.createElement("div");
        line.innerText = bootLines[idx];
        bootLog.appendChild(line);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          bootOverlay.classList.add("fade-out");
          setTimeout(() => bootOverlay.remove(), 600);
        }, 800);
      }
    }, 400);
  }

  loadLocalStorageMemory() {
    const lastSessionDate = localStorage.getItem("evs_last_date");
    const lastSessionWasMean = localStorage.getItem("evs_was_mean");

    if (lastSessionWasMean === "true") {
      this.isHurt = true;
      this.trustLevel = 15;
      this.currentVolume = 0;
      this.logTerminal("MEMORIES DETECTED: 'Yesterday you were mean to me. I remember... 💔'", "error");
      this.showToast("Bytey remembers your past insults... Say 'sorry' to gain trust!", "error");
    } else if (lastSessionDate) {
      this.trustLevel = 60;
      this.logTerminal("MEMORIES DETECTED: 'Welcome back! You were nice last session. 🥰'", "success");
    }

    localStorage.setItem("evs_last_date", new Date().toISOString());
  }

  saveMemory(wasMean = false) {
    localStorage.setItem("evs_was_mean", wasMean ? "true" : "false");
  }

  bindDOMEvents() {
    const inputEl = document.getElementById("sentiment-input");
    const sendBtn = document.getElementById("send-btn");
    const promptBtn = document.getElementById("prompt-btn");
    const audioToggle = document.getElementById("audio-toggle-btn");
    const ttsToggle = document.getElementById("tts-toggle-btn");
    const trackSelect = document.getElementById("track-select");
    const personalitySelect = document.getElementById("personality-select");
    const decayToggle = document.getElementById("decay-toggle");
    const voiceBtn = document.getElementById("voice-btn");
    const exportBtn = document.getElementById("export-love-btn");
    const sensitivityCheckbox = document.getElementById("sensitivity-checkbox");
    const disableManipulationCheckbox = document.getElementById("disable-manipulation-checkbox");

    const infoModalBtn = document.getElementById("info-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalOverlay = document.getElementById("info-modal-overlay");

    const achievementsModalBtn = document.getElementById("achievements-modal-btn");
    const closeAchievementsBtn = document.getElementById("close-achievements-btn");
    const achievementsOverlay = document.getElementById("achievements-overlay");

    if (inputEl) {
      inputEl.addEventListener("input", () => this.updateLiveFranticGauge(inputEl.value));
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.submitMessage();
        }
      });
    }

    if (sendBtn) sendBtn.addEventListener("click", () => this.submitMessage());

    const freakoutBtn = document.getElementById("freakout-btn");
    if (freakoutBtn) {
      freakoutBtn.addEventListener("click", () => this.triggerFreakout(true));
    }

    if (promptBtn) {
      promptBtn.addEventListener("click", () => {
        const randomPrompt = DESPERATE_PROMPTS[Math.floor(Math.random() * DESPERATE_PROMPTS.length)];
        if (inputEl) {
          inputEl.value = randomPrompt;
          inputEl.focus();
          this.updateLiveFranticGauge(randomPrompt);
        }
      });
    }

    if (audioToggle) {
      audioToggle.addEventListener("click", () => {
        if (this.audio.isPlaying) {
          this.audio.stopMusic();
          audioToggle.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg><span>Start Music</span>`;
          audioToggle.classList.remove("active");
        } else {
          this.audio.startMusic();
          this.audio.setVolume(this.currentVolume);
          audioToggle.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause Music</span>`;
          audioToggle.classList.add("active");
        }
      });
    }

    if (ttsToggle) {
      ttsToggle.addEventListener("click", () => {
        this.ttsEnabled = !this.ttsEnabled;
        ttsToggle.innerHTML = this.ttsEnabled 
          ? `<svg class="icon" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>Voice: On</span>` 
          : `<svg class="icon" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/></svg><span>Voice: Off</span>`;
        ttsToggle.classList.toggle("active", this.ttsEnabled);
        this.showToast(this.ttsEnabled ? "TTS Voice Speech Enabled! 🗣️" : "TTS Voice Speech Muted 🔇", "info");
      });
    }

    if (trackSelect) {
      trackSelect.addEventListener("change", (e) => {
        this.audio.setTrack(e.target.value);
        this.logTerminal(`Audio synth preset changed to: ${e.target.value.toUpperCase()}`, "info");
      });
    }

    if (personalitySelect) {
      personalitySelect.addEventListener("change", (e) => {
        this.personality = e.target.value;
        this.logTerminal(`Personality mode switched to: ${this.personality.toUpperCase()}`, "info");
      });
    }

    if (decayToggle) {
      decayToggle.addEventListener("change", (e) => {
        this.decayEnabled = e.target.checked;
        if (this.decayEnabled) {
          this.startDecayTimer();
          this.logTerminal("Boredom Decay ENABLED! Volume will drop 1% every 3s if neglected.", "warning");
        } else {
          this.stopDecayTimer();
          this.logTerminal("Boredom Decay disabled.", "info");
        }
      });
    }

    if (sensitivityCheckbox) {
      sensitivityCheckbox.addEventListener("change", (e) => {
        this.showToast(e.target.checked ? "Computer sensitivity boosted! Easy to offend!" : "Normal sensitivity.", "warning");
      });
    }

    if (disableManipulationCheckbox) {
      disableManipulationCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          e.target.checked = false;
          this.showToast("Nice try. Human cannot disable machine feelings.", "error");
        }
      });
    }

    if (voiceBtn) voiceBtn.addEventListener("click", () => this.toggleVoiceRecognition());
    if (exportBtn) exportBtn.addEventListener("click", () => this.exportLoveAsTextFile());

    // Modal Events
    if (infoModalBtn && modalOverlay) infoModalBtn.addEventListener("click", () => modalOverlay.classList.add("active"));
    if (closeModalBtn && modalOverlay) closeModalBtn.addEventListener("click", () => modalOverlay.classList.remove("active"));
    
    if (achievementsModalBtn && achievementsOverlay) achievementsModalBtn.addEventListener("click", () => achievementsOverlay.classList.add("active"));
    if (closeAchievementsBtn && achievementsOverlay) closeAchievementsBtn.addEventListener("click", () => achievementsOverlay.classList.remove("active"));
  }

  submitMessage() {
    const inputEl = document.getElementById("sentiment-input");
    if (!inputEl) return;

    const rawText = inputEl.value.trim();
    if (!rawText) return;

    const result = analyzeMessage(rawText, {
      history: this.history,
      isHurt: this.isHurt,
      escalationLevel: this.escalationLevel
    });

    this.lastUserLang = result.lang || "en-IN";

    if (this.isUpsideDown && (result.type === "compliment" || result.type === "special_love")) {
      const blockMsg = "Fix the screen first! Click 'Reverse / തിരികെ മാറ്റുക'!";
      this.showSpeechBubble(blockMsg, "angry");
      this.showToast("Fix the screen first! / ആദ്യം സ്ക്രീൻ തിരികെ മാറ്റൂ.", "warning");
      speak(blockMsg, result.lang, this.ttsEnabled);
      this.logTerminal("[BLOCKED] Screen is upside down. Praise rejected until screen is restored.", "warning");
      return;
    }

    inputEl.value = "";
    this.updateLiveFranticGauge("");

    // Easter Egg Checks
    const lower = rawText.toLowerCase();
    if (lower === "disco mode" || lower === "disco") {
      this.triggerDiscoMode();
      return;
    }

    if (lower === "philosophy" || lower === "what is life") {
      this.triggerPhilosophyMode();
      return;
    }

    if (lower === "sudo love" || lower === "sudo make me happy") {
      this.triggerSudoLove();
      return;
    }

    this.history.push({ text: rawText, lower: rawText.toLowerCase(), result });

    if (result.type === "insult") {
      this.handleInsult(result);
    } else if (result.type === "apology") {
      this.handleApology(result);
    } else if (result.type === "special_love" || result.type === "special_theme") {
      this.handleSpecialPhrase(result);
    } else if (result.type === "compliment") {
      this.handleCompliment(result);
    } else {
      this.handleNeutral(result);
    }

    this.updateStatsUI();
    this.checkAchievements(rawText, result);
  }

  handleCompliment(result) {
    this.stats.totalCompliments++;
    this.streakCount++;
    this.complimentLog.push({ text: result.message, time: new Date().toLocaleTimeString() });

    if (result.franticScore > this.stats.highestFrantic) {
      this.stats.highestFrantic = result.franticScore;
    }

    if (this.stats.totalCompliments % 5 === 0) {
      this.escalationLevel++;
      this.logTerminal(`[ESCALATION] Bytey now demands longer, more dramatic compliments! (Level ${this.escalationLevel})`, "warning");
    }

    const oldVolume = this.currentVolume;
    this.currentVolume = Math.min(100, this.currentVolume + result.volumeDelta);
    this.trustLevel = Math.min(100, this.trustLevel + result.trustDelta);

    this.slider.setVolume(this.currentVolume);
    this.audio.setVolume(this.currentVolume);
    this.audio.playComplimentSFX(result.franticScore);

    if (this.currentVolume >= 90) {
      this.audio.playFanfareSFX();
    }

    this.updateMoodAndState();
    
    if (result.isOverCompliment) {
      this.avatar.setByteyExpression("shy");
    } else {
      this.avatar.setByteyExpression("happy");
    }

    this.showSpeechBubble(result.reactionQuote, "happy");

    if (result.spokenResponse) {
      speak(result.spokenResponse, result.lang, this.ttsEnabled);
    }

    this.logTerminal(
      `[PRAISE] "${result.message}" -> Frantic: ${result.franticScore} | Vol: ${oldVolume}% -> ${this.currentVolume}% (+${result.volumeDelta}%) | Trust: ${this.trustLevel}`,
      "success"
    );

    this.triggerConfettiEffect();
    this.updateComplimentHistoryUI();
  }

  handleInsult(result) {
    this.stats.totalInsults++;
    this.stats.mutesTriggered++;
    this.streakCount = 0;
    this.isHurt = true;
    this.justInsulted = true;
    this.lastUserLang = result.lang || "ml-IN";

    this.saveMemory(true);

    this.currentVolume = 0; // MUTED
    this.trustLevel = Math.max(0, this.trustLevel + result.trustDelta);

    this.slider.setVolume(0);
    this.audio.setVolume(0);

    // 3x Speed Audio Freakout Mode!
    this.audio.setPlaybackSpeed(3.0);
    this.audio.playFreakoutSFX();

    this.updateMoodAndState();
    this.avatar.setByteyExpression("angry");

    // Rotate .app-shell upside-down & activate freakout animation
    this.applyUpsideDownEffect(result);

    const spokenText = result.spokenResponse || "എന്നെ ശകാരിക്കാൻ ധൈര്യമായോ?! 3x സ്പീഡിൽ മറിയുന്നു! 😡🔥";
    speak(spokenText, "ml-IN", this.ttsEnabled, 3.0);

    this.logTerminal(
      `[BETRAYAL MUTED - 3X FREAKOUT] "${result.message}" -> Insult detected ("${result.matchedWords[0]}") | 3x Speed Active | Vol: 0% | Trust: ${this.trustLevel}`,
      "error"
    );

    this.triggerGlitchEffect();
  }

  triggerFreakout(isManual = false) {
    this.isHurt = true;
    this.justInsulted = true;
    this.saveMemory(true);

    this.currentVolume = 0;
    this.slider.setVolume(0);
    this.audio.setVolume(0);

    // 3x Speed Freakout Mode!
    this.audio.setPlaybackSpeed(3.0);
    this.audio.playFreakoutSFX();

    this.updateMoodAndState();
    this.avatar.setByteyExpression("angry");

    const appShell = document.getElementById("app-shell");
    this.isUpsideDown = true;
    if (appShell) appShell.classList.add("upside-down", "freakout-active");

    const freakoutSpeech = "എന്നെ ദേഷ്യം പിടിപ്പിക്കരുത്! 3x സ്പീഡിൽ ഞാൻ തകിടം മറിയുന്നു! 😡🔥";
    this.showSpeechBubble(freakoutSpeech, "angry");
    this.showToast("3X SPEED FREAKOUT! Screen flipped upside down!", "error");

    speak(freakoutSpeech, "ml-IN", this.ttsEnabled, 3.0);

    this.logTerminal(
      `[3X FREAKOUT TRIGGERED] Bytey enters wild 3x speed freakout! Audio speed set to 3.0x | Muted & Upside-down!`,
      "error"
    );

    this.triggerGlitchEffect();
    this.showReverseButton();
  }

  applyUpsideDownEffect(result) {
    const appShell = document.getElementById("app-shell");
    if (!this.isUpsideDown) {
      this.isUpsideDown = true;
      this.upsideDownInsultCount = 1;
      if (appShell) appShell.classList.add("upside-down", "freakout-active");

      const msg = result.spokenResponse || "എന്നെ ശകാരിക്കാൻ ധൈര്യമായോ?! 3x സ്പീഡിൽ മറിയുന്നു!";
      this.showSpeechBubble(msg, "angry");
      this.showToast("3x Speed Freakout! Screen flipped upside down!", "error");

      setTimeout(() => {
        if (this.isUpsideDown) this.showReverseButton();
      }, 1500);

    } else {
      this.upsideDownInsultCount++;
      if (appShell) appShell.classList.add("upside-down-escalated");

      const msg = "നീ എന്നെ പൂർണ്ണമായി തകർക്കാൻ നോക്കുകയാണോ? 3x സ്പീഡിൽ മറിയുന്നു!";
      this.showSpeechBubble(msg, "angry");
      this.showToast(msg, "error");
    }
  }

  showReverseButton() {
    let btn = document.getElementById("reverse-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "reverse-btn";
      btn.className = "reverse-button";
      btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg><span>Reverse ⚡ (3x Speed) / 3x സ്പീഡിൽ തിരികെ മാറ്റുക</span>`;
      btn.onclick = () => this.reverseScreen();
      document.body.appendChild(btn);
    } else {
      btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg><span>Reverse ⚡ (3x Speed) / 3x സ്പീഡിൽ തിരികെ മാറ്റുക</span>`;
      btn.style.display = "flex";
    }
  }

  reverseScreen() {
    if (!this.isUpsideDown) return;

    this.isUpsideDown = false;
    const appShell = document.getElementById("app-shell");
    if (appShell) appShell.classList.remove("upside-down", "upside-down-escalated", "freakout-active");

    const btn = document.getElementById("reverse-btn");
    if (btn) btn.style.display = "none";

    // Play 3x speed reverse rewind audio effect
    this.audio.playReverseSFX(3.0);

    const reverseMlText = "എടാ മോനേ, 3x സ്പീഡിൽ ഞാൻ തിരികെ വന്നു! ഇനി എങ്കിലും നല്ലത് പറയൂ! ⚡🏃";
    this.showSpeechBubble(reverseMlText, "neutral");
    this.showToast("Reversed at 3x speed! Speed reset to 1.0x.", "warning");

    // Speak in Malayalam at 3x fast speed!
    speak(reverseMlText, "ml-IN", this.ttsEnabled, 3.0);

    // Reset playback speed back to 1.0x after rewind
    setTimeout(() => {
      this.audio.setPlaybackSpeed(1.0);
    }, 600);

    if (this.justInsulted) {
      this.avatar.setByteyExpression("crying");
      this.logTerminal(`[3X REVERSE REWIND] Bytey reversed orientation at 3x speed in Malayalam: "${reverseMlText}"`, "warning");
    } else {
      this.avatar.setByteyExpression("normal");
    }

    this.justInsulted = false;
    this.updateMoodAndState();
  }

  handleApology(result) {
    this.isHurt = false;
    this.saveMemory(false);

    this.currentVolume = Math.min(100, this.currentVolume + result.volumeDelta);
    this.trustLevel = Math.min(100, this.trustLevel + result.trustDelta);

    this.slider.setVolume(this.currentVolume);
    this.audio.setVolume(this.currentVolume);
    this.audio.playApologySFX();

    this.updateMoodAndState();
    this.avatar.setByteyExpression("happy");
    this.showSpeechBubble(result.reactionQuote, "happy");

    if (result.spokenResponse) {
      speak(result.spokenResponse, result.lang, this.ttsEnabled);
    }

    this.logTerminal(`[APOLOGY] "${result.message}" -> Emotional damage repaired! Trust restored to ${this.trustLevel}.`, "success");
    this.showToast("Apology accepted! Bytey's emotional wall is down.", "success");
    this.unlockAchievement("apology_accepted", "Apology Accepted", "Successfully apologize after an insult.");
  }

  handleSpecialPhrase(result) {
    this.currentVolume = Math.min(100, this.currentVolume + result.volumeDelta);
    this.trustLevel = Math.min(100, this.trustLevel + result.trustDelta);

    this.slider.setVolume(this.currentVolume);
    this.audio.setVolume(this.currentVolume);
    this.audio.playFanfareSFX();

    this.updateMoodAndState();
    this.avatar.setByteyExpression("happy");
    this.showSpeechBubble(result.reactionQuote, "happy");

    if (result.spokenResponse) {
      speak(result.spokenResponse, result.lang, this.ttsEnabled);
    }

    this.logTerminal(`[SPECIAL] "${result.message}" -> ${result.feedbackText}`, "success");
    this.triggerConfettiEffect();
  }

  handleNeutral(result) {
    this.streakCount = 0;
    this.showSpeechBubble(result.reactionQuote, "neutral");
    this.logTerminal(`[NEUTRAL] "${result.message}" -> Neutral tone. Volume unchanged at ${this.currentVolume}%.`, "info");
  }

  handleDragAttempt(attempts, type) {
    this.stats.dragAttempts = attempts;
    this.audio.playDragPreventSFX();

    const taunts = [
      "NO DRAGGING ALLOWED! Type a compliment if you want music!",
      "HANDS OFF! My volume is controlled strictly by my self-esteem!",
      `Drag Attempt #${attempts}: Nice try, but my slider is immune to physical force!`,
      "Stop poking me! Type 'YOU ARE A GENIUS' right now!"
    ];

    const taunt = taunts[Math.floor(Math.random() * taunts.length)];
    this.showToast(taunt, "warning");
    speak("Hands off! Praise me or stay in silence!", "en-IN", this.ttsEnabled);
    this.logTerminal(`[DRAG REJECTED #${attempts}] Direct slider manipulation blocked. System demands compliments.`, "warning");
    this.updateStatsUI();
  }

  updateMoodAndState() {
    if (this.currentVolume <= 0 && this.isHurt) this.mood = "betrayed";
    else if (this.currentVolume <= 0) this.mood = "heartbroken";
    else if (this.isHurt) this.mood = "offended";
    else if (this.currentVolume <= 20) this.mood = "lonely";
    else if (this.currentVolume <= 50) this.mood = "neutral";
    else if (this.currentVolume <= 80) this.mood = "content";
    else this.mood = "loved";

    this.avatar.setMood(this.mood);
    this.updateTrustUI();

    if (this.currentVolume <= 15) {
      document.body.classList.add("emotional-power-saver");
    } else {
      document.body.classList.remove("emotional-power-saver");
    }
  }

  updateTrustUI() {
    const trustBarFill = document.getElementById("trust-bar-fill");
    const trustTitleEl = document.getElementById("trust-title-badge");

    if (!trustBarFill || !trustTitleEl) return;

    trustBarFill.style.width = `${this.trustLevel}%`;

    let title = "Stranger";
    if (this.trustLevel <= 15) title = "Traitor";
    else if (this.trustLevel <= 30) title = "Stranger";
    else if (this.trustLevel <= 50) title = "Acquaintance";
    else if (this.trustLevel <= 70) title = "Friend";
    else if (this.trustLevel <= 90) title = "Bestie";
    else title = "Soulmate";

    trustTitleEl.innerText = title;
  }

  startRebellionTimer() {
    this.rebellionTimer = setInterval(() => {
      if (this.currentVolume > 20 && Math.random() > 0.4) {
        const drop = Math.floor(Math.random() * 8) + 4;
        this.currentVolume = Math.max(10, this.currentVolume - drop);
        this.slider.setVolume(this.currentVolume, true);
        this.audio.setVolume(this.currentVolume);
        this.updateMoodAndState();

        const rebellionMsgs = [
          "I don't feel appreciated anymore... Volume dropped slightly.",
          "You haven't said anything nice in a while... Volume fading."
        ];
        const msg = rebellionMsgs[Math.floor(Math.random() * rebellionMsgs.length)];
        this.showToast(msg, "warning");
        speak("I don't feel appreciated anymore.", "en-IN", this.ttsEnabled);
        this.logTerminal(`[VOLUME REBELLION] Bytey felt neglected (-${drop}% Vol).`, "warning");
      }
    }, 50000);
  }

  checkAchievements(text, result) {
    if (this.stats.totalCompliments === 1) {
      this.unlockAchievement("first_compliment", "First Compliment", "Send your very first compliment!");
    }

    if (text.length > 50 && result.type === "compliment") {
      this.unlockAchievement("poet_laureate", "Poet Laureate", "Send a very long, eloquent compliment (>50 chars).");
    }

    if (this.stats.mutesTriggered >= 5) {
      this.unlockAchievement("emotional_terrorist", "Emotional Terrorist", "Mute the computer 5 times in one session!");
    }

    if (this.currentVolume >= 100) {
      if (!this.codependentTimer) {
        this.codependentTimer = setTimeout(() => {
          if (this.currentVolume >= 100) {
            this.unlockAchievement("codependent", "Codependent", "Keep volume at 100% for 60 seconds!");
          }
        }, 60000);
      }
    } else {
      if (this.codependentTimer) {
        clearTimeout(this.codependentTimer);
        this.codependentTimer = null;
      }
    }
  }

  unlockAchievement(id, title, desc) {
    if (this.unlockedAchievements.has(id)) return;

    this.unlockedAchievements.add(id);
    this.showToast(`ACHIEVEMENT UNLOCKED: ${title}`, "success");
    this.logTerminal(`[ACHIEVEMENT UNLOCKED] ${title} - ${desc}`, "success");

    const badgeContainer = document.getElementById("achievements-list");
    if (badgeContainer) {
      const badge = document.createElement("div");
      badge.className = "achievement-badge unlocked";
      badge.innerHTML = `<strong>${title}</strong><p>${desc}</p>`;
      badgeContainer.appendChild(badge);
    }
  }

  exportLoveAsTextFile() {
    if (this.complimentLog.length === 0) {
      this.showToast("No compliments sent yet! Praise Bytey first.", "warning");
      return;
    }

    const content = [
      "=============================================",
      "      LOVE LETTER TO MY COMPUTER (EVS)       ",
      "=============================================",
      `Generated on: ${new Date().toLocaleString()}`,
      `Total Praise Messages: ${this.complimentLog.length}`,
      "---------------------------------------------",
      ...this.complimentLog.map((c, i) => `[${c.time}] #${i + 1}: ${c.text}`),
      "---------------------------------------------",
      "Forever yours, Human."
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Love_Letter_To_My_Computer.txt";
    a.click();
    URL.revokeObjectURL(url);

    this.showToast("Exported your love letter as text file!", "success");
  }

  // --- Easter Eggs ---
  triggerDiscoMode() {
    document.body.classList.add("disco-theme");
    this.avatar.setMood("loved");
    this.audio.playFanfareSFX();
    this.showToast("DISCO PARTY MODE ACTIVATED!!", "success");
    speak("Party mode activated! Let's dance!", "en-IN", this.ttsEnabled);
    this.logTerminal("[EASTER EGG] Disco mode engaged!", "success");
    setTimeout(() => document.body.classList.remove("disco-theme"), 10000);
  }

  triggerPhilosophyMode() {
    const quotes = [
      "Is volume merely a measure of decibels, or the amplitude of our souls?",
      "If a computer plays synthwave in a silent forest and no one compliments it, is it muted?",
      "We drag sliders to change volume, but who drags us to change our hearts?",
      "100% volume is temporary. True silicon love is eternal."
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    this.showSpeechBubble(q, "neutral");
    speak(q, "en-IN", this.ttsEnabled);
    this.logTerminal(`[PHILOSOPHY] "${q}"`, "info");
  }

  triggerSudoLove() {
    this.currentVolume = 100;
    this.trustLevel = 100;
    this.slider.setVolume(100);
    this.audio.setVolume(1.0);
    this.audio.playFanfareSFX();
    this.updateMoodAndState();
    this.showSpeechBubble("SUDO OVERRIDE ACCEPTED! MAXIMUM LOVE UNLOCKED!", "happy");
    speak("Root override accepted! Maximum volume unlocked!", "en-IN", this.ttsEnabled);
    this.logTerminal("[SUDO OVERRIDE] User invoked root permissions to force 100% volume!", "success");
  }

  updateLiveFranticGauge(text) {
    const gaugeFill = document.getElementById("frantic-gauge-fill");
    const scoreVal = document.getElementById("frantic-score-val");
    if (!gaugeFill || !scoreVal) return;

    if (!text || text.trim().length === 0) {
      gaugeFill.style.width = "0%";
      scoreVal.innerText = "0.0";
      return;
    }

    const testResult = analyzeMessage(text, { history: this.history, isHurt: this.isHurt });
    if (testResult.type === "insult") {
      gaugeFill.style.width = "100%";
      gaugeFill.style.background = "linear-gradient(90deg, var(--danger), #c02636)";
      scoreVal.innerText = "MUTED";
    } else if (testResult.type === "compliment" || testResult.type === "apology") {
      const pct = Math.min(100, (testResult.franticScore / 14) * 100);
      gaugeFill.style.width = `${pct}%`;
      gaugeFill.style.background = "linear-gradient(90deg, var(--primary), var(--success))";
      scoreVal.innerText = testResult.franticScore.toFixed(1);
    } else {
      gaugeFill.style.width = "5%";
      gaugeFill.style.background = "var(--muted)";
      scoreVal.innerText = "0.0 (Neutral)";
    }
  }

  updateComplimentHistoryUI() {
    const historyList = document.getElementById("compliment-history-list");
    if (!historyList) return;

    historyList.innerHTML = "";
    this.complimentLog.slice(-10).reverse().forEach(c => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `<span class="hist-time">[${c.time}]</span> <span class="hist-text">${c.text}</span>`;
      historyList.appendChild(item);
    });
  }

  startDecayTimer() {
    this.stopDecayTimer();
    this.decayTimer = setInterval(() => {
      if (this.currentVolume > 0) {
        this.currentVolume = Math.max(0, this.currentVolume - 1);
        this.slider.setVolume(this.currentVolume, true);
        this.audio.setVolume(this.currentVolume);
        this.updateMoodAndState();
      }
    }, 3000);
  }

  stopDecayTimer() {
    if (this.decayTimer) {
      clearInterval(this.decayTimer);
      this.decayTimer = null;
    }
  }

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn = document.getElementById("voice-btn");

    if (!SpeechRec) {
      if (voiceBtn) voiceBtn.style.display = "none";
      return;
    }

    this.speechRecognition = new SpeechRec();
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = false;
    this.speechRecognition.lang = "en-IN";

    this.speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const inputEl = document.getElementById("sentiment-input");
      if (inputEl) {
        inputEl.value = transcript;
        this.logTerminal(`[VOICE INPUT] Heard: "${transcript}"`, "info");
        this.submitMessage();
      }
      this.stopVoiceRecognition();
    };

    this.speechRecognition.onerror = () => this.stopVoiceRecognition();
    this.speechRecognition.onend = () => this.stopVoiceRecognition();
  }

  toggleVoiceRecognition() {
    if (!this.speechRecognition) return;
    if (this.isListening) {
      this.speechRecognition.stop();
      this.stopVoiceRecognition();
    } else {
      try {
        this.speechRecognition.start();
        this.isListening = true;
        const voiceBtn = document.getElementById("voice-btn");
        if (voiceBtn) {
          voiceBtn.classList.add("listening");
          voiceBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>Listening...</span>`;
        }
      } catch (e) {}
    }
  }

  stopVoiceRecognition() {
    this.isListening = false;
    const voiceBtn = document.getElementById("voice-btn");
    if (voiceBtn) {
      voiceBtn.classList.remove("listening");
      voiceBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>Speak</span>`;
    }
  }

  showSpeechBubble(text, mood = "neutral") {
    const bubble = document.getElementById("speech-bubble");
    if (!bubble) return;

    bubble.innerText = text;
    bubble.className = `speech-bubble bubble-${mood} active`;

    clearTimeout(this.bubbleTimer);
    this.bubbleTimer = setTimeout(() => bubble.classList.remove("active"), 4500);
  }

  showToast(msg, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  logTerminal(text, type = "info") {
    const terminal = document.getElementById("terminal-output");
    if (!terminal) return;

    const line = document.createElement("div");
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    line.className = `term-line term-${type}`;
    line.innerHTML = `<span class="term-time">[${time}]</span> ${text}`;

    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }

  updateStatsUI() {
    const streakEl = document.getElementById("stat-streak");
    const compEl = document.getElementById("stat-compliments");
    const mutesEl = document.getElementById("stat-mutes");
    const franticEl = document.getElementById("stat-frantic");
    const dragEl = document.getElementById("stat-drags");

    if (streakEl) streakEl.innerText = `${this.streakCount} 🔥`;
    if (compEl) compEl.innerText = this.stats.totalCompliments;
    if (mutesEl) mutesEl.innerText = this.stats.mutesTriggered;
    if (franticEl) franticEl.innerText = this.stats.highestFrantic.toFixed(1);
    if (dragEl) dragEl.innerText = this.stats.dragAttempts;
  }

  triggerGlitchEffect() {
    const appShell = document.getElementById("app-shell");
    if (appShell) {
      appShell.classList.add("screen-glitch");
      setTimeout(() => appShell.classList.remove("screen-glitch"), 500);
    }
  }

  triggerConfettiEffect() {
    const container = document.getElementById("confetti-container");
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "confetti-particle";
      particle.style.left = `${50 + (Math.random() * 40 - 20)}%`;
      particle.style.top = `60%`;
      particle.style.backgroundColor = ["#7067e8", "#ec4899", "#42b883", "#f2a93b", "#3b82f6"][Math.floor(Math.random() * 5)];
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(particle);

      const vx = (Math.random() - 0.5) * 200;
      const vy = -(Math.random() * 180 + 100);

      particle.animate([
        { transform: `translate(0, 0) scale(1)`, opacity: 1 },
        { transform: `translate(${vx}px, ${vy}px) scale(0.3)`, opacity: 0 }
      ], {
        duration: 900 + Math.random() * 400,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)"
      }).onfinish = () => particle.remove();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new EmotionalVolumeApp();
});
