import type { FuelRecord, Result } from '$lib/domain/types.js';

export interface IFuelRecordRepository {
	findById(id: string): Promise<Result<FuelRecord | null>>;
	findByVehicleId(
		vehicleId: string,
		limit?: number,
		offset?: number
	): Promise<Result<FuelRecord[]>>;
	findByUserId(userId: string, limit?: number, offset?: number): Promise<Result<FuelRecord[]>>;
	create(
		fuelRecord: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<Result<FuelRecord>>;
	update(
		id: string,
		fuelRecord: Partial<
			Pick<
				FuelRecord,
				'date' | 'odometer' | 'fuelAmount' | 'fuelCost' | 'fuelPrice' | 'location' | 'notes'
			>
		>
	): Promise<Result<FuelRecord>>;
	delete(id: string): Promise<Result<void>>;
	findByVehicleIdAndDateRange(
		vehicleId: string,
		startDate: Date,
		endDate: Date
	): Promise<Result<FuelRecord[]>>;
	getLatestByVehicleId(vehicleId: string): Promise<Result<FuelRecord | null>>;
	calculateFuelEconomy(
		vehicleId: string,
		startDate?: Date,
		endDate?: Date
	): Promise<Result<number | null>>;
}
