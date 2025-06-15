import { OAuth2RequestError } from 'arctic';
import { generateSessionToken, createSession } from '$lib/server/auth/sessions.js';
import { google, getGoogleUser } from '$lib/server/auth/google.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state') ?? null;
	const storedCodeVerifier = cookies.get('google_oauth_code_verifier') ?? null;

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
		const googleUser = await getGoogleUser(tokens.accessToken());

		// Check if user exists
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.googleId, googleUser.id))
			.limit(1);

		let userId: string;

		if (existingUser.length === 0) {
			// Create new user
			const newUserId = crypto.randomUUID();
			await db.insert(users).values({
				id: newUserId,
				googleId: googleUser.id,
				email: googleUser.email,
				name: googleUser.name,
				picture: googleUser.picture
			});
			userId = newUserId;
		} else {
			userId = existingUser[0].id;
			// Update user info
			await db
				.update(users)
				.set({
					name: googleUser.name,
					picture: googleUser.picture,
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));
		}

		const sessionToken = generateSessionToken();
		await createSession(sessionToken, userId);

		cookies.set('session', sessionToken, {
			path: '/',
			secure: import.meta.env.PROD,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax'
		});

		// Clean up OAuth cookies
		cookies.delete('google_oauth_state', { path: '/' });
		cookies.delete('google_oauth_code_verifier', { path: '/' });

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
