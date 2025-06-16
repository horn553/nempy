import { sql } from 'drizzle-orm';
import type { DatabaseConnection } from './connection.js';

// Generate UUID using crypto.randomUUID() or fallback
export function generateId(): string {
	return crypto.randomUUID();
}

// Convert ISO string to Date and back for consistent handling
export function toISOString(date: Date): string {
	return date.toISOString();
}

export function fromISOString(dateString: string): Date {
	return new Date(dateString);
}

// Update the updatedAt timestamp
export function updateTimestamp() {
	return sql`CURRENT_TIMESTAMP`;
}

// Pagination helper
export interface PaginationOptions {
	limit?: number;
	offset?: number;
}

export function applyPagination({ limit = 50, offset = 0 }: PaginationOptions = {}) {
	return {
		limit: Math.min(limit, 100), // Max 100 items per page
		offset: Math.max(offset, 0) // Ensure non-negative offset
	};
}

// Batch operation helper for D1
export async function executeBatch(
	db: DatabaseConnection,
	operations: Array<{ statement: unknown; params?: unknown[] }>
) {
	// For now, we'll execute operations sequentially
	// In a real implementation, you'd use D1's batch() method
	const results = [];
	for (const operation of operations) {
		const result = await operation.statement;
		results.push(result);
	}
	return results;
}
