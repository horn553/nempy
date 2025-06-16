import { eq } from 'drizzle-orm';
import type { User, Result } from '$lib/domain/types.js';
import type { IUserRepository } from './interfaces/IUserRepository.js';
import type { DatabaseConnection } from '$lib/database/connection.js';
import { users } from '$lib/database/schema.js';
import { generateId, toISOString, fromISOString } from '$lib/database/utils.js';

export class DrizzleUserRepository implements IUserRepository {
	constructor(private db: DatabaseConnection) {}

	async findById(id: string): Promise<Result<User | null>> {
		try {
			const result = await this.db.select().from(users).where(eq(users.id, id)).get();

			if (!result) {
				return { success: true, data: null };
			}

			const user: User = {
				id: result.id,
				email: result.email,
				name: result.name,
				avatar: result.avatar || undefined,
				createdAt: fromISOString(result.createdAt),
				updatedAt: fromISOString(result.updatedAt)
			};

			return { success: true, data: user };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Database query failed')
			};
		}
	}

	async findByEmail(email: string): Promise<Result<User | null>> {
		try {
			const result = await this.db.select().from(users).where(eq(users.email, email)).get();

			if (!result) {
				return { success: true, data: null };
			}

			const user: User = {
				id: result.id,
				email: result.email,
				name: result.name,
				avatar: result.avatar || undefined,
				createdAt: fromISOString(result.createdAt),
				updatedAt: fromISOString(result.updatedAt)
			};

			return { success: true, data: user };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Database query failed')
			};
		}
	}

	async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<User>> {
		try {
			const now = new Date();
			const id = generateId();

			const insertData = {
				id,
				email: userData.email,
				name: userData.name,
				avatar: userData.avatar || null,
				createdAt: toISOString(now),
				updatedAt: toISOString(now)
			};

			await this.db.insert(users).values(insertData);

			const user: User = {
				id,
				email: userData.email,
				name: userData.name,
				avatar: userData.avatar,
				createdAt: now,
				updatedAt: now
			};

			return { success: true, data: user };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Failed to create user')
			};
		}
	}

	async update(
		id: string,
		userData: Partial<Pick<User, 'name' | 'avatar'>>
	): Promise<Result<User>> {
		try {
			const updateData = {
				...userData,
				avatar: userData.avatar || null,
				updatedAt: toISOString(new Date())
			};

			await this.db.update(users).set(updateData).where(eq(users.id, id));

			const updatedUser = await this.findById(id);
			if (!updatedUser.success) {
				return updatedUser;
			}

			if (!updatedUser.data) {
				return {
					success: false,
					error: new Error('User not found after update')
				};
			}

			return { success: true, data: updatedUser.data };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Failed to update user')
			};
		}
	}

	async delete(id: string): Promise<Result<void>> {
		try {
			await this.db.delete(users).where(eq(users.id, id));
			return { success: true, data: undefined };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Failed to delete user')
			};
		}
	}

	async findAll(limit = 50, offset = 0): Promise<Result<User[]>> {
		try {
			const results = await this.db.select().from(users).limit(limit).offset(offset);

			const userList: User[] = results.map((result) => ({
				id: result.id,
				email: result.email,
				name: result.name,
				avatar: result.avatar || undefined,
				createdAt: fromISOString(result.createdAt),
				updatedAt: fromISOString(result.updatedAt)
			}));

			return { success: true, data: userList };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Failed to fetch users')
			};
		}
	}
}
