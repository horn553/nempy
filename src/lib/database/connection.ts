import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema.js';

export type DatabaseConnection = ReturnType<typeof drizzle<typeof schema>>;

export function createDatabaseConnection(d1: D1Database): DatabaseConnection {
	return drizzle(d1, { schema });
}

// Type helper for repository constructors
export type { D1Database } from '@cloudflare/workers-types';
