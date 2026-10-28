import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
});

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: true }
    : false,
  connectionTimeoutMillis: 5000,
  statement_timeout: 5000,
});

pool.on('error', (error) => {
  console.error('Unexpected database error:', error.message);
});