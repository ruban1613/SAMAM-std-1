/**
 * Audio helper for Client-Side Web Speech Synthesis (TTS)
 * and Premium Server-Side Gemini TTS playback.
 */

let speechUtterance: SpeechSynthesisUtterance | null = null;
let currentAudioContext: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;

/**
 * Cleans a text string before speech synthesis to improve vocal pronunciation,
 * enhance vocabulary delivery, and remove all emojis and symbols that browsers
 * tend to read out (e.g. "man", "chart increasing", "monkey face", etc.).
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // Replace common symbols with friendlyspoken terms to improve pronunciation and understanding
  cleaned = cleaned
    .replace(/\bvs\b/gi, " versus ")
    .replace(/\+/g, " plus ")
    .replace(/\s*-\s*/g, " minus ")
    .replace(/\s*=\s*/g, " equals ")
    .replace(/&/g, " and ")
    .replace(/A-Z/g, "A to Z")
    .replace(/1-10/g, "one to ten")
    .replace(/11-20/g, "eleven to twenty")
    .replace(/2D/g, "two dimensional")
    .replace(/3D/g, "three dimensional");

  // Remove standard emoji and pictograph ranges
  try {
    cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, "");
  } catch (e) {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1FAFF}\u{200d}\u{fe0f}]/gu;
    cleaned = cleaned.replace(emojiRegex, "");
  }

  // Double check and remove specific browser-pronounced noise labels
  const noisePhrases = [
    "chart increasing", "man", "woman", "farmer", "glowing star", "person standing", "framed picture",
    "direct hit", "bullseye", "plus sign", "minus sign"
  ];
  
  // Clean up excessive spacing, trailing dots, or clean punctuation issues
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Safely triggers device vibration using the browser Vibration API.
 * Handles missing browser support, permission states, and iFrame restrictions.
 */
export function triggerHaptic(pattern: number | number[] = 50) {
  if (typeof window !== "undefined" && window.navigator && typeof window.navigator.vibrate === "function") {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignored
    }
  }
}

/**
 * Procedural tiny, pleasant pop/click sound for buttons.
 */
export function playClickSound() {
  triggerHaptic(40);
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Ignore
  }
}

/**
 * Procedural cute bubble-pop/open sound for modals and lift-the-flaps.
 */
export function playPopSound() {
  triggerHaptic([50, 30, 50]);
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Ignore
  }
}

/**
 * Stops any currently active voice playback (either SpeechSynthesis or Gemini TTS).
 */
export function stopAllSpeech() {
  // Stop browser synthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // Stop active AudioContext source
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch (e) {
      // Ignored
    }
    currentSourceNode = null;
  }
}

/**
 * Speaks text using the browser's native client-side SpeechSynthesis API.
 * This is fast, responsive, works offline, and requires no API keys.
 */
export function speakClientSide(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onBoundary?: (charIndex: number) => void
) {
  stopAllSpeech();

  if (!window.speechSynthesis) {
    console.warn("Speech synthesis is not supported in this browser.");
    return;
  }

  const cleanedText = cleanTextForSpeech(text);
  speechUtterance = new SpeechSynthesisUtterance(cleanedText);
  
  // Find a nice friendly child-appropriate voice if available (e.g. Google US English, natural, etc.)
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Zira"))
  );
  if (preferredVoice) {
    speechUtterance.voice = preferredVoice;
  }

  let speedRate = 0.72; // Default slow rate for young learners
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("samam_speech_rate");
    if (saved) {
      speedRate = parseFloat(saved);
    }
  }
  speechUtterance.rate = speedRate;
  speechUtterance.pitch = 1.1; // Slightly higher pitch for child-friendliness

  if (onStart) speechUtterance.onstart = onStart;
  if (onEnd) speechUtterance.onend = onEnd;
  
  if (onBoundary) {
    speechUtterance.onboundary = (event) => {
      if (event.name === "word") {
        onBoundary(event.charIndex);
      }
    };
  }

  window.speechSynthesis.speak(speechUtterance);
}

/**
 * Sets the global speech rate in localStorage and dispatches a window event
 * so all active child components can update their states simultaneously.
 */
export function setGlobalSpeechRate(rate: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem("samam_speech_rate", rate.toString());
    window.dispatchEvent(new Event("samam_speech_rate_changed"));
  }
}

/**
 * Gets the current speech rate from localStorage, defaulting to 0.72.
 */
export function getGlobalSpeechRate(): number {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("samam_speech_rate");
    if (saved) return parseFloat(saved);
  }
  return 0.72; // Default child-friendly slow rate
}

/**
 * Decodes a base64 string containing raw 16-bit PCM little-endian audio
 * and plays it through the browser Web Audio API at the specified sample rate.
 */
export async function playRawPCM(base64PCM: string, sampleRate = 24000): Promise<void> {
  stopAllSpeech();

  // Create AudioContext if not already created
  if (!currentAudioContext) {
    currentAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate,
    });
  }

  // Resume context if suspended
  if (currentAudioContext.state === "suspended") {
    await currentAudioContext.resume();
  }

  // Convert base64 to binary array
  const binaryString = window.atob(base64PCM);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert 16-bit bytes to float values [-1.0, 1.0]
  const dataView = new DataView(bytes.buffer);
  const numSamples = bytes.length / 2; // Each 16-bit sample is 2 bytes
  const channelData = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const intSample = dataView.getInt16(i * 2, true); // Little endian
    channelData[i] = intSample / 32768.0;
  }

  // Create audio buffer
  const audioBuffer = currentAudioContext.createBuffer(1, numSamples, sampleRate);
  audioBuffer.getChannelData(0).set(channelData);

  // Play audio buffer
  const sourceNode = currentAudioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.connect(currentAudioContext.destination);
  sourceNode.start(0);

  currentSourceNode = sourceNode;

  return new Promise((resolve) => {
    sourceNode.onended = () => {
      if (currentSourceNode === sourceNode) {
        currentSourceNode = null;
      }
      resolve();
    };
  });
}

/**
 * Procedural paper/page swishing sound effect using bandpass-filtered white noise.
 * Extremely high-fidelity and works instantly with zero asset overhead!
 */
export function playPageTurnSound() {
  triggerHaptic(60);
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a 0.25 second buffer of white noise
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Bandpass filter to sculpt the paper friction sound
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
    filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.25);
    filter.Q.setValueAtTime(4, ctx.currentTime);
    
    // Gain envelope for fade-in and fade-out
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start();
    noise.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn("Failed to play page turn sound", e);
  }
}

/**
 * Plays a highly realistic, funny, and engaging procedural animal sound effect.
 * Uses real-time synthesizers and schedules secondary vocal support for children!
 */
export function playAnimalSFX(animal: string) {
  triggerHaptic([80, 40, 80]);
  try {
    const normAnimal = animal.toLowerCase().trim();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Let's stop any playing speech so the animal's vocalization stands out
    stopAllSpeech();

    // 1. TIGER / LION ROAR (Procedural AM/FM synthesis growl)
    if (normAnimal.includes("tiger") || normAnimal.includes("lion") || normAnimal.includes("roar")) {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc1.type = "sawtooth";
      osc2.type = "sawtooth";
      
      osc1.frequency.setValueAtTime(80, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(42, ctx.currentTime + 0.65);
      osc2.frequency.setValueAtTime(84, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(39, ctx.currentTime + 0.65);
      
      // Low-frequency oscillator (LFO) for deep, terrifying growl vibrations
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sawtooth";
      lfo.frequency.setValueAtTime(32, ctx.currentTime);
      lfoGain.gain.setValueAtTime(22, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);
      
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.18);
      filter.frequency.exponentialRampToValueAtTime(95, ctx.currentTime + 0.65);
      filter.Q.setValueAtTime(4, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      lfo.start();
      osc1.start();
      osc2.start();
      
      lfo.stop(ctx.currentTime + 0.7);
      osc1.stop(ctx.currentTime + 0.7);
      osc2.stop(ctx.currentTime + 0.7);
      
      // Speak funny vocal reinforcement after a short delay
      setTimeout(() => {
        const word = normAnimal.includes("tiger") ? "Rawwwr! I am a Tiger!" : "Roar! I am the Lion!";
        speakClientSide(word);
      }, 720);
    }
    
    // 2. COW MOO (Formant / vowel synthesis)
    else if (normAnimal.includes("cow") || normAnimal.includes("moo")) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(115, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(88, ctx.currentTime + 0.85);
      
      // Bandpass filter sweep simulates "Mooo-ooo" mouth opening
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.85);
      filter.Q.setValueAtTime(6, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
      
      setTimeout(() => {
        speakClientSide("Moooo! I am a Cow!");
      }, 950);
    }
    
    // 3. SHEEP BAA (Pitch vibrato synthesis)
    else if (normAnimal.includes("sheep") || normAnimal.includes("goat") || normAnimal.includes("baa")) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      
      // Vibrato oscillator for sheep's wavering voice
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(13, ctx.currentTime); // 13 Hz shaking
      vibratoGain.gain.setValueAtTime(28, ctx.currentTime);
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      vibrato.start();
      osc.start();
      
      vibrato.stop(ctx.currentTime + 0.65);
      osc.stop(ctx.currentTime + 0.65);
      
      setTimeout(() => {
        speakClientSide("Baaa-baa! I am a Sheep!");
      }, 700);
    }
    
    // 4. ELEPHANT TRUMPET (Screaming distorted sawtooth)
    else if (normAnimal.includes("elephant") || normAnimal.includes("trumpet")) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.12);
      osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.75);
      
      // Severe vibrato (28 Hz) to simulate the trumpet blow texture
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(28, ctx.currentTime);
      vibratoGain.gain.setValueAtTime(120, ctx.currentTime);
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      
      filter.type = "highpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      vibrato.start();
      osc.start();
      
      vibrato.stop(ctx.currentTime + 0.8);
      osc.stop(ctx.currentTime + 0.8);
      
      setTimeout(() => {
        speakClientSide("Paaawoo! I am an Elephant!");
      }, 850);
    }
    
    // 5. MONKEY (High bouncing sound effects)
    else if (normAnimal.includes("monkey") || normAnimal.includes("ooh")) {
      // Create a sequence of 3 quick bounding squeaks
      for (let i = 0; i < 3; i++) {
        const timeOffset = i * 0.22;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + timeOffset + 0.12);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + timeOffset + 0.2);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
        gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + timeOffset + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.2);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.2);
      }
      
      setTimeout(() => {
        speakClientSide("Ooh-ooh-ah-ah! I am a Monkey!");
      }, 750);
    }
    
    // 6. PIG (Low snorting)
    else if (normAnimal.includes("pig") || normAnimal.includes("oink")) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      
      // Intense low vibration
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(45, ctx.currentTime);
      vibratoGain.gain.setValueAtTime(40, ctx.currentTime);
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      vibrato.start();
      osc.start();
      
      vibrato.stop(ctx.currentTime + 0.4);
      osc.stop(ctx.currentTime + 0.4);
      
      setTimeout(() => {
        speakClientSide("Oink oink! I am a Pig!");
      }, 500);
    }
    
    // 7. BIRD / PARROT (Cute high frequency sweeps)
    else if (normAnimal.includes("bird") || normAnimal.includes("parrot") || normAnimal.includes("chirp")) {
      for (let i = 0; i < 2; i++) {
        const timeOffset = i * 0.25;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + timeOffset + 0.1);
        osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + timeOffset + 0.18);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + timeOffset + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.18);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.18);
      }
      
      setTimeout(() => {
        speakClientSide("Chirp-chirp! Tweet!");
      }, 550);
    }

    // Default fallback simple cute beep and animal name speak
    else {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      
      setTimeout(() => {
        speakClientSide(`This is a ${animal}!`);
      }, 200);
    }
  } catch (e) {
    console.warn("Failed to play animal sound effect", e);
  }
}

/**
 * Custom click sound feedback for Quiz answers and Interactive Buttons.
 * If the button is Option A, B, C or D, it plays a neat chime and speaks "A!", "B!", etc.
 * Then, if the option contains an animal name, it triggers that animal's SFX as well!
 */
export function playOptionSound(text: string) {
  triggerHaptic(50);
  try {
    const normText = text.toUpperCase().trim();
    let letter = "";
    
    if (normText.startsWith("A") || normText.includes("OPTION A") || normText.startsWith("1.")) {
      letter = "A";
    } else if (normText.startsWith("B") || normText.includes("OPTION B") || normText.startsWith("2.")) {
      letter = "B";
    } else if (normText.startsWith("C") || normText.includes("OPTION C") || normText.startsWith("3.")) {
      letter = "C";
    } else if (normText.startsWith("D") || normText.includes("OPTION D") || normText.startsWith("4.")) {
      letter = "D";
    }
    
    // Play a delightful chime
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    const baseFreq = letter === "A" ? 523.25 : letter === "B" ? 587.33 : letter === "C" ? 659.25 : letter === "D" ? 698.46 : 600;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
    
    // Speak letter feedback or general text
    setTimeout(() => {
      if (letter) {
        speakClientSide(`Option ${letter}!`);
      }
      
      // Check for any animals in the text, play their custom SFX!
      const lowerText = text.toLowerCase();
      if (lowerText.includes("tiger") || lowerText.includes("lion") || lowerText.includes("roar")) {
        setTimeout(() => playAnimalSFX("tiger"), 600);
      } else if (lowerText.includes("cow") || lowerText.includes("moo")) {
        setTimeout(() => playAnimalSFX("cow"), 600);
      } else if (lowerText.includes("sheep") || lowerText.includes("baa")) {
        setTimeout(() => playAnimalSFX("sheep"), 600);
      } else if (lowerText.includes("elephant") || lowerText.includes("trumpet")) {
        setTimeout(() => playAnimalSFX("elephant"), 600);
      } else if (lowerText.includes("monkey") || lowerText.includes("ooh")) {
        setTimeout(() => playAnimalSFX("monkey"), 600);
      } else if (lowerText.includes("pig") || lowerText.includes("oink")) {
        setTimeout(() => playAnimalSFX("pig"), 600);
      } else if (lowerText.includes("bird") || lowerText.includes("parrot") || lowerText.includes("chirp")) {
        setTimeout(() => playAnimalSFX("bird"), 600);
      }
    }, 220);
  } catch (e) {
    console.warn("Failed to play option feedback sound", e);
  }
}


/**
 * Triggers premium TTS voice generation from the server.
 * Falls back gracefully to client-side TTS if server fails.
 */
export async function speakPremium(
  text: string,
  character: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (onStart) onStart();

  const cleanedText = cleanTextForSpeech(text);

  try {
    const response = await fetch("/api/gemini/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanedText, character }),
    });

    if (!response.ok) {
      throw new Error("Server speech generation failed");
    }

    const data = await response.json();
    if (data.audio) {
      await playRawPCM(data.audio, 24000);
      if (onEnd) onEnd();
    } else {
      throw new Error("No audio payload returned");
    }
  } catch (error) {
    console.warn("Premium TTS failed. Falling back to offline client-side TTS.", error);
    // Fall back immediately to client-side Synthesis
    speakClientSide(cleanedText, undefined, onEnd);
  }
}
