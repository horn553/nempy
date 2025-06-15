import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import * as schema from './schema.js';

// For development, use a local SQLite database
// In production, this would be replaced with Cloudflare D1
const sqlite = new Database(dev ? 'dev.db' : ':memory:');
export const db = drizzle(sqlite, { schema });

// Initialize tables in development
if (dev) {
	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			google_id TEXT UNIQUE NOT NULL,
			email TEXT UNIQUE NOT NULL,
			name TEXT NOT NULL,
			picture TEXT,
			created_at INTEGER NOT NULL DEFAULT (unixepoch()),
			updated_at INTEGER NOT NULL DEFAULT (unixepoch())
		);
		
		CREATE TABLE IF NOT EXISTS sessions (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			expires_at INTEGER NOT NULL
		);
	`);
}
