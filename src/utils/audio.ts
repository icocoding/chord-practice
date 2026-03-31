// Create a singleton AudioContext to be reused
let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playNoteSound = (name: string, octave: number) => {
  const ctx = initAudio();

  const noteOffsets: Record<string, number> = {
    'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2
  };

  const halfSteps = noteOffsets[name] + (octave - 4) * 12;
  const frequency = 440 * Math.pow(2, halfSteps / 12);

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Use a mix of sine and triangle for a pleasant electric piano/flute-like sound
  oscillator.type = 'triangle'; 
  oscillator.frequency.value = frequency;

  // Envelope to avoid clicks and make it sound more natural
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 1.5);
};

export const playNotesSound = (notes: {name: string, octave: number}[]) => {
  notes.forEach(note => {
    playNoteSound(note.name, note.octave);
  });
};

export const playScale = (clef: 'treble' | 'bass' = 'treble') => {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
  const baseOctave = clef === 'treble' ? 4 : 3;
  const octaves = [baseOctave, baseOctave, baseOctave, baseOctave, baseOctave, baseOctave, baseOctave, baseOctave + 1];
  
  notes.forEach((note, index) => {
    setTimeout(() => {
      playNoteSound(note, octaves[index]);
    }, index * 350);
  });
};
