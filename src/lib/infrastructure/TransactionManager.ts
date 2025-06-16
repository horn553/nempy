import type { DatabaseTransaction, Result } from '$lib/domain/types.js';
import type { D1Database } from '@cloudflare/workers-types';

export interface ITransactionManager {
	withTransaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<Result<T>>;
}

// Unit of Work pattern for Cloudflare D1 batch operations
export interface UnitOfWork {
	addOperation(statement: unknown, params?: unknown[]): void;
	execute(): Promise<Result<unknown[]>>;
	clear(): void;
}

export class D1UnitOfWork implements UnitOfWork {
	private operations: Array<{ statement: unknown; params?: unknown[] }> = [];

	constructor(private d1: D1Database) {}

	addOperation(statement: unknown, params?: unknown[]): void {
		this.operations.push({ statement, params });
	}

	async execute(): Promise<Result<unknown[]>> {
		try {
			if (this.operations.length === 0) {
				return { success: true, data: [] };
			}

			// Convert prepared statements to D1 batch format
			const batchStatements = this.operations.map((op) => {
				if (op.params && op.params.length > 0) {
					return op.statement.bind(...op.params);
				}
				return op.statement;
			});

			// Execute batch operation atomically
			const results = await this.d1.batch(batchStatements);
			return { success: true, data: results };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Batch operation failed')
			};
		} finally {
			this.clear();
		}
	}

	clear(): void {
		this.operations = [];
	}
}

export class TransactionManager implements ITransactionManager {
	constructor(private d1: D1Database) {}

	async withTransaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<Result<T>> {
		try {
			// For Cloudflare D1, we use Unit of Work pattern with batch operations
			const unitOfWork = new D1UnitOfWork(this.d1);
			const transaction: DatabaseTransaction = {
				async commit() {
					const result = await unitOfWork.execute();
					if (!result.success) {
						throw result.error;
					}
				},
				async rollback() {
					unitOfWork.clear();
					throw new Error('Transaction rollback requested');
				},
				// Add method to queue operations in unit of work
				addOperation: unitOfWork.addOperation.bind(unitOfWork)
			};

			try {
				const result = await callback(transaction);
				await transaction.commit();
				return { success: true, data: result };
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Transaction failed')
			};
		}
	}
}

export class MockTransactionManager implements ITransactionManager {
	async withTransaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<Result<T>> {
		try {
			const mockTransaction: DatabaseTransaction = {
				async commit() {
					// Mock implementation - no-op
				},
				async rollback() {
					throw new Error('Mock transaction rollback');
				}
			};

			const result = await callback(mockTransaction);
			return { success: true, data: result };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error occurred')
			};
		}
	}
}
