import express from 'express';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';
import process from 'node:process';

const app = express();
const port = Number(process.env.PORT) || 3000;
const distPath = fileURLToPath(new URL('../dist/', import.meta.url));

app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Express is working' });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);

    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
    });
  }
});

app.get('/api/tests', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM public.test ORDER BY id'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Database query failed:', error.message);

    res.status(500).json({
      error: 'Failed to load test data',
    });
  }
});

app.use(express.static(distPath));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});