'use client';
import { useEffect, useState } from 'react';
import * as Tone from 'tone';

interface MusicGeneratorProps {
  mood: string;
}

const MusicGenerator = ({ mood }: MusicGeneratorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const generateMusic = async () => {
    // Make sure Tone.js is started (needed due to browser autoplay policies)
    await Tone.start();
    
    // Create a synth
    const synth = new Tone.Synth().toDestination();
    
    // Define different patterns for different moods
    const patterns = {
      happy: ['C4', 'E4', 'G4', 'A4'],
      sad: ['A3', 'C4', 'E4', 'G4'],
      calm: ['G3', 'B3', 'D4', 'F4']
    };
    
    // Get notes for the current mood
    const notes = patterns[mood as keyof typeof patterns] || patterns.calm;
    
    // Create a sequence
    const seq = new Tone.Sequence((time, note) => {
      synth.triggerAttackRelease(note, '8n', time);
    }, notes, '4n');

    // Start the sequence
    Tone.Transport.start();
    seq.start();
    
    setIsPlaying(true);
  };

  const stopMusic = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  return (
    <div className="space-y-4">
      <button
        onClick={isPlaying ? stopMusic : generateMusic}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPlaying ? 'Stop Music' : 'Generate Music'}
      </button>
    </div>
  );
};

export default MusicGenerator; 