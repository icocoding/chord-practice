import React from 'react';
import { ChordName } from '../types';

interface ChordButtonsProps {
  onGuess: (chord: ChordName) => void;
  disabled?: boolean;
}

const CHORDS: ChordName[] = ['Major', 'Minor', 'Diminished', 'Major 7th', 'Minor 7th', 'Dominant 7th', 'Half-Diminished 7th'];

export const ChordButtons: React.FC<ChordButtonsProps> = ({ onGuess, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
      {CHORDS.map((chord) => (
        <button
          key={chord}
          onClick={() => onGuess(chord)}
          disabled={disabled}
          className="px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-white border-2 border-indigo-100 text-indigo-700 font-bold text-lg md:text-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:border-indigo-100"
        >
          {chord}
        </button>
      ))}
    </div>
  );
};
