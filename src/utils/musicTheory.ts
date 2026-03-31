import { Note, NoteName, IntervalName, ChordName } from '../types';

const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const getNoteIndex = (note: Note) => {
  return note.octave * 7 + NOTE_NAMES.indexOf(note.name);
};

const getNoteFromIndex = (index: number): Note => {
  const octave = Math.floor(index / 7);
  const name = NOTE_NAMES[index % 7];
  return { name, octave };
};

export const generateInterval = (baseNote: Note): { notes: Note[], interval: IntervalName } => {
  const intervals: IntervalName[] = ['2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave'];
  const intervalIndex = Math.floor(Math.random() * intervals.length);
  const intervalName = intervals[intervalIndex];
  
  const baseIndex = getNoteIndex(baseNote);
  const topIndex = baseIndex + intervalIndex + 1;
  const topNote = getNoteFromIndex(topIndex);
  
  return {
    notes: [baseNote, topNote],
    interval: intervalName
  };
};

export const generateChord = (baseNote: Note): { notes: Note[], chord: ChordName } => {
  const baseIndex = getNoteIndex(baseNote);
  const thirdIndex = baseIndex + 2;
  const fifthIndex = baseIndex + 4;
  
  const isSeventh = Math.random() > 0.5; // 50% chance of generating a 7th chord
  
  const notes = [
    baseNote,
    getNoteFromIndex(thirdIndex),
    getNoteFromIndex(fifthIndex)
  ];
  
  if (isSeventh) {
    const seventhIndex = baseIndex + 6;
    notes.push(getNoteFromIndex(seventhIndex));
  }
  
  let chordName: ChordName = 'Major';
  
  if (isSeventh) {
    if (['C', 'F'].includes(baseNote.name)) {
      chordName = 'Major 7th';
    } else if (['D', 'E', 'A'].includes(baseNote.name)) {
      chordName = 'Minor 7th';
    } else if (baseNote.name === 'G') {
      chordName = 'Dominant 7th';
    } else if (baseNote.name === 'B') {
      chordName = 'Half-Diminished 7th';
    }
  } else {
    if (['D', 'E', 'A'].includes(baseNote.name)) {
      chordName = 'Minor';
    } else if (baseNote.name === 'B') {
      chordName = 'Diminished';
    }
  }
  
  return {
    notes,
    chord: chordName
  };
};
