'use client';
import { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';

interface MusicGeneratorProps {
  mood: string;
}

const MusicGenerator = ({ mood }: MusicGeneratorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);

  const stopAndCleanup = () => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.dispose();
      synthRef.current = null;
    }
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  const generateMusic = async () => {
    // Clean up any existing sequence
    stopAndCleanup();
    
    // Make sure Tone.js is started
    await Tone.start();
    
    // Create a new synth
    synthRef.current = new Tone.Synth().toDestination();
    
    // Define different patterns for different moods
    const patterns = {
      happy: ['C4', 'E4', 'G4', 'A4'],
      sad: ['A3', 'C4', 'E4', 'G4'],
      calm: ['G3', 'B3', 'D4', 'F4']
    };
    
    const notes = patterns[mood as keyof typeof patterns] || patterns.calm;
    
    // Create a new sequence
    sequenceRef.current = new Tone.Sequence((time, note) => {
      synthRef.current?.triggerAttackRelease(note, '8n', time);
    }, notes, '4n');

    Tone.Transport.start();
    sequenceRef.current.start();
    
    setIsPlaying(true);
  };

  // Cleanup when mood changes or component unmounts
  useEffect(() => {
    return () => {
      stopAndCleanup();
    };
  }, [mood]);

  return (
    <div className="space-y-4">
      <button
        onClick={isPlaying ? stopAndCleanup : generateMusic}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPlaying ? 'Stop Music' : 'Generate Music'}
      </button>
    </div>
  );
};

export default MusicGenerator; 