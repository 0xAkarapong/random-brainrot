import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Get the Gemini API key from environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 });
  }

  // Compose a prompt for the LLM
  const userPrompt = `Generate a random, creative, and funny prompt for an AI image generator. The prompt should describe a brainrot Italian animal (real or imaginary), including a surreal or absurd action, and give it a name in the style of Italian animal names (e.g., "Il [Adjective] [Animal]"). Return a JSON object with 'name' and 'prompt' fields. Example: { "name": "Il Radioattivo Cinghiale", "prompt": "Radioactive wild boar dancing in the Colosseum" }`;

  // Call Gemini API (using fetch)
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to call Gemini API' }, { status: 500 });
  }

  const data = await response.json();
  // Try to extract the JSON from the LLM response
  let result = null;
  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Try to parse JSON from the response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      result = JSON.parse(match[0]);
    }
  } catch (e) {}

  if (!result || !result.name || !result.prompt) {
    return NextResponse.json({ error: 'Invalid response from Gemini' }, { status: 500 });
  }

  return NextResponse.json(result);
}