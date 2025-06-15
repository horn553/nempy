import { drizzle } from 'drizzle-orm/d1';
import { users, vehicles, fuelRecords, vehiclePermissions } from './schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export async function seed(db: DrizzleD1Database) {
	console.log('Seeding database...');

	// Create sample users
	const sampleUsers = [
		{
			id: 'user-1',
			googleId: 'google-123456',
			email: 'demo@example.com',
			name: 'Demo User',
			avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
		},
		{
			id: 'user-2',
			googleId: 'google-789012',
			email: 'shared@example.com',
			name: 'Shared User',
			avatarUrl: null
		}
	];

	await db.insert(users).values(sampleUsers).onConflictDoNothing();

	// Create sample vehicles
	const sampleVehicles = [
		{
			id: 'vehicle-1',
			ownerId: 'user-1',
			name: '私の車',
			make: 'Toyota',
			model: 'Prius',
			year: 2020,
			licensePlate: '品川 300 あ 12-34',
			fuelType: 'hybrid',
			fuelCapacity: 43
		},
		{
			id: 'vehicle-2',
			ownerId: 'user-1',
			name: '妻の車',
			make: 'Honda',
			model: 'Fit',
			year: 2019,
			licensePlate: '横浜 500 さ 56-78',
			fuelType: 'gasoline',
			fuelCapacity: 40
		}
	];

	await db.insert(vehicles).values(sampleVehicles).onConflictDoNothing();

	// Create sample fuel records
	const now = Date.now();
	const day = 24 * 60 * 60 * 1000;
	const sampleFuelRecords = [
		{
			id: 'record-1',
			vehicleId: 'vehicle-1',
			userId: 'user-1',
			recordedAt: new Date(now - 30 * day),
			odometer: 15000,
			fuelAmount: 35.5,
			pricePerUnit: 165,
			totalPrice: 5857.5,
			isFull: true,
			location: '東京都港区',
			notes: '初回給油'
		},
		{
			id: 'record-2',
			vehicleId: 'vehicle-1',
			userId: 'user-1',
			recordedAt: new Date(now - 20 * day),
			odometer: 15450,
			fuelAmount: 32.8,
			pricePerUnit: 168,
			totalPrice: 5510.4,
			isFull: true,
			location: '神奈川県横浜市',
			notes: null
		},
		{
			id: 'record-3',
			vehicleId: 'vehicle-1',
			userId: 'user-1',
			recordedAt: new Date(now - 10 * day),
			odometer: 15890,
			fuelAmount: 31.2,
			pricePerUnit: 170,
			totalPrice: 5304,
			isFull: true,
			location: '東京都世田谷区',
			notes: '高速道路利用後'
		}
	];

	await db.insert(fuelRecords).values(sampleFuelRecords).onConflictDoNothing();

	// Create sample permissions
	const samplePermissions = [
		{
			vehicleId: 'vehicle-1',
			userId: 'user-2',
			permission: 'view' as const,
			grantedBy: 'user-1'
		}
	];

	await db.insert(vehiclePermissions).values(samplePermissions).onConflictDoNothing();

	console.log('Database seeded successfully!');
}
