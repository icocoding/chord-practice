import React from 'react';
import { Note } from '../types';

interface StaffProps {
  notes: Note[];
  clef: 'treble' | 'bass';
}

export const Staff: React.FC<StaffProps> = ({ notes, clef }) => {
  const getNotePosition = (note: Note, clef: 'treble' | 'bass'): number => {
    const noteValues: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
    const absoluteValue = note.octave * 7 + noteValues[note.name];

    if (clef === 'treble') {
      // B4 is the middle line of treble staff
      const b4Value = 4 * 7 + noteValues['B'];
      return absoluteValue - b4Value;
    } else {
      // D3 is the middle line of bass staff
      const d3Value = 3 * 7 + noteValues['D'];
      return absoluteValue - d3Value;
    }
  };

  const centerY = 100;
  const spacing = 20;
  const halfSpacing = spacing / 2;
  const noteX = 160;

  // Calculate positions and sort from lowest pitch (highest pos value) to highest pitch (lowest pos value)
  const notePositions = notes.map(n => ({
    note: n,
    pos: getNotePosition(n, clef)
  })).sort((a, b) => b.pos - a.pos);

  // Calculate ledger lines
  const ledgerLines = new Set<number>();
  notePositions.forEach(({pos}) => {
    if (pos <= -6) {
      for (let p = -6; p >= pos; p -= 2) ledgerLines.add(centerY - p * halfSpacing);
    } else if (pos >= 6) {
      for (let p = 6; p <= pos; p += 2) ledgerLines.add(centerY - p * halfSpacing);
    }
  });

  const highestPos = notePositions[notePositions.length - 1].pos; // highest pitch
  const lowestPos = notePositions[0].pos; // lowest pitch
  const isStemUp = (highestPos + lowestPos) / 2 >= 0;

  const stemX = isStemUp ? noteX + 11 : noteX - 11;
  const stemTopY = centerY - highestPos * halfSpacing - (isStemUp ? 55 : 0);
  const stemBottomY = centerY - lowestPos * halfSpacing + (isStemUp ? 0 : 55);

  const noteElements = [];
  let previousPos = -999;
  let isShifted = false;

  for (let i = 0; i < notePositions.length; i++) {
    const { pos } = notePositions[i];
    const isSecond = Math.abs(pos - previousPos) === 1;
    
    if (isSecond && !isShifted) {
      isShifted = true;
    } else {
      isShifted = false;
    }
    
    const cx = isShifted ? noteX + 22 : noteX;
    const cy = centerY - pos * halfSpacing;
    
    noteElements.push(
      <ellipse key={i} cx={cx} cy={cy} rx="13" ry="9" fill="#0f172a" transform={`rotate(-15 ${cx} ${cy})`} />
    );
    previousPos = pos;
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-4">
      <svg viewBox="0 -40 320 280" className="w-full h-auto drop-shadow-sm">
        {/* Staff Lines */}
        {[...Array(5)].map((_, i) => {
          const y = centerY - 4 * halfSpacing + i * spacing;
          return <line key={i} x1="20" y1={y} x2="300" y2={y} stroke="#cbd5e1" strokeWidth="2" />;
        })}

        {/* Clef */}
        {clef === 'treble' ? (
          <text x="30" y="135" fontSize="85" fontFamily="Times New Roman, serif" fill="#334155">𝄞</text>
        ) : (
          <text x="30" y="115" fontSize="75" fontFamily="Times New Roman, serif" fill="#334155">𝄢</text>
        )}

        {/* Ledger Lines */}
        {Array.from(ledgerLines).map((y, i) => (
          <line key={`ledger-${i}`} x1={noteX - 22} y1={y} x2={noteX + 44} y2={y} stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        ))}

        {/* Notes */}
        <g className="transition-all duration-300 ease-out">
          {/* Stem */}
          <line
            x1={stemX}
            y1={stemTopY}
            x2={stemX}
            y2={stemBottomY}
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Note Heads */}
          {noteElements}
        </g>
      </svg>
    </div>
  );
};
