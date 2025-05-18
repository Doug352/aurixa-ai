import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState('wisdom');

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/aurixa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, tone })
      });

      const data = await res.json();
      setResponse(data.reply || 'No response');
    } catch (err) {
      setResponse('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>AURIXA</h1>
      <p><i>Your advanced, emotionally intelligent assistant</i></p>

      <label>Tone: </label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="wisdom">Wisdom</option>
        <option value="direct">Direct</option>
        <option value="empathic">Empathic</option>
      </select>

      <textarea
        rows="4"
        cols="60"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask AURIXA anything..."
        style={{ marginTop: '1rem', width: '100%' }}
      />
      <br />
      <button onClick={sendMessage} disabled={loading || !message}>
        {loading ? 'Thinking...' : 'Send'}
      </button>

      <div style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem' }}>
        <strong>AURIXA:</strong>
        <p>{response}</p>
      </div>
    </main>
  );
}