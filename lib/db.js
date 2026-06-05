// Database connection helper — shared across all API routes
// Uses mysql2 with a connection pool (recommended for Vercel serverless)
// Each API route imports { pool } from "@/lib/db" and calls pool.query(...)
// Connection details come from .env.local — never hard-code credentials here
//
// TiDB Cloud requires SSL — ssl: { rejectUnauthorized: true } is set below
// Short-lived pool is safe for serverless: connections are re-used within a request
// but not kept alive between cold starts

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "4000"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };
