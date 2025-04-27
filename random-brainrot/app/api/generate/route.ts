export async function POST(__req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing Gemini API key');
      return new Response(JSON.stringify({ error: 'Missing Gemini API key' }), { status: 500 });
    }

    const userPrompt = `Generate a random, creative, and funny prompt for an AI image generator. The prompt should describe a brainrot Italian animal (real or imaginary), including a surreal or absurd action, and give it a name in the style of Italian animal names (e.g., "Il [Adjective] [Animal]"). Return a JSON object with 'name' and 'prompt' fields. Example: { "name": "Il Radioattivo Cinghiale", "prompt": "Radioactive wild boar dancing in the Colosseum" }`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Gemini API error:', text);
      return new Response(JSON.stringify({ error: 'Failed to call Gemini API', details: text }), { status: 500 });
    }

    const data = await response.json();
    let result = null;
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      }
    } catch (e) {
      console.error('Parsing error:', e);
    }

    if (!result || !result.name || !result.prompt) {
      console.error('Invalid response from Gemini:', data);
      return new Response(JSON.stringify({ error: 'Invalid response from Gemini', details: data }), { status: 500 });
    }

    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('API route error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), { status: 500 });
  }
}