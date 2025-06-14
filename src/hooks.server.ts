import { validateSessionToken } from '$lib/server/auth/sessions.js';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');
	
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(sessionToken);
	
	if (session) {
		event.cookies.set('session', sessionToken, {
			path: '/',
			secure: import.meta.env.PROD,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax'
		});
	} else {
		event.cookies.delete('session', { path: '/' });
	}

	event.locals.user = user;
	event.locals.session = session;
	
	return resolve(event);
};