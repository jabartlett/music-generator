'use client';
import { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';

interface MusicGeneratorProps {
  mood: string;
}

type OscillatorType = 'sine' | 'square' | 'triangle' | 'sawtooth';

interface MoodConfig {
  scale: string[];
  tempo: number;
  noteLength: string;
  probability: number;
  synth: {
    oscillator: {
      type: OscillatorType;
    };
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    };
  };
}

const MusicGenerator = ({ mood }: MusicGeneratorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);

  const moodConfigs: Record<string, MoodConfig> = {
    happy: {
      scale: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      tempo: 120,
      noteLength: '8n',
      probability: 0.7,
      synth: {
        oscillator: {
          type: 'triangle' as OscillatorType
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.5,
          release: 0.8
        }
      }
    },
    sad: {
      scale: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4'],
      tempo: 80,
      noteLength: '4n',
      probability: 0.8,
      synth: {
        oscillator: {
          type: 'sine' as OscillatorType
        },
        envelope: {
          attack: 0.2,
          decay: 0.3,
          sustain: 0.7,
          release: 1.5
        }
      }
    },
    calm: {
      scale: ['G3', 'B3', 'D4', 'E4', 'G4'],
      tempo: 90,
      noteLength: '2n',
      probability: 0.6,
      synth: {
        oscillator: {
          type: 'sine' as OscillatorType
        },
        envelope: {
          attack: 0.3,
          decay: 0.4,
          sustain: 0.6,
          release: 2
        }
      }
    }
  };

  const generateMelody = (scale: string[], length: number = 8) => {
    const melody: string[] = [];
    const config = moodConfigs[mood as keyof typeof moodConfigs];
    
    for (let i = 0; i < length; i++) {
      if (Math.random() < config.probability) {
        const randomNote = scale[Math.floor(Math.random() * scale.length)];
        melody.push(randomNote);
      } else {
        melody.push(null as any); // Rest
      }
    }
    return melody;
  };

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
    stopAndCleanup();
    await Tone.start();
    
    const config = moodConfigs[mood as keyof typeof moodConfigs];
    
    // Set the tempo
    Tone.Transport.bpm.value = config.tempo;
    
    // Create a synth with mood-specific settings
    synthRef.current = new Tone.Synth(config.synth).toDestination();
    
    // Generate a melody based on the mood's scale
    const melody = generateMelody(config.scale);
    
    // Create a new sequence
    sequenceRef.current = new Tone.Sequence((time, note) => {
      if (note !== null) {
        synthRef.current?.triggerAttackRelease(note, config.noteLength, time);
      }
    }, melody, '4n');

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