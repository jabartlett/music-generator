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

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl mb-4">Mood Music Generator</h1>
      <div className="space-y-4">
        <select 
          value={mood} 
          onChange={(e) => setMood(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select a mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="calm">Calm</option>
        </select>
        {mood && <MusicGenerator mood={mood} />}
      </div>
    </main>
  );
}
