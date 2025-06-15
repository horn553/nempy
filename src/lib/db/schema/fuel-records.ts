import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles';
import { users } from './users';

export const fuelRecords = sqliteTable('fuel_records', {
	id: text('id').primaryKey(),
	vehicleId: text('vehicle_id')
		.notNull()
		.references(() => vehicles.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	recordedAt: integer('recorded_at', { mode: 'timestamp' }).notNull(),
	odometer: real('odometer').notNull(),
	fuelAmount: real('fuel_amount').notNull(),
	pricePerUnit: real('price_per_unit').notNull(),
	totalPrice: real('total_price').notNull(),
	isFull: integer('is_full', { mode: 'boolean' }).notNull().default(true),
	location: text('location'),
	notes: text('notes'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});
