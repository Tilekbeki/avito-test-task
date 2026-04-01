import { useState } from 'react';
const AdViewPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3', // или другая модель
          prompt: prompt,
          stream: false, // false - получить полный ответ сразу
        }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Ошибка подключения к Ollama');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Введите ваш вопрос..."
        rows={4}
        cols={50}
      />
      <button onClick={sendRequest} disabled={loading}>
        {loading ? 'Отправка...' : 'Отправить'}
      </button>
      {response && (
        <div>
          <h3>Ответ:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AdViewPage;
