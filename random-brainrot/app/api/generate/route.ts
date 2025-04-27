export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing Gemini API key');
      return new Response(JSON.stringify({ error: 'Missing Gemini API key' }), { status: 500 });
    }

    const userPrompt = `Generate a highly imaginative and comical prompt for an AI image generator, featuring a Brainrot animal (either a real creature warped into something strange or a completely invented fantastical beast). The prompt must detail an utterly surreal and unexpected activity or situation the animal is engaged in, incorporating bizarre elements and a touch of chaotic energy. Give this creature a name in the classic Italian animal naming style: " [Descriptive Adjective] [Animal Noun]". The adjective should be as outlandish as the animal itself. Return the result as a JSON object with the keys 'name' and 'prompt'. Example: { "name": "Il Cosmico Formichiere", "prompt": "A cosmic anteater wearing a tiny opera helmet dramatically conducting a symphony of exploding spaghetti in a field of giant rubber ducks." }`;

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