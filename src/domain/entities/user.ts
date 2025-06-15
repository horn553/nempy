import type { Result } from '../types/result';
import { Ok, Err } from '../types/result';

export interface User {
	readonly id: string;
	readonly googleId: string;
	readonly name: string;
	readonly email: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface CreateUserParams {
	id: string;
	googleId: string;
	name: string;
	email: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UpdateUserParams {
	name?: string;
	email?: string;
}

export const UserErrors = {
	InvalidId: 'ユーザーIDが無効です',
	InvalidGoogleId: 'Google IDが無効です',
	InvalidName: '名前が無効です',
	InvalidEmail: 'メールアドレスが無効です',
	NameTooLong: '名前は100文字以内で入力してください',
	EmailTooLong: 'メールアドレスは255文字以内で入力してください'
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;

export const createUser = (params: CreateUserParams): Result<User, string> => {
	if (!params.id || params.id.trim() === '') {
		return Err(UserErrors.InvalidId);
	}

	if (!params.googleId || params.googleId.trim() === '') {
		return Err(UserErrors.InvalidGoogleId);
	}

	if (!params.name || params.name.trim() === '') {
		return Err(UserErrors.InvalidName);
	}

	if (params.name.length > MAX_NAME_LENGTH) {
		return Err(UserErrors.NameTooLong);
	}

	if (!params.email || params.email.trim() === '') {
		return Err(UserErrors.InvalidEmail);
	}

	const trimmedEmail = params.email.trim();

	if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
		return Err(UserErrors.EmailTooLong);
	}

	if (!EMAIL_REGEX.test(trimmedEmail)) {
		return Err(UserErrors.InvalidEmail);
	}

	const now = new Date();
	const user: User = {
		id: params.id.trim(),
		googleId: params.googleId.trim(),
		name: params.name.trim(),
		email: trimmedEmail.toLowerCase(),
		createdAt: params.createdAt || now,
		updatedAt: params.updatedAt || now
	};

	return Ok(user);
};

export const updateUser = (user: User, params: UpdateUserParams): Result<User, string> => {
	const updates: {
		name?: string;
		email?: string;
		updatedAt?: Date;
	} = {};

	if (params.name !== undefined) {
		if (params.name.trim() === '') {
			return Err(UserErrors.InvalidName);
		}
		if (params.name.length > MAX_NAME_LENGTH) {
			return Err(UserErrors.NameTooLong);
		}
		updates.name = params.name.trim();
	}

	if (params.email !== undefined) {
		if (params.email.trim() === '') {
			return Err(UserErrors.InvalidEmail);
		}
		const trimmedEmail = params.email.trim();
		if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
			return Err(UserErrors.EmailTooLong);
		}
		if (!EMAIL_REGEX.test(trimmedEmail)) {
			return Err(UserErrors.InvalidEmail);
		}
		updates.email = trimmedEmail.toLowerCase();
	}

	const updatedUser: User = {
		...user,
		...updates,
		updatedAt: new Date()
	};

	return Ok(updatedUser);
};

export const getUserDisplayName = (user: User): string => {
	return user.name || user.email.split('@')[0];
};
