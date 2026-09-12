/**
 * Text-to-Speech (TTS) Engine supporting English (en-IN) and Malayalam (ml-IN)
 * with 3x Speed Freakout & Reverse mode support.
 */

let cachedVoices = [];

function loadVoices() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function hasMalayalamScript(text) {
  // Unicode range for Malayalam script (\u0D00-\u0D7F)
  return /[\u0D00-\u0D7F]/.test(text);
}

export function detectLanguage(text) {
  return hasMalayalamScript(text) ? "ml-IN" : "en-IN";
}

export function speak(text, lang = "en-IN", enabled = true, rate = 1.0) {
  if (!enabled || !("speechSynthesis" in window) || !text) return;

  try {
    // Cancel any ongoing speech so lines don't stack up
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = hasMalayalamScript(text) ? "ml-IN" : lang;
    utterance.lang = targetLang;
    
    // Support 3x speed rate for Freakout and 3x Reverse mode!
    utterance.rate = Math.min(3.0, Math.max(0.5, rate));
    utterance.pitch = rate > 1.5 ? 1.4 : 1.1; // Cute high pitch on 3x speed
    utterance.volume = 1.0;

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    let preferredVoice = null;

    if (targetLang === "ml-IN" || hasMalayalamScript(text)) {
      preferredVoice = voices.find(v => 
        v.lang.toLowerCase().includes("ml") || 
        v.name.toLowerCase().includes("malayalam") ||
        v.lang.toLowerCase().includes("hi") ||
        v.lang.toLowerCase().includes("in")
      );
    } else {
      preferredVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLang.toLowerCase()));
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("TTS Error:", e);
  }
}
