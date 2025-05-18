import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState('wisdom');

  const sendMessage = async () => {
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/aurixa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, tone })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('AURIXA API error:', errText);
        setResponse('AURIXA failed to respond.');
        return;
      }

      const data = await res.json();
      setResponse(data.reply || 'No reply received.');
    } catch (error) {
      console.error('Fetch error:', error);
      setResponse('AURIXA encountered an unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>AURIXA</h1>
      <p><i>Your emotionally intelligent AI assistant</i></p>

      <label><strong>Tone:</strong></label>{' '}
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

      <div style={{ marginTop: '2rem', background: '#f4f4f4', padding: '1rem' }}>
        <strong>AURIXA:</strong>
        <p>{response}</p>
      </div>
    </main>
  );
}
