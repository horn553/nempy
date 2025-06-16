import type { User, Result } from '$lib/domain/types.js';

export interface IUserRepository {
	findById(id: string): Promise<Result<User | null>>;
	findByEmail(email: string): Promise<Result<User | null>>;
	create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<User>>;
	update(id: string, user: Partial<Pick<User, 'name' | 'avatar'>>): Promise<Result<User>>;
	delete(id: string): Promise<Result<void>>;
	findAll(limit?: number, offset?: number): Promise<Result<User[]>>;
}
