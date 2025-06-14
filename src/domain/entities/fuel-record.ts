import type { Result } from '../types/result';
import { Ok, Err } from '../types/result';

export interface FuelRecord {
	readonly id: string;
	readonly vehicleId: string;
	readonly date: Date;
	readonly gasStationName: string;
	readonly odometer: number;
	readonly fuelPrice: number;
	readonly fuelAmount: number;
	readonly totalCost: number;
	readonly isFullTank: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface CreateFuelRecordParams {
	id: string;
	vehicleId: string;
	date: Date;
	gasStationName: string;
	odometer: number;
	fuelPrice: number;
	fuelAmount: number;
	isFullTank: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UpdateFuelRecordParams {
	date?: Date;
	gasStationName?: string;
	odometer?: number;
	fuelPrice?: number;
	fuelAmount?: number;
	isFullTank?: boolean;
}

export const FuelRecordErrors = {
	InvalidId: '給油記録IDが無効です',
	InvalidVehicleId: '車両IDが無効です',
	InvalidDate: '日時が無効です',
	FutureDateNotAllowed: '未来の日時は指定できません',
	InvalidGasStationName: 'ガソリンスタンド名が無効です',
	GasStationNameTooLong: 'ガソリンスタンド名は100文字以内で入力してください',
	InvalidOdometer: '走行距離が無効です',
	OdometerTooLow: '走行距離は0以上の値を入力してください',
	OdometerTooHigh: '走行距離が大きすぎます',
	InvalidFuelPrice: '燃料単価が無効です',
	FuelPriceTooLow: '燃料単価は0より大きい値を入力してください',
	FuelPriceTooHigh: '燃料単価が大きすぎます',
	InvalidFuelAmount: '給油量が無効です',
	FuelAmountTooLow: '給油量は0より大きい値を入力してください',
	FuelAmountTooHigh: '給油量が大きすぎます'
} as const;

const MAX_GAS_STATION_NAME_LENGTH = 100;
const MAX_ODOMETER = 9999999; // 9,999,999 km
const MAX_FUEL_PRICE = 999.99; // 999.99円/L
const MAX_FUEL_AMOUNT = 999.99; // 999.99L

export const createFuelRecord = (params: CreateFuelRecordParams): Result<FuelRecord, string> => {
	if (!params.id || params.id.trim() === '') {
		return Err(FuelRecordErrors.InvalidId);
	}

	if (!params.vehicleId || params.vehicleId.trim() === '') {
		return Err(FuelRecordErrors.InvalidVehicleId);
	}

	if (!params.date || !(params.date instanceof Date) || isNaN(params.date.getTime())) {
		return Err(FuelRecordErrors.InvalidDate);
	}

	if (params.date > new Date()) {
		return Err(FuelRecordErrors.FutureDateNotAllowed);
	}

	if (!params.gasStationName || params.gasStationName.trim() === '') {
		return Err(FuelRecordErrors.InvalidGasStationName);
	}

	if (params.gasStationName.length > MAX_GAS_STATION_NAME_LENGTH) {
		return Err(FuelRecordErrors.GasStationNameTooLong);
	}

	if (typeof params.odometer !== 'number' || isNaN(params.odometer)) {
		return Err(FuelRecordErrors.InvalidOdometer);
	}

	if (params.odometer < 0) {
		return Err(FuelRecordErrors.OdometerTooLow);
	}

	if (params.odometer > MAX_ODOMETER) {
		return Err(FuelRecordErrors.OdometerTooHigh);
	}

	if (typeof params.fuelPrice !== 'number' || isNaN(params.fuelPrice)) {
		return Err(FuelRecordErrors.InvalidFuelPrice);
	}

	if (params.fuelPrice <= 0) {
		return Err(FuelRecordErrors.FuelPriceTooLow);
	}

	if (params.fuelPrice > MAX_FUEL_PRICE) {
		return Err(FuelRecordErrors.FuelPriceTooHigh);
	}

	if (typeof params.fuelAmount !== 'number' || isNaN(params.fuelAmount)) {
		return Err(FuelRecordErrors.InvalidFuelAmount);
	}

	if (params.fuelAmount <= 0) {
		return Err(FuelRecordErrors.FuelAmountTooLow);
	}

	if (params.fuelAmount > MAX_FUEL_AMOUNT) {
		return Err(FuelRecordErrors.FuelAmountTooHigh);
	}

	const now = new Date();
	const roundedFuelPrice = Math.round(params.fuelPrice * 100) / 100;
	const roundedFuelAmount = Math.round(params.fuelAmount * 100) / 100;

	const fuelRecord: FuelRecord = {
		id: params.id.trim(),
		vehicleId: params.vehicleId.trim(),
		date: params.date,
		gasStationName: params.gasStationName.trim(),
		odometer: Math.floor(params.odometer),
		fuelPrice: roundedFuelPrice,
		fuelAmount: roundedFuelAmount,
		totalCost: Math.round(roundedFuelPrice * roundedFuelAmount),
		isFullTank: params.isFullTank,
		createdAt: params.createdAt || now,
		updatedAt: params.updatedAt || now
	};

	return Ok(fuelRecord);
};

export const updateFuelRecord = (
	fuelRecord: FuelRecord,
	params: UpdateFuelRecordParams
): Result<FuelRecord, string> => {
	const updates: Partial<Omit<FuelRecord, 'id' | 'vehicleId' | 'totalCost' | 'createdAt'>> = {};

	if (params.date !== undefined) {
		if (!(params.date instanceof Date) || isNaN(params.date.getTime())) {
			return Err(FuelRecordErrors.InvalidDate);
		}
		if (params.date > new Date()) {
			return Err(FuelRecordErrors.FutureDateNotAllowed);
		}
		updates.date = params.date;
	}

	if (params.gasStationName !== undefined) {
		if (params.gasStationName.trim() === '') {
			return Err(FuelRecordErrors.InvalidGasStationName);
		}
		if (params.gasStationName.length > MAX_GAS_STATION_NAME_LENGTH) {
			return Err(FuelRecordErrors.GasStationNameTooLong);
		}
		updates.gasStationName = params.gasStationName.trim();
	}

	if (params.odometer !== undefined) {
		if (typeof params.odometer !== 'number' || isNaN(params.odometer)) {
			return Err(FuelRecordErrors.InvalidOdometer);
		}
		if (params.odometer < 0) {
			return Err(FuelRecordErrors.OdometerTooLow);
		}
		if (params.odometer > MAX_ODOMETER) {
			return Err(FuelRecordErrors.OdometerTooHigh);
		}
		updates.odometer = Math.floor(params.odometer);
	}

	if (params.fuelPrice !== undefined) {
		if (typeof params.fuelPrice !== 'number' || isNaN(params.fuelPrice)) {
			return Err(FuelRecordErrors.InvalidFuelPrice);
		}
		if (params.fuelPrice <= 0) {
			return Err(FuelRecordErrors.FuelPriceTooLow);
		}
		if (params.fuelPrice > MAX_FUEL_PRICE) {
			return Err(FuelRecordErrors.FuelPriceTooHigh);
		}
		updates.fuelPrice = Math.round(params.fuelPrice * 100) / 100;
	}

	if (params.fuelAmount !== undefined) {
		if (typeof params.fuelAmount !== 'number' || isNaN(params.fuelAmount)) {
			return Err(FuelRecordErrors.InvalidFuelAmount);
		}
		if (params.fuelAmount <= 0) {
			return Err(FuelRecordErrors.FuelAmountTooLow);
		}
		if (params.fuelAmount > MAX_FUEL_AMOUNT) {
			return Err(FuelRecordErrors.FuelAmountTooHigh);
		}
		updates.fuelAmount = Math.round(params.fuelAmount * 100) / 100;
	}

	if (params.isFullTank !== undefined) {
		updates.isFullTank = params.isFullTank;
	}

	// Recalculate total cost if price or amount changed
	const fuelPrice = updates.fuelPrice ?? fuelRecord.fuelPrice;
	const fuelAmount = updates.fuelAmount ?? fuelRecord.fuelAmount;
	const totalCost = Math.round(fuelPrice * fuelAmount);

	const updatedFuelRecord: FuelRecord = {
		...fuelRecord,
		...updates,
		totalCost,
		updatedAt: new Date()
	};

	return Ok(updatedFuelRecord);
};

export const calculateFuelEconomy = (
	previousRecord: FuelRecord,
	currentRecord: FuelRecord
): Result<number, string> => {
	if (!currentRecord.isFullTank) {
		return Err('燃費計算には満タン給油記録が必要です');
	}

	const distance = currentRecord.odometer - previousRecord.odometer;
	if (distance <= 0) {
		return Err('走行距離が正しくありません');
	}

	const fuelEconomy = distance / currentRecord.fuelAmount;
	return Ok(Math.round(fuelEconomy * 100) / 100);
};
