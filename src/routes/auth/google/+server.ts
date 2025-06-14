import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { google } from '$lib/server/auth/google.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateState();
	const url = await google.createAuthorizationURL(state, {
		scopes: ['profile', 'email']
	});

	cookies.set('google_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	throw redirect(302, url.toString());
};