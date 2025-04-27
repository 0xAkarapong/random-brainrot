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
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#f7f7f7' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Random Brainrot Italian Animal Prompt</h1>
      <div style={{ background: 'white', padding: '2rem 3rem', borderRadius: '1rem', boxShadow: '0 2px 16px #0001', textAlign: 'center', marginBottom: '2rem', minWidth: 350 }}>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        {result ? (
          <>
            <h2 style={{ color: '#c0392b', fontSize: '2rem', marginBottom: '0.5rem' }}>{result.name}</h2>
            <p style={{ fontSize: '1.25rem', color: '#333', marginBottom: '1.5rem' }}>{result.prompt}</p>
          </>
        ) : loading ? (
          <p>Loading...</p>
        ) : null}
        <button onClick={fetchPrompt} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', borderRadius: '0.5rem', border: 'none', background: '#27ae60', color: 'white', cursor: 'pointer', fontWeight: 'bold' }} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Another'}
        </button>
      </div>
      <footer style={{ color: '#888', fontSize: '0.9rem' }}>
        Made with 🧠 by your imagination
      </footer>
    </main>
  );
}