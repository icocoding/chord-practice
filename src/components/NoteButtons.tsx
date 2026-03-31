import React from 'react';
import { NoteName, NamingSystem } from '../types';

interface NoteButtonsProps {
  onGuess: (note: NoteName) => void;
  namingSystem: NamingSystem;
  disabled?: boolean;
}

const NOTES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SOLFEGE: Record<NoteName, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si'
};

export const NoteButtons: React.FC<NoteButtonsProps> = ({ onGuess, namingSystem, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
      {NOTES.map((note) => (
        <button
          key={note}
          onClick={() => onGuess(note)}
          disabled={disabled}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border-2 border-indigo-100 text-indigo-700 font-bold text-xl md:text-2xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:border-indigo-100"
        >
          {namingSystem === 'letters' ? note : SOLFEGE[note]}
        </button>
      ))}
    </div>
  );
};
