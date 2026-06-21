# DADA AI 🤖

A free AI agent web app that answers questions and generates code — built by **Pratham Dada**, Dhanbad, Jharkhand.

## Features
- Chat-style web UI
- Powered by a free AI API (Groq — fast, free, no credit card needed)
- Generates code with proper formatting
- Per-user chat memory (session-based)
- "New Chat" reset button

## Setup (takes ~5 minutes)

### 1. Get a free Groq API key
1. Go to https://console.groq.com/keys
2. Sign up (free, no card required)
3. Click "Create API Key" and copy it

### 2. Configure the project
```bash
cd dada-ai
cp .env.example .env
```
Open `.env` and paste your key:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
PORT=3000
```

### 3. Install & run
```bash
npm install
npm start
```

### 4. Open the app
Visit **http://localhost:3000** in your browser. Start chatting with DADA AI!

## Deploying for free (so anyone can use it online)
You can deploy this Node.js app for free on:
- **Render.com** (free web service tier)
- **Railway.app**
- **Cyclic.sh**

Just connect your GitHub repo, set the `GROQ_API_KEY` environment variable in the platform's dashboard, and deploy.

## Project structure
```
dada-ai/
├── server.js          # Express backend, talks to Groq API
├── package.json
├── .env.example        # Copy to .env and add your key
└── public/
    ├── index.html       # Chat UI
    ├── style.css        # Styling
    └── app.js           # Chat logic
```

## Swap the AI model
In `server.js`, change the `model` field to any other free Groq model (e.g. `llama-3.1-8b-instant` for faster replies, or `mixtral-8x7b-32768`).

---
Made with ❤️ by **Pratham Dada** — Dhanbad, Jharkhand
