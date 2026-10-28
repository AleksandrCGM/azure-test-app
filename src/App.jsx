import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const response = await fetch('/api/tests', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();
        setRows(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>React + Express + PostgreSQL</h1>

      {loading && <p>Загрузка данных…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <ul>
          {rows.map((row) => (
            <li key={row.id}>{row.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
