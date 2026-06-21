const chat = document.getElementById('chat');
const form = document.getElementById('chatForm');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');

const sessionId = localStorage.getItem('dada_session') || (() => {
  const id = 'sess_' + Math.random().toString(36).slice(2);
  localStorage.setItem('dada_session', id);
  return id;
})();

function addMessage(text, sender) {
  const wrap = document.createElement('div');
  wrap.className = `message ${sender}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = sender === 'bot' ? marked.parse(text) : escapeHtml(text);
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
  return bubble;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 140) + 'px';
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;

  const typingBubble = addMessage('DADA AI is thinking...', 'bot');
  typingBubble.classList.add('typing');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId })
    });
    const data = await res.json();
    typingBubble.classList.remove('typing');

    if (!res.ok) {
      typingBubble.innerHTML = `⚠️ ${data.error || 'Something went wrong.'}`;
    } else {
      typingBubble.innerHTML = marked.parse(data.reply);
    }
  } catch (err) {
    typingBubble.classList.remove('typing');
    typingBubble.innerHTML = '⚠️ Could not reach the server.';
  }

  sendBtn.disabled = false;
  chat.scrollTop = chat.scrollHeight;
});

resetBtn.addEventListener('click', async () => {
  await fetch('/api/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  chat.innerHTML = '';
  addMessage("👋 Hi, I'm **DADA AI** — your free assistant for answers and code. Ask me anything!", 'bot');
});
