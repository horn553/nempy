import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/database/schema.ts',
	out: './migrations',
	dialect: 'sqlite',
	driver: 'd1-http'
} satisfies Config;
