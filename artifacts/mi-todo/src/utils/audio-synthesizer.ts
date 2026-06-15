/**
 * Synthesizes a soft, clean chime sound using the Web Audio API.
 * This runs entirely on the client side, offline, and does not require loading audio files.
 */
export function playSoftChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const now = audioCtx.currentTime;

    // We use 3 oscillators to build a pleasant bell/chime sound:
    // 1. Primary fundamental tone: A5 (880 Hz) - pure sine wave
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);

    // 2. Harmonic (Fifth): E6 (1320 Hz) - adds brightness
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, now);

    // 3. Subharmonic: A4 (440 Hz) - adds body/warmth
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(440, now);

    // Envelope for fundamental (Slow decay, ring out for 1.8s)
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.02); // fast attack
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.8); // exponential decay

    // Envelope for high harmonic (Decays faster, 1.2s)
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.04, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    // Envelope for subharmonic (Decays at medium rate, 1.5s)
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.06, now + 0.025);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    // Connections
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);

    // Playback control
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + 1.9);
    osc2.stop(now + 1.3);
    osc3.stop(now + 1.6);
  } catch (error) {
    console.error("Failed to play soft chime sound using Web Audio API", error);
  }
}
