import React from 'react';
import { IntervalName } from '../types';

interface IntervalButtonsProps {
  onGuess: (interval: IntervalName) => void;
  disabled?: boolean;
}

const INTERVALS: IntervalName[] = ['2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave'];

export const IntervalButtons: React.FC<IntervalButtonsProps> = ({ onGuess, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
      {INTERVALS.map((interval) => (
        <button
          key={interval}
          onClick={() => onGuess(interval)}
          disabled={disabled}
          className="px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-white border-2 border-indigo-100 text-indigo-700 font-bold text-lg md:text-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:border-indigo-100"
        >
          {interval}
        </button>
      ))}
    </div>
  );
};
