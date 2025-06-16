import type { Vehicle, Result } from '$lib/domain/types.js';

export interface IVehicleRepository {
	findById(id: string): Promise<Result<Vehicle | null>>;
	findByOwnerId(ownerId: string): Promise<Result<Vehicle[]>>;
	create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Vehicle>>;
	update(
		id: string,
		vehicle: Partial<Pick<Vehicle, 'name' | 'manufacturer' | 'model' | 'year' | 'fuelType'>>
	): Promise<Result<Vehicle>>;
	delete(id: string): Promise<Result<void>>;
	findAll(limit?: number, offset?: number): Promise<Result<Vehicle[]>>;
	findByUserAccess(userId: string): Promise<Result<Vehicle[]>>;
}
