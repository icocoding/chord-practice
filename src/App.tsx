import React, { useState, useEffect, useCallback } from 'react';
import { Staff } from './components/Staff';
import { NoteButtons } from './components/NoteButtons';
import { IntervalButtons } from './components/IntervalButtons';
import { ChordButtons } from './components/ChordButtons';
import { Note, Clef, NamingSystem, PracticeMode, IntervalName, ChordName, AppMode } from './types';
import { Settings, Trophy, Flame, CheckCircle2, XCircle, Music, Volume2, VolumeX, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playNoteSound, playNotesSound, initAudio, playScale } from './utils/audio';
import { generateInterval, generateChord } from './utils/musicTheory';

const TREBLE_NOTES: Note[] = [
  {name: 'C', octave: 4}, {name: 'D', octave: 4}, {name: 'E', octave: 4}, {name: 'F', octave: 4},
  {name: 'G', octave: 4}, {name: 'A', octave: 4}, {name: 'B', octave: 4},
  {name: 'C', octave: 5}, {name: 'D', octave: 5}, {name: 'E', octave: 5}, {name: 'F', octave: 5},
  {name: 'G', octave: 5}, {name: 'A', octave: 5}, {name: 'B', octave: 5},
  {name: 'C', octave: 6}
];

const BASS_NOTES: Note[] = [
  {name: 'C', octave: 2}, {name: 'D', octave: 2}, {name: 'E', octave: 2}, {name: 'F', octave: 2},
  {name: 'G', octave: 2}, {name: 'A', octave: 2}, {name: 'B', octave: 2},
  {name: 'C', octave: 3}, {name: 'D', octave: 3}, {name: 'E', octave: 3}, {name: 'F', octave: 3},
  {name: 'G', octave: 3}, {name: 'A', octave: 3}, {name: 'B', octave: 3},
  {name: 'C', octave: 4}
];

const TWINKLE_STAR: Note[] = [
  {name: 'C', octave: 4}, {name: 'C', octave: 4}, {name: 'G', octave: 4}, {name: 'G', octave: 4}, {name: 'A', octave: 4}, {name: 'A', octave: 4}, {name: 'G', octave: 4},
  {name: 'F', octave: 4}, {name: 'F', octave: 4}, {name: 'E', octave: 4}, {name: 'E', octave: 4}, {name: 'D', octave: 4}, {name: 'D', octave: 4}, {name: 'C', octave: 4},
  {name: 'G', octave: 4}, {name: 'G', octave: 4}, {name: 'F', octave: 4}, {name: 'F', octave: 4}, {name: 'E', octave: 4}, {name: 'E', octave: 4}, {name: 'D', octave: 4},
  {name: 'G', octave: 4}, {name: 'G', octave: 4}, {name: 'F', octave: 4}, {name: 'F', octave: 4}, {name: 'E', octave: 4}, {name: 'E', octave: 4}, {name: 'D', octave: 4},
  {name: 'C', octave: 4}, {name: 'C', octave: 4}, {name: 'G', octave: 4}, {name: 'G', octave: 4}, {name: 'A', octave: 4}, {name: 'A', octave: 4}, {name: 'G', octave: 4},
  {name: 'F', octave: 4}, {name: 'F', octave: 4}, {name: 'E', octave: 4}, {name: 'E', octave: 4}, {name: 'D', octave: 4}, {name: 'D', octave: 4}, {name: 'C', octave: 4}
];

export default function App() {
  const [currentNotes, setCurrentNotes] = useState<Note[]>([TREBLE_NOTES[0]]);
  const [currentClef, setCurrentClef] = useState<'treble' | 'bass'>('treble');
  const [currentAnswer, setCurrentAnswer] = useState<string>('C');
  
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('notes');
  const [appMode, setAppMode] = useState<AppMode>('learning');
  const [clefSetting, setClefSetting] = useState<Clef>('treble');
  const [namingSystem, setNamingSystem] = useState<NamingSystem>('solfege');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const songProgressRef = React.useRef(0);

  const generateQuestion = useCallback(() => {
    if (practiceMode === 'songs') {
      const nextNote = TWINKLE_STAR[songProgressRef.current % TWINKLE_STAR.length];
      setCurrentClef('treble');
      setCurrentNotes([nextNote]);
      setCurrentAnswer(nextNote.name);
      setFeedback(null);
      return;
    }

    let activeClef = clefSetting;
    if (activeClef === 'both') {
      activeClef = Math.random() > 0.5 ? 'treble' : 'bass';
    }
    
    const notePool = activeClef === 'treble' ? TREBLE_NOTES : BASS_NOTES;
    // For intervals and chords, avoid picking notes too high to prevent excessive ledger lines
    const maxIndex = practiceMode === 'notes' ? notePool.length : notePool.length - 7;
    const randomNote = notePool[Math.floor(Math.random() * maxIndex)];
    
    setCurrentClef(activeClef as 'treble' | 'bass');
    
    if (practiceMode === 'notes') {
      setCurrentNotes([randomNote]);
      setCurrentAnswer(randomNote.name);
    } else if (practiceMode === 'intervals') {
      const { notes, interval } = generateInterval(randomNote);
      setCurrentNotes(notes);
      setCurrentAnswer(interval);
    } else if (practiceMode === 'chords') {
      const { notes, chord } = generateChord(randomNote);
      setCurrentNotes(notes);
      setCurrentAnswer(chord);
    }
    
    setFeedback(null);
  }, [clefSetting, practiceMode]);

  useEffect(() => {
    if (practiceMode === 'songs') {
      songProgressRef.current = 0;
    }
    generateQuestion();
  }, [generateQuestion, practiceMode]);

  const handleGuess = (guess: string) => {
    if (feedback !== null) return;
    
    if (soundEnabled) initAudio();

    if (guess === currentAnswer) {
      if (soundEnabled) {
        playNotesSound(currentNotes);
        if (appMode === 'game') {
          setTimeout(() => playNotesSound(currentNotes), 600);
          setTimeout(() => playNotesSound(currentNotes), 1200);
        }
      }
      setFeedback('correct');
      if (appMode === 'game') {
        setScore(s => s + 1);
        setStreak(s => s + 1);
      }
      if (practiceMode === 'songs') {
        songProgressRef.current += 1;
      }
      const delay = (soundEnabled && appMode === 'game') ? 2000 : 800;
      setTimeout(generateQuestion, delay);
    } else {
      if (soundEnabled) {
        if (practiceMode === 'notes' || practiceMode === 'songs') {
          const baseOctave = currentClef === 'treble' ? 4 : 3;
          playNoteSound(guess, baseOctave);
        }
      }
      
      setFeedback('incorrect');
      setStreak(0);
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) initAudio();
    setSoundEnabled(!soundEnabled);
  };

  const handlePlayScale = () => {
    if (soundEnabled) {
      initAudio();
      playScale(currentClef);
    }
  };

  const handlePlayCurrentNotes = () => {
    if (soundEnabled) {
      initAudio();
      playNotesSound(currentNotes);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-indigo-600">
          <Music className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">StaffSight</h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{score}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Flame className={`w-4 h-4 ${streak > 2 ? 'text-orange-500' : 'text-slate-400'}`} />
              <span>{streak}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 border-l pl-4 md:pl-6 border-slate-200">
            <button 
              onClick={toggleSound}
              className={`p-2 rounded-full transition-colors ${soundEnabled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}
              title={soundEnabled ? "Mute sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">App Mode (应用模式)</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => setAppMode('learning')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${appMode === 'learning' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Learning (学习)
                        </button>
                        <button
                          onClick={() => setAppMode('game')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${appMode === 'game' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Game (游戏)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">Practice Mode</label>
                      <div className="flex flex-col gap-2">
                        {(['notes', 'intervals', 'chords', 'songs'] as PracticeMode[]).map((m) => (
                          <button
                            key={m}
                            onClick={() => { setPracticeMode(m); generateQuestion(); }}
                            className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                              practiceMode === m 
                                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200' 
                                : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                            }`}
                          >
                            {m === 'songs' ? 'Songs (小星星)' : m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">Clef (谱号)</label>
                      <div className="flex gap-2">
                        {(['treble', 'bass', 'both'] as Clef[]).map((c) => (
                          <button
                            key={c}
                            onClick={() => { setClefSetting(c); generateQuestion(); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                              clefSetting === c 
                                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200' 
                                : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">Naming (命名)</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setNamingSystem('letters')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            namingSystem === 'letters' 
                              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200' 
                              : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                          }`}
                        >
                          C D E F G A B
                        </button>
                        <button
                          onClick={() => setNamingSystem('solfege')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            namingSystem === 'solfege' 
                              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200' 
                              : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                          }`}
                        >
                          Do Re Mi...
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Area */}
        <div className="relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {practiceMode === 'notes' && 'Identify the Note'}
              {practiceMode === 'intervals' && 'Identify the Interval'}
              {practiceMode === 'chords' && 'Identify the Chord'}
              {practiceMode === 'songs' && 'Play the Song'}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-slate-500">
                {practiceMode === 'notes' && 'What note is shown on the staff?'}
                {practiceMode === 'intervals' && 'What is the interval between these notes?'}
                {practiceMode === 'chords' && 'What type of triad is this?'}
                {practiceMode === 'songs' && 'Follow the notes to play Twinkle Twinkle Little Star'}
              </p>
              {(practiceMode === 'notes' || practiceMode === 'songs') && (
                <button 
                  onClick={handlePlayScale}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full transition-colors"
                  title="Play CDEFGAB Scale"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  Hear Scale
                </button>
              )}
            </div>
          </div>

          <div className="relative max-w-lg mx-auto">
            <Staff 
              notes={currentNotes} 
              clef={currentClef} 
            />
            
            {/* Controls & Hint Overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
              {(appMode === 'learning' || feedback === 'incorrect') && (
                <span className="text-lg font-bold text-indigo-600 animate-pulse bg-indigo-50 px-3 py-1 rounded-full shadow-sm border border-indigo-100">
                  {(practiceMode === 'notes' || practiceMode === 'songs') 
                    ? `${namingSystem === 'solfege' ? {C:'Do',D:'Re',E:'Mi',F:'Fa',G:'Sol',A:'La',B:'Si'}[currentNotes[0].name] : currentNotes[0].name}${currentNotes[0].octave}` 
                    : currentAnswer}
                </span>
              )}
              <button
                onClick={handlePlayCurrentNotes}
                className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors bg-white/80 backdrop-blur-sm shadow-sm"
                title="Hear Notes"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Feedback Overlay */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl z-10"
                >
                  {feedback === 'correct' ? (
                    <div className="bg-green-100 text-green-600 p-4 rounded-full shadow-lg">
                      <CheckCircle2 className="w-16 h-16" />
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-600 p-4 rounded-full shadow-lg">
                      <XCircle className="w-16 h-16" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {(practiceMode === 'notes' || practiceMode === 'songs') && (
            <NoteButtons 
              onGuess={handleGuess} 
              namingSystem={namingSystem} 
              disabled={feedback !== null} 
            />
          )}
          
          {practiceMode === 'intervals' && (
            <IntervalButtons 
              onGuess={handleGuess} 
              disabled={feedback !== null} 
            />
          )}
          
          {practiceMode === 'chords' && (
            <ChordButtons 
              onGuess={handleGuess} 
              disabled={feedback !== null} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
