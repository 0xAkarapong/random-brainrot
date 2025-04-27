export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing Gemini API key');
      return new Response(JSON.stringify({ error: 'Missing Gemini API key' }), { status: 500 });
    }

    const userPrompt = `
The term "brainrot animal" refers to a specific internet meme trend (popular on TikTok since early 2024) featuring AI-generated absurd hybrid creatures. These creations are defined by:
- Hybrid Creatures: Animals fused with everyday objects, food, weapons or fantastical elements (e.g., a shark in sneakers: Tralalero Tralalá; half-banana/half-monkey: Chimpanzini Bananini; crocodile‑jet: Bombardiro Crocodilo).
- Italianized Names: Deliberately Italian‑sounding, often silly or unpronounceable.
- Surreal Visuals: Chaotic, hyper‑saturated colors, neon explosions, glitchy/unpolished AI aesthetic.
- Distorted Italian Audio: Often paired with warped Italian opera or TTS voiceovers.
- Humor Through Illogic: Randomness and absurdity to evoke the feeling of the "brain roasting."

Prompt Instructions:
Generate a highly imaginative, comical AI image prompt featuring one such brainrot animal. The creature must be a surreal AI‑generated hybrid with an Italianized name only. Describe an utterly bizarre activity or scene, emphasizing chaotic visuals and absurd humor. Return a JSON object with:
- name: the Italian name (e.g., "Tralalero Tralalá")
- prompt: the image description

Example:
{
  "name": "Bombardiro Crocodilo",
  "prompt": "A surreal image of a vintage World War II bomber airplane with the front half transformed into the head of a giant, ferocious crocodile. The crocodile's head is highly detailed, with sharp teeth, scaly skin, and menacing eyes. The plane is flying through a bright blue sky with fluffy white clouds. A bomb is suspended beneath the plane."
},
{
  "name": "Tralalero Tralalá",
  "prompt": "The image is of a shark with legs wearing blue Nike sneakers, standing on a beach."
}
`;

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