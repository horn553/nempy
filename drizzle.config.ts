import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/db/schema/*',
	out: './drizzle',
	dialect: 'sqlite'
} satisfies Config;
