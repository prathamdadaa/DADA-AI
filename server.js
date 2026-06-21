require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory chat history per session (simple, no DB needed)
const sessions = {};

const SYSTEM_PROMPT = `You are DADA AI, a free helpful AI assistant created by Pratham Dada from Dhanbad, Jharkhand.
You help users with all kinds of questions and generate code in any programming language.
Always format code using markdown code blocks with the correct language tag.
Be clear, friendly, and concise unless the user asks for detail.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(500).json({
        error: 'GROQ_API_KEY not set. Add your free key from https://console.groq.com/keys to the .env file.'
      });
    }

    const sid = sessionId || 'default';
    if (!sessions[sid]) {
      sessions[sid] = [{ role: 'system', content: SYSTEM_PROMPT }];
    }
    sessions[sid].push({ role: 'user', content: message });

    // Keep history short to save tokens
    const history = sessions[sid].slice(-20);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: history,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ error: data.error?.message || 'AI provider error.' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    sessions[sid].push({ role: 'assistant', content: reply });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/reset', (req, res) => {
  const sid = req.body.sessionId || 'default';
  delete sessions[sid];
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`DADA AI server running at http://localhost:${PORT}`);
});
