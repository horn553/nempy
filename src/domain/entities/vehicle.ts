import type { Result } from '../types/result';
import { Ok, Err } from '../types/result';

export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'plugin_hybrid' | 'electric';

export interface Vehicle {
	readonly id: string;
	readonly ownerId: string;
	readonly manufacturer: string;
	readonly model: string;
	readonly fuelType: FuelType;
	readonly memo: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface CreateVehicleParams {
	id: string;
	ownerId: string;
	manufacturer: string;
	model: string;
	fuelType: FuelType;
	memo?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UpdateVehicleParams {
	manufacturer?: string;
	model?: string;
	fuelType?: FuelType;
	memo?: string;
}

export const VehicleErrors = {
	InvalidId: '車両IDが無効です',
	InvalidOwnerId: '所有者IDが無効です',
	InvalidManufacturer: 'メーカー名が無効です',
	InvalidModel: '車種が無効です',
	InvalidFuelType: '燃料タイプが無効です',
	ManufacturerTooLong: 'メーカー名は50文字以内で入力してください',
	ModelTooLong: '車種は100文字以内で入力してください',
	MemoTooLong: 'メモは500文字以内で入力してください'
} as const;

const MAX_MANUFACTURER_LENGTH = 50;
const MAX_MODEL_LENGTH = 100;
const MAX_MEMO_LENGTH = 500;

const VALID_FUEL_TYPES: readonly FuelType[] = [
	'gasoline',
	'diesel',
	'hybrid',
	'plugin_hybrid',
	'electric'
] as const;

export const isValidFuelType = (value: string): value is FuelType => {
	return VALID_FUEL_TYPES.includes(value as FuelType);
};

export const createVehicle = (params: CreateVehicleParams): Result<Vehicle, string> => {
	if (!params.id || params.id.trim() === '') {
		return Err(VehicleErrors.InvalidId);
	}

	if (!params.ownerId || params.ownerId.trim() === '') {
		return Err(VehicleErrors.InvalidOwnerId);
	}

	if (!params.manufacturer || params.manufacturer.trim() === '') {
		return Err(VehicleErrors.InvalidManufacturer);
	}

	if (params.manufacturer.length > MAX_MANUFACTURER_LENGTH) {
		return Err(VehicleErrors.ManufacturerTooLong);
	}

	if (!params.model || params.model.trim() === '') {
		return Err(VehicleErrors.InvalidModel);
	}

	if (params.model.length > MAX_MODEL_LENGTH) {
		return Err(VehicleErrors.ModelTooLong);
	}

	if (!isValidFuelType(params.fuelType)) {
		return Err(VehicleErrors.InvalidFuelType);
	}

	const memo = params.memo || '';
	if (memo.length > MAX_MEMO_LENGTH) {
		return Err(VehicleErrors.MemoTooLong);
	}

	const now = new Date();
	const vehicle: Vehicle = {
		id: params.id.trim(),
		ownerId: params.ownerId.trim(),
		manufacturer: params.manufacturer.trim(),
		model: params.model.trim(),
		fuelType: params.fuelType,
		memo: memo.trim(),
		createdAt: params.createdAt || now,
		updatedAt: params.updatedAt || now
	};

	return Ok(vehicle);
};

export const updateVehicle = (
	vehicle: Vehicle,
	params: UpdateVehicleParams
): Result<Vehicle, string> => {
	const updates: Partial<Omit<Vehicle, 'id' | 'ownerId' | 'createdAt'>> = {};

	if (params.manufacturer !== undefined) {
		if (params.manufacturer.trim() === '') {
			return Err(VehicleErrors.InvalidManufacturer);
		}
		if (params.manufacturer.length > MAX_MANUFACTURER_LENGTH) {
			return Err(VehicleErrors.ManufacturerTooLong);
		}
		updates.manufacturer = params.manufacturer.trim();
	}

	if (params.model !== undefined) {
		if (params.model.trim() === '') {
			return Err(VehicleErrors.InvalidModel);
		}
		if (params.model.length > MAX_MODEL_LENGTH) {
			return Err(VehicleErrors.ModelTooLong);
		}
		updates.model = params.model.trim();
	}

	if (params.fuelType !== undefined) {
		if (!isValidFuelType(params.fuelType)) {
			return Err(VehicleErrors.InvalidFuelType);
		}
		updates.fuelType = params.fuelType;
	}

	if (params.memo !== undefined) {
		if (params.memo.length > MAX_MEMO_LENGTH) {
			return Err(VehicleErrors.MemoTooLong);
		}
		updates.memo = params.memo.trim();
	}

	const updatedVehicle: Vehicle = {
		...vehicle,
		...updates,
		updatedAt: new Date()
	};

	return Ok(updatedVehicle);
};

export const getVehicleDisplayName = (vehicle: Vehicle): string => {
	return `${vehicle.manufacturer} ${vehicle.model}`;
};

export const getFuelTypeDisplayName = (fuelType: FuelType): string => {
	const displayNames: Record<FuelType, string> = {
		gasoline: 'ガソリン',
		diesel: '軽油',
		hybrid: 'ハイブリッド',
		plugin_hybrid: 'プラグインハイブリッド',
		electric: '電気'
	};

	return displayNames[fuelType];
};
