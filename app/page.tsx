'use client';
import React, { useState } from 'react';

// Example Italian animal names and styles
const italianAnimals = [
  'Cinghiale', // wild boar
  'Riccio',    // hedgehog
  'Gabbiano',  // seagull
  'Capra',     // goat
  'Lupo',      // wolf
  'Tasso',     // badger
  'Cervo',     // deer
  'Volpe',     // fox
  'Fagiano',   // pheasant
  'Istrice',   // porcupine
  'Gatto',     // cat
  'Cane',      // dog
  'Asino',     // donkey
  'Mucca',     // cow
  'Pecora',    // sheep
  'Gallina',   // chicken
  'Oca',       // goose
  'Tacchino',  // turkey
  'Coniglio',  // rabbit
  'Topo',      // mouse
];

const brainrotAdjectives = [
  'cybernetic',
  'radioactive',
  'spaghetti-fueled',
  'pizza-mancer',
  'opera-singing',
  'espresso-powered',
  'gondola-riding',
  'mafia boss',
  'fashionista',
  'soccer hooligan',
  'Vespa-driving',
  'meme overlord',
  'ancient Roman',
  'gelato-obsessed',
  'bizarre',
  'surreal',
  'avant-garde',
  'hyperactive',
  'noodle-armed',
  'mysterious',
];

const brainrotActions = [
  'dancing in the Colosseum',
  'arguing with pigeons',
  'stealing cannoli',
  'singing to the moon',
  'riding a Vespa through Venice',
  'throwing pizza slices',
  'posing for Renaissance painters',
  'leading a pasta revolution',
  'building a tower of gelato',
  'escaping from a Roman gladiator',
  'hosting a cooking show',
  'playing chess with a cardinal',
  'painting graffiti on ruins',
  'summoning a rain of olives',
  'hiding in a wine barrel',
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePrompt() {
  const animal = getRandom(italianAnimals);
  const adj = getRandom(brainrotAdjectives);
  const action = getRandom(brainrotActions);
  // Italian-style name: e.g. Il [Adjective] [Animal]
  const name = `Il ${adj.charAt(0).toUpperCase() + adj.slice(1)} ${animal}`;
  const prompt = `${adj.charAt(0).toUpperCase() + adj.slice(1)} ${animal.toLowerCase()} ${action}`;
  return { name, prompt };
}

export default function HomePage() {
  const [result, setResult] = useState<{ name: string; prompt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompt = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ name: data.name, prompt: data.prompt });
    } catch (e: any) {
      setError(e.message || 'Failed to fetch prompt');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrompt();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center font-sans bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center text-black">Random Brainrot Italian Animal Prompt</h1>
      <div className="bg-white px-8 py-10 rounded-2xl shadow-lg text-center mb-8 min-w-[350px] w-full max-w-md">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {result ? (
          <>
            <h2 className="text-2xl font-semibold text-red-700 mb-2">{result.name}</h2>
            <p className="text-lg text-gray-700 mb-6">{result.prompt}</p>
          </>
        ) : loading ? (
          <p>Loading...</p>
        ) : null}
        <button
          onClick={fetchPrompt}
          className="px-6 py-3 text-lg rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Another'}
        </button>
      </div>
      <footer className="text-gray-400 text-sm">Made with 🧠 by your imagination</footer>
    </main>
  );
}