import { describe, it, expect, beforeEach } from 'vitest';
import { createUser, updateUser, getUserDisplayName, UserErrors, type User } from './user';
import { isOk, isErr } from '../types/result';

describe('User entity', () => {
	const validUserParams = {
		id: 'user-123',
		googleId: 'google-123',
		name: '田中太郎',
		email: 'tanaka@example.com'
	};

	describe('createUser', () => {
		it('should create a valid user', () => {
			const result = createUser(validUserParams);

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.id).toBe('user-123');
				expect(result.value.googleId).toBe('google-123');
				expect(result.value.name).toBe('田中太郎');
				expect(result.value.email).toBe('tanaka@example.com');
				expect(result.value.createdAt).toBeInstanceOf(Date);
				expect(result.value.updatedAt).toBeInstanceOf(Date);
			}
		});

		it('should trim whitespace from string fields', () => {
			const result = createUser({
				...validUserParams,
				id: '  user-123  ',
				googleId: '  google-123  ',
				name: '  田中太郎  ',
				email: '  TANAKA@example.com  '
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.id).toBe('user-123');
				expect(result.value.name).toBe('田中太郎');
				expect(result.value.email).toBe('tanaka@example.com');
			}
		});

		it('should convert email to lowercase', () => {
			const result = createUser({
				...validUserParams,
				email: 'TANAKA@EXAMPLE.COM'
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.email).toBe('tanaka@example.com');
			}
		});

		it('should use provided timestamps', () => {
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const result = createUser({
				...validUserParams,
				createdAt,
				updatedAt
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.createdAt).toBe(createdAt);
				expect(result.value.updatedAt).toBe(updatedAt);
			}
		});

		it('should fail with empty id', () => {
			const result = createUser({ ...validUserParams, id: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidId);
			}
		});

		it('should fail with whitespace-only id', () => {
			const result = createUser({ ...validUserParams, id: '   ' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidId);
			}
		});

		it('should fail with empty googleId', () => {
			const result = createUser({ ...validUserParams, googleId: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidGoogleId);
			}
		});

		it('should fail with empty name', () => {
			const result = createUser({ ...validUserParams, name: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidName);
			}
		});

		it('should fail with name exceeding max length', () => {
			const longName = 'あ'.repeat(101);
			const result = createUser({ ...validUserParams, name: longName });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.NameTooLong);
			}
		});

		it('should fail with empty email', () => {
			const result = createUser({ ...validUserParams, email: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidEmail);
			}
		});

		it('should fail with email exceeding max length', () => {
			const longEmail = 'a'.repeat(244) + '@example.com'; // 256 chars total
			const result = createUser({ ...validUserParams, email: longEmail });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.EmailTooLong);
			}
		});

		it('should fail with invalid email format', () => {
			const invalidEmails = [
				'notanemail',
				'@example.com',
				'user@',
				'user@.com',
				'user@example',
				'user @example.com',
				'user@example .com'
			];

			for (const email of invalidEmails) {
				const result = createUser({ ...validUserParams, email });
				expect(isErr(result)).toBe(true);
				if (isErr(result)) {
					expect(result.error).toBe(UserErrors.InvalidEmail);
				}
			}
		});
	});

	describe('updateUser', () => {
		let user: User;

		beforeEach(() => {
			const result = createUser(validUserParams);
			if (isOk(result)) {
				user = result.value;
			}
		});

		it('should update name', async () => {
			await new Promise((resolve) => setTimeout(resolve, 10));
			const result = updateUser(user, { name: '山田花子' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.name).toBe('山田花子');
				expect(result.value.email).toBe(user.email);
				expect(result.value.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
			}
		});

		it('should update email', () => {
			const result = updateUser(user, { email: 'yamada@example.com' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.name).toBe(user.name);
				expect(result.value.email).toBe('yamada@example.com');
			}
		});

		it('should update both name and email', () => {
			const result = updateUser(user, {
				name: '山田花子',
				email: 'yamada@example.com'
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.name).toBe('山田花子');
				expect(result.value.email).toBe('yamada@example.com');
			}
		});

		it('should trim and lowercase updated values', () => {
			const result = updateUser(user, {
				name: '  山田花子  ',
				email: '  YAMADA@EXAMPLE.COM  '
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.name).toBe('山田花子');
				expect(result.value.email).toBe('yamada@example.com');
			}
		});

		it('should not change values when no updates provided', async () => {
			await new Promise((resolve) => setTimeout(resolve, 10));
			const result = updateUser(user, {});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.name).toBe(user.name);
				expect(result.value.email).toBe(user.email);
				expect(result.value.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
			}
		});

		it('should fail with empty name', () => {
			const result = updateUser(user, { name: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidName);
			}
		});

		it('should fail with name exceeding max length', () => {
			const longName = 'あ'.repeat(101);
			const result = updateUser(user, { name: longName });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.NameTooLong);
			}
		});

		it('should fail with empty email', () => {
			const result = updateUser(user, { email: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidEmail);
			}
		});

		it('should fail with invalid email format', () => {
			const result = updateUser(user, { email: 'notanemail' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(UserErrors.InvalidEmail);
			}
		});
	});

	describe('getUserDisplayName', () => {
		it('should return name when available', () => {
			const result = createUser(validUserParams);
			if (isOk(result)) {
				expect(getUserDisplayName(result.value)).toBe('田中太郎');
			}
		});

		it('should return email username when name is empty', () => {
			const user: User = {
				id: 'user-123',
				googleId: 'google-123',
				name: '',
				email: 'tanaka@example.com',
				createdAt: new Date(),
				updatedAt: new Date()
			};

			expect(getUserDisplayName(user)).toBe('tanaka');
		});
	});
});
