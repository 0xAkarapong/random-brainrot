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
- Surreal Visuals: Chaotic, hyper‑saturated colors, neon explosions, glitchy/unpolished AI aesthetic.
- Humor Through Illogic: Randomness and absurdity to evoke the feeling of the "brain roasting."

Examples of Popular Brainrot Animals:
Tralalero Tralala: A shark with sneakers, often the protagonist, known for dancing or sprinting in videos.
Bombardiro Crocodilo: A crocodile-warplane hybrid, portrayed as a chaotic antagonist with a "bad guy" vibe.
Lirilì Larilà: A cactus-elephant with flippers, wandering deserts in memes.
Tung Tung Tung Sahur: A baseball bat carrying a baseball bat, sometimes depicted in dramatic storylines.
Boneca Ambalabu: An Indonesian brainrot character, a frog-tire hybrid with human legs.
Trippi Troppi: A cat-shrimp hybrid, as weird as it sounds. It’s less prominent but embodies the nonsensical nature of the trend with its bizarre design.
Brr Brr Patapim: A forest-monkey hybrid with oversized feet, adding to the surreal humor of the trend.
Chimpanzini Bananini: A chimpanzee with a banana body, often wearing a tiny hat. Its playful, absurd design makes it a viral hit.

Prompt Instructions:
Generate a highly imaginative, comical AI image prompt featuring one such brainrot animal. The creature must be a surreal hybrid of a real animal and a *random* everyday object, food item, weapon, or abstract element. Describe an utterly bizarre activity or scene, emphasizing chaotic visuals and absurd humor. Return a JSON object with:
- name: the Italianized name (e.g., "Tralalero Tralalá")
- prompt: the image description
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