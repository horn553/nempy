export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Vehicle {
	id: string;
	ownerId: string;
	name: string;
	manufacturer: string;
	model: string;
	year: number;
	fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
	createdAt: Date;
	updatedAt: Date;
}

export interface FuelRecord {
	id: string;
	vehicleId: string;
	userId: string;
	date: Date;
	odometer: number;
	fuelAmount: number;
	fuelCost: number;
	fuelPrice: number;
	location?: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export enum Permission {
	VIEWER = 'viewer',
	EDITOR = 'editor',
	ADMIN = 'admin'
}

export interface VehiclePermission {
	id: string;
	vehicleId: string;
	userId: string;
	permission: Permission;
	createdAt: Date;
	updatedAt: Date;
}

export type Result<T, E = Error> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: E;
	  };

export interface DatabaseTransaction {
	commit(): Promise<void>;
	rollback(): Promise<void>;
}
