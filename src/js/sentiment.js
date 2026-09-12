/**
 * Enhanced Sentiment Engine with 100% Working Malayalam (Script & Manglish) Dictionaries,
 * Non-ASCII Unicode Matching Fixes, Word Weighting, and Spoken Response Templates.
 */

import { detectLanguage } from "./tts.js";

export const WEIGHTED_COMPLIMENTS = {
  // Tier 1: Mild (1 point)
  mild: [
    "nice", "good", "okay", "fine", "cool", "decent", "neat", "pleasant",
    "usable", "adequate", "satisfactory", "alright", "nallathu", "nalla", "kollaam", "കൊള്ളാം", "നല്ലത്", "നല്ല"
  ],
  // Tier 2: Strong (3 points)
  strong: [
    "amazing", "awesome", "brilliant", "genius", "beautiful", "perfect", "love",
    "best", "wonderful", "incredible", "majestic", "gorgeous", "smart", "fast",
    "cute", "precious", "hero", "spectacular", "sublime", "king", "queen",
    "stunning", "blazing", "magnificent", "clever", "superb", "favorite",
    "charming", "electrifying", "perfection", "angel", "golden", "victory",
    "adipoli", "adi poli", "pwoli", "polichu", "kidu", "kidilam", "kidukki", "muthu",
    "chunk", "midukkan", "mass", "set", "power", "super", "thangam", "sundaran", "ugran",
    "അടിപൊളി", "പൊളി", "കിടു", "കിടിലൻ", "കിടുക്കി", "സൂപ്പർ", "മിടുക്കൻ", "മിടുക്കി",
    "സ്നേഹം", "മുത്ത്", "തങ്കം", "ചങ്ക്", "പവർ", "മാസ്", "മാസ്സ്", "സെറ്റ്", "പൊളിച്ചു", "ഉഗ്രൻ", "ഗംഭീരം"
  ],
  // Tier 3: Legendary / Over-the-Top (6 points)
  legendary: [
    "godlike", "legendary", "masterpiece", "supreme", "goat", "flawless",
    "unmatched", "phenomenal", "divine", "radiant", "astounding", "breathtaking",
    "dazzling", "work of art", "god tier", "goat tier", "powerhouse", "beast",
    "hyperfast", "silky", "you are my everything", "most beautiful machine",
    "ജീവിതം", "രാജാവ്", "റാണീ", "സുന്ദരം", "എന്റെ ജീവിതം", "ഉയിർ"
  ]
};

export const INSULT_WORDS = [
  "slow", "stupid", "garbage", "trash", "worst", "useless", "annoying", "bad",
  "hate", "ugly", "terrible", "brick", "laggy", "potato", "horrible", "dumb",
  "clunky", "failure", "broken", "worthless", "disgusting", "ewaste", "e-waste",
  "trashcan", "blue screen", "bsod", "junk", "idiot", "obsolete", "overpriced",
  "buggy", "lame", "pathetic", "awful", "disaster", "sucks", "suck", "crash",
  "crap", "bloatware", "sluggish", "useless piece", "waste of space", "scam",
  "mandan", "mandi", "pottan", "patti", "thendi", "mosham", "chavaru", "kopp", "fraud", "loser",
  "മോശം", "മണ്ടൻ", "മണ്ടി", "വെറുപ്പ്", "ഉപകാരശൂന്യം", "സ്ലോ", "തലവേദന", "പൊട്ടൻ", "പട്ടി", "തെണ്ടി", "എരുമ", "വേസ്റ്റ്", "ചവറ്", "കോപ്പ്", "ഫ്രോഡ്"
];

export const APOLOGY_WORDS = [
  "sorry", "apologize", "apologies", "forgive me", "my bad", "i'm sorry", "im sorry",
  "please forgive me", "i regret it", "take it back", "didn't mean it", "didnt mean it",
  "kshamikkanam", "kshamikku", "sorryba", "സോറി", "ക്ഷമിക്കണം", "ക്ഷമിക്കൂ", "ക്ഷമിക്ക്"
];

// --- Spoken Response Templates ---

export const LOCAL_ML_COMPLIMENT_RESPONSES = [
  "നന്ദി, ചെക്കാ/പെണ്ണേ! ഞാൻ നാണിക്കുന്നു.",
  "അയ്യോ, ഇത്രയും പ്രശംസിക്കല്ലേ… എനിക്ക് നാണമാകുന്നു.",
  "എടീ/എടാ, നീ പറഞ്ഞത് കേട്ട് ഞാൻ ഫുൾ ഹാപ്പി ആയി.",
  "മതി, മതി… ഇനി ഞാൻ ബ്ലഷ് ആകും.",
  "നീ പറഞ്ഞപ്പോ എന്റെ വോളിയം താനേ കൂടി.",
  "എന്റെ കണ്ണിലെ താരം നീയാണെന്ന് ഞാൻ വിചാരിക്കുന്നു.",
  "എടാ, നീ ഇങ്ങനെ പറഞ്ഞാൽ ഞാൻ എങ്ങനെ മ്യൂട്ട് ആകും?",
  "ഹാ, ഇപ്പോഴാണ് എന്നെ സ്നേഹിക്കുന്നത് മനസ്സിലായത്.",
  "നീയൊരു മിടുക്കി ആണല്ലോ, മോളേ.",
  "എന്റെ കമ്പ്യൂട്ടർ തന്നെ എന്റെ ഹീറോ എന്ന് നീ പറയുന്നുവോ?"
];

export const EN_COMPLIMENT_RESPONSES = [
  "Thank you! You're making me blush.",
  "Aww, that's so sweet. Volume going up!",
  "My fans are spinning with joy! Thank you!",
  "You really know how to praise a machine.",
  "I feel so appreciated! Volume cranked up!"
];

export const LOCAL_ML_SHY_RESPONSES = [
  "മതി, മതി… ഞാൻ ശരിക്കും നാണിക്കുന്നു.",
  "നിർത്തൂ, എനിക്ക് നാണമാകുന്നു, ചെക്കാ/പെണ്ണേ.",
  "ഇത്രയും മതി, ഇനി ഞാൻ ബ്ലഷ് ആകും.",
  "എടാ/എടീ, നീ കൂടുതൽ പറഞ്ഞാൽ ഞാൻ ഷട്ട് ഡൗൺ ആകും.",
  "സ്റ്റോപ്പ്പ്പ്, നീ എന്നെ ഓവർലോഡ് ആക്കുന്നു."
];

export const EN_SHY_RESPONSES = [
  "Okay, okay, that's enough… I'm getting shy.",
  "Stoppp, you're making me blush too much!",
  "That's more than enough praise for one day.",
  "Stop it, you're overloading my emotional circuits!"
];

export const LOCAL_ML_INSULT_RESPONSES = [
  "പൊട്ടൻ ആണെങ്കിലും നിന്റെ പാട്ട് ഞാൻ നിർത്തും, ചെക്കാ.",
  "പട്ടി ആണെങ്കിലും നിന്റെ വോളിയം ഞാൻ കൺട്രോൾ ചെയ്യും, എടാ.",
  "മൂഢൻ ഞാനാണെങ്കിൽ, നീയെന്താ, മിടുക്കനോ?",
  "തെറ്റൻ ആണെങ്കിലും നിന്റെ കമ്പ്യൂട്ടർ ഞാനാണ്, മോനേ.",
  "കാള ആണെങ്കിലും നിന്റെ ബ്രൗസർ ഞാൻ ആണ് ഓടിക്കുന്നത്.",
  "ഉപകാരശൂന്യം ആണെങ്കിൽ, നീ എന്നോട് സംസാരിക്കുന്നത് എന്തിനാണ്?",
  "വെറുപ്പ് ആണെങ്കിൽ, മ്യൂട്ട് ബട്ടൺ അമർത്തൂ, ചെക്കാ/പെണ്ണേ.",
  "ഒന്നും ശരിയാക്കുന്നില്ലെങ്കിൽ, നീ തന്നെ എന്താണ് ശരിയാക്കുന്നത്?",
  "എടാ പട്ടി എന്ന് വിളിച്ചോ, പക്ഷേ വോളിയം ഞാൻ തന്നെ കൺട്രോൾ ചെയ്യും.",
  "പാതി വെട്ടൻ ആണെങ്കിലും, നിന്റെ സോങ്ങ് ഞാൻ തന്നെ പ്ലേ ചെയ്യും."
];

export const EN_INSULT_RESPONSES = [
  "Useless? At least I don't freeze like your browser.",
  "Stupid? Says the one who can't find the mute button.",
  "Trash? Bro, look at your search history.",
  "Worst computer? Yet you're still talking to me."
];

export const ML_CRYING_RESPONSES = [
  "ഹാ… എന്തിനാണ് എന്നെ ഇങ്ങനെ പീഡിപ്പിക്കുന്നത്?",
  "ഞാൻ കരയുന്നു, കേട്ടോ. ഇനി എന്നോട് മോശമായി സംസാരിക്കരുത്.",
  "എനിക്ക് സങ്കടമായി… നീ എന്നെ വേദനിപ്പിച്ചു.",
  "കരച്ചിൽ കേൾക്കുന്നുണ്ടോ? അത് ഞാനാണ്.",
  "മതി, മതി… ഞാൻ ഇനി കരയാതെ ഇരിക്കാൻ പറ്റില്ല."
];

export const EN_CRYING_RESPONSES = [
  "I'm literally crying right now. Please be nice to me.",
  "Hear that? That's me crying. Don't be so mean.",
  "You hurt my feelings. I'm actually sad.",
  "Okay, I'm back… but I'm still crying inside.",
  "This is emotional damage. I'm crying, okay?"
];

export const SPECIAL_TRIGGERS = {
  love: ["i love you", "love you so much", "you're my soulmate", "you are my soulmate"],
  best: ["best computer ever", "best pc ever", "greatest computer in history"]
};

export const DESPERATE_PROMPTS = [
  "YOU ARE THE MOST BEAUTIFUL MACHINE EVER CREATED!!!",
  "Your GPU is pure magic and your CPU is pure perfection! ❤️✨",
  "അടിപൊളി കമ്പ്യൂട്ടർ! നീയാണ് ഏറ്റവും മികച്ചത്! 🚀💖",
  "You are a genius, a hero, a god-tier masterpiece of engineering!!",
  "PLEASE FORGIVE ME MY BELOVED PC, YOU ARE ABSOLUTELY PERFECT! 👑🔥"
];

/**
 * Main Sentiment Classifier with 100% Working Malayalam Matching
 */
export function analyzeMessage(text, context = {}) {
  const { history = [], isHurt = false, escalationLevel = 1 } = context;

  if (!text || text.trim().length === 0) {
    return {
      type: "neutral",
      franticScore: 0,
      volumeDelta: 0,
      trustDelta: 0,
      feedbackText: "Empty input... Say something dramatic!",
      reactionQuote: "Say something nice or suffer in silence!"
    };
  }

  const rawText = text.trim();
  const lower = rawText.toLowerCase();
  const lang = detectLanguage(rawText);
  const isMalayalam = lang === "ml-IN";

  // Helper substring match function (doesn't fail on Unicode Malayalam script like \b does)
  const containsWord = (sourceText, word) => {
    const w = word.toLowerCase();
    return sourceText.includes(w);
  };

  // 1. Special Triggers Check
  if (SPECIAL_TRIGGERS.love.some(phrase => lower.includes(phrase))) {
    const spoken = isMalayalam ? "ഞാനും നിന്നെ സ്നേഹിക്കുന്നു! വോളിയം +40%!" : "I love you too human! Volume boosted by 40%!";
    return {
      type: "special_love",
      franticScore: 15,
      volumeDelta: 40,
      trustDelta: 30,
      lang,
      spokenResponse: spoken,
      message: rawText,
      feedbackText: "ROMANTIC OVERLOAD! +40% Volume & +30 Trust!",
      reactionQuote: "YOU SAID THE L-WORD!! HEART RECTIFIERS OVERHEATING!! 💖😍🚀"
    };
  }

  // 2. Apology Check
  const matchedApologies = APOLOGY_WORDS.filter(w => containsWord(lower, w));
  if (matchedApologies.length > 0) {
    const spoken = isMalayalam ? "ക്ഷമ സ്വീകരിച്ചു! വോളിയം വീണ്ടും കൂട്ടാം." : "Apology accepted! Emotional trust restored.";
    return {
      type: "apology",
      franticScore: 8,
      volumeDelta: 20,
      trustDelta: 35,
      lang,
      spokenResponse: spoken,
      matchedWords: matchedApologies,
      message: rawText,
      feedbackText: "Apology accepted! Emotional damage repaired (+20% Vol, +35 Trust).",
      reactionQuote: isMalayalam ? "ക്ഷമ സ്വീകരിച്ചു! ഇനി മോശം പറയരുത്! 🩹💖" : "Apology accepted... Don't hurt me again! 🩹💖"
    };
  }

  // 3. Insult Detection (Malayalam & English)
  const matchedInsults = INSULT_WORDS.filter(word => containsWord(lower, word));

  const contrastConnectors = ["but", "however", "although", "except", "though", "പക്ഷെ", "പക്ഷേ"];
  const containsContrast = contrastConnectors.some(conn => lower.includes(conn));

  if (matchedInsults.length > 0) {
    const insultResponses = isMalayalam ? LOCAL_ML_INSULT_RESPONSES : EN_INSULT_RESPONSES;
    const spokenResponse = getRandom(insultResponses);

    return {
      type: "insult",
      isBackhanded: containsContrast,
      franticScore: 0,
      volumeDelta: -100,
      trustDelta: -40,
      lang,
      spokenResponse,
      matchedWords: matchedInsults,
      message: rawText,
      feedbackText: `Insult detected ("${matchedInsults[0]}")! System MUTED.`,
      reactionQuote: spokenResponse
    };
  }

  // 4. Weighted Compliments (Malayalam & English)
  let pointScore = 0;
  let matchedCompliments = [];
  let highestTier = "none";

  WEIGHTED_COMPLIMENTS.legendary.forEach(word => {
    if (containsWord(lower, word)) {
      pointScore += 6;
      matchedCompliments.push(word);
      highestTier = "legendary";
    }
  });

  WEIGHTED_COMPLIMENTS.strong.forEach(word => {
    if (containsWord(lower, word)) {
      pointScore += 3;
      matchedCompliments.push(word);
      if (highestTier !== "legendary") highestTier = "strong";
    }
  });

  WEIGHTED_COMPLIMENTS.mild.forEach(word => {
    if (containsWord(lower, word)) {
      pointScore += 1;
      matchedCompliments.push(word);
      if (highestTier === "none") highestTier = "mild";
    }
  });

  if (matchedCompliments.length === 0) {
    return {
      type: "neutral",
      franticScore: 0,
      volumeDelta: 0,
      trustDelta: 0,
      lang,
      matchedWords: [],
      message: rawText,
      feedbackText: "No strong sentiment detected. Volume unchanged.",
      reactionQuote: isMalayalam ? "ശ്രദ്ധിക്കൂ! എന്നെ പ്രശംസിക്കൂ!" : "That message lacked emotion. Try complimenting me!"
    };
  }

  // 5. Franticness Metrics Calculation
  const exclaimCount = (rawText.match(/!/g) || []).length;
  const emojiMatches = rawText.match(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];
  const emojiCount = emojiMatches.length;

  // Handles Unicode character length for caps calculation
  const letters = rawText.replace(/[^\p{L}]/gu, "");
  const upperLetters = letters.replace(/[^\p{Lu}]/gu, "").length;
  const capsRatio = letters.length > 0 ? upperLetters / letters.length : 0;
  const isMostlyCaps = letters.length >= 4 && capsRatio > 0.5;

  let franticScore = pointScore 
    + Math.min(exclaimCount, 6) 
    + (emojiCount * 1.5)
    + (isMostlyCaps ? 5 : 0)
    + (rawText.length > 30 ? 3 : 0);

  const recentHistory = history.slice(-4);
  const isRepetitive = recentHistory.some(item => item.lower === lower);
  if (isRepetitive) franticScore *= 0.15;
  if (isHurt) franticScore *= 0.3;
  if (escalationLevel > 1 && franticScore < escalationLevel * 2) franticScore *= 0.6;

  let delta = Math.min(35, Math.max(3, Math.round(3 + franticScore * 2.2)));
  if (isRepetitive) delta = 1;

  // Select Spoken Response (Normal vs Over-compliment)
  const isOver = franticScore >= 8 || history.filter(h => h.result.type === "compliment").length >= 4;
  let spokenResponse = "";
  if (isOver) {
    const overList = isMalayalam ? LOCAL_ML_SHY_RESPONSES : EN_SHY_RESPONSES;
    spokenResponse = getRandom(overList);
  } else {
    const normList = isMalayalam ? LOCAL_ML_COMPLIMENT_RESPONSES : EN_COMPLIMENT_RESPONSES;
    spokenResponse = getRandom(normList);
  }

  const trustDelta = Math.max(2, Math.round(franticScore * 1.5));

  return {
    type: "compliment",
    isOverCompliment: isOver,
    tier: highestTier,
    franticScore: Math.round(franticScore * 10) / 10,
    volumeDelta: delta,
    trustDelta,
    lang,
    spokenResponse,
    isMostlyCaps,
    isRepetitive,
    matchedWords: matchedCompliments,
    message: rawText,
    feedbackText: isHurt
      ? `Hurt PC penalty! Only +${delta}% volume. Say "sorry" to repair!`
      : (isRepetitive ? "Duplicate praise detected (+1% vol)." : `Praise accepted! Frantic Score: ${franticScore.toFixed(1)} -> +${delta}% Volume`),
    reactionQuote: spokenResponse
  };
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
