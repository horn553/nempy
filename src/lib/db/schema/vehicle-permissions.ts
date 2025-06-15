import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles';
import { users } from './users';

export const vehiclePermissions = sqliteTable(
	'vehicle_permissions',
	{
		vehicleId: text('vehicle_id')
			.notNull()
			.references(() => vehicles.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		permission: text('permission', { enum: ['view', 'add_record', 'edit', 'admin'] }).notNull(),
		grantedBy: text('granted_by')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		grantedAt: integer('granted_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(unixepoch())`)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.vehicleId, table.userId] })
	})
);
