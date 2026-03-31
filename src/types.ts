export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Clef = 'treble' | 'bass' | 'both';
export type NamingSystem = 'letters' | 'solfege';
export type PracticeMode = 'notes' | 'intervals' | 'chords' | 'songs';
export type AppMode = 'learning' | 'game';
export type IntervalName = '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | 'Octave';
export type ChordName = 'Major' | 'Minor' | 'Diminished' | 'Major 7th' | 'Minor 7th' | 'Dominant 7th' | 'Half-Diminished 7th';

export interface Note {
  name: NoteName;
  octave: number;
}
