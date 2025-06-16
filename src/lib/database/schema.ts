import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	avatar: text('avatar'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Vehicles table
export const vehicles = sqliteTable('vehicles', {
	id: text('id').primaryKey(),
	ownerId: text('owner_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	manufacturer: text('manufacturer').notNull(),
	model: text('model').notNull(),
	year: integer('year').notNull(),
	fuelType: text('fuel_type', { enum: ['gasoline', 'diesel', 'hybrid', 'electric'] }).notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Fuel records table
export const fuelRecords = sqliteTable('fuel_records', {
	id: text('id').primaryKey(),
	vehicleId: text('vehicle_id')
		.notNull()
		.references(() => vehicles.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	date: text('date').notNull(),
	odometer: real('odometer').notNull(),
	fuelAmount: real('fuel_amount').notNull(),
	fuelCost: real('fuel_cost').notNull(),
	fuelPrice: real('fuel_price').notNull(),
	location: text('location'),
	notes: text('notes'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Vehicle permissions table
export const vehiclePermissions = sqliteTable('vehicle_permissions', {
	id: text('id').primaryKey(),
	vehicleId: text('vehicle_id')
		.notNull()
		.references(() => vehicles.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	permission: text('permission', { enum: ['viewer', 'editor', 'admin'] }).notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Type exports for TypeScript
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectVehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;
export type SelectFuelRecord = typeof fuelRecords.$inferSelect;
export type InsertFuelRecord = typeof fuelRecords.$inferInsert;
export type SelectVehiclePermission = typeof vehiclePermissions.$inferSelect;
export type InsertVehiclePermission = typeof vehiclePermissions.$inferInsert;
