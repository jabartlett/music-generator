'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// We need to dynamically import the music generator component
// because Tone.js uses Web Audio API which is not available during SSR
const MusicGenerator = dynamic(() => import('../components/MusicGenerator'), {
  ssr: false
});

export default function Home() {
  const [mood, setMood] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/analyze-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      
      const data = await response.json();
      setMood(data.mood);
    } catch (error) {
      console.error('Error analyzing mood:', error);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl mb-4">Mood Music Generator</h1>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="How are you feeling?"
            className="p-2 border rounded w-full max-w-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Generate Music
          </button>
        </form>
        {mood && <MusicGenerator mood={mood} />}
      </div>
    </main>
  );
}
