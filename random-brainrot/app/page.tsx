'use client';
import React, { useState } from 'react';

export default function HomePage() {
  const [result, setResult] = useState<{ name: string; prompt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPrompt = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ name: data.name, prompt: data.prompt });
      setCopied(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || 'Failed to fetch prompt');
      } else {
        setError('Failed to fetch prompt');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center font-sans bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center text-black">Random Italian Brainrot Animal Prompt</h1>
      <div className="bg-white px-8 py-10 rounded-2xl shadow-lg text-center mb-8 min-w-[350px] w-full max-w-md">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {result ? (
          <>
            <h2 className="text-2xl font-semibold text-red-700 mb-2">{result.name}</h2>
            <p className="text-lg text-gray-700 mb-6">{result.prompt}</p>
            <button
              onClick={handleCopy}
              className="px-4 py-2 mr-2 text-base rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition"
              disabled={copied}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </>
        ) : null}
        <button
          onClick={fetchPrompt}
          className="px-6 py-3 text-lg rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      <footer className="text-gray-400 text-sm">Made with 🧠 by your imagination</footer>
    </main>
  );
}