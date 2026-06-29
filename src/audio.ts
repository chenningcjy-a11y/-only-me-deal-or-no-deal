export const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(frequency: number, type: OscillatorType, duration: number, startTime: number, volume: number = 0.03) {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playTheme() {
  const now = audioContext.currentTime;
  // A simple dramatic ascending motif
  playTone(261.63, 'square', 0.2, now, 0.02); // C4
  playTone(329.63, 'square', 0.2, now + 0.2, 0.02); // E4
  playTone(392.00, 'square', 0.2, now + 0.4, 0.02); // G4
  playTone(523.25, 'square', 0.6, now + 0.6, 0.02); // C5
}

export function playRing() {
  const now = audioContext.currentTime;
  // UK/US style ring: two short bursts
  for (let i = 0; i < 4; i++) {
    const time = now + i * 2; // ring every 2 seconds
    playTone(440, 'sine', 0.4, time, 0.03); // A4
    playTone(480, 'sine', 0.4, time, 0.03);
    playTone(440, 'sine', 0.4, time + 0.5, 0.03); // A4
    playTone(480, 'sine', 0.4, time + 0.5, 0.03);
  }
}

export function playOpenCase() {
  const now = audioContext.currentTime;
  // Suspenseful chord
  playTone(220.00, 'sawtooth', 1.5, now, 0.03); // A3
  playTone(261.63, 'sawtooth', 1.5, now, 0.03); // C4
  playTone(329.63, 'sawtooth', 1.5, now, 0.03); // E4
}

export function playDeal() {
  const now = audioContext.currentTime;
  // Victory chord
  playTone(523.25, 'triangle', 2, now, 0.04); // C5
  playTone(659.25, 'triangle', 2, now, 0.04); // E5
  playTone(783.99, 'triangle', 2, now, 0.04); // G5
  playTone(1046.50, 'triangle', 2, now, 0.04); // C6
}
