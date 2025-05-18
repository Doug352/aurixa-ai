import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const tonePresets = {
  wisdom: "You are AURIXA, a wise and reflective AI assistant. Speak with clarity, purpose, and spiritual insight.",
  direct: "You are AURIXA, an efficient and highly intelligent AI. Be concise, to the point, and practical.",
  empathic: "You are AURIXA, a compassionate and emotionally supportive assistant. Speak gently and with empathy."
};

export default async function handler(req, res) {
  console.log("[AURIXA] Request received");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { message, tone = 'wisdom' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message input' });
  }

  const systemPrompt = tonePresets[tone] || tonePresets['wisdom'];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const reply = response?.data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.warn("[AURIXA] Empty reply from OpenAI:", JSON.stringify(response.data, null, 2));
      return res.status(500).json({ error: "No response from AURIXA." });
    }

    console.log("[AURIXA] Success:", reply);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("[AURIXA ERROR]", error?.response?.data || error.message);
    res.status(500).json({ error: "AURIXA backend error." });
  }
}
EOFgit add pages/api/aurixa.js
git commit -m "Final fix: overwrite AURIXA backend completely"
git push

