import { describe, it, expect, beforeEach } from 'vitest';
import {
	createVehicle,
	updateVehicle,
	getVehicleDisplayName,
	getFuelTypeDisplayName,
	isValidFuelType,
	VehicleErrors,
	type Vehicle,
	type FuelType
} from './vehicle';
import { isOk, isErr } from '../types/result';

describe('Vehicle entity', () => {
	const validVehicleParams = {
		id: 'vehicle-123',
		ownerId: 'user-123',
		manufacturer: 'トヨタ',
		model: 'プリウス',
		fuelType: 'hybrid' as FuelType
	};

	describe('isValidFuelType', () => {
		it('should return true for valid fuel types', () => {
			expect(isValidFuelType('gasoline')).toBe(true);
			expect(isValidFuelType('diesel')).toBe(true);
			expect(isValidFuelType('hybrid')).toBe(true);
			expect(isValidFuelType('plugin_hybrid')).toBe(true);
			expect(isValidFuelType('electric')).toBe(true);
		});

		it('should return false for invalid fuel types', () => {
			expect(isValidFuelType('invalid')).toBe(false);
			expect(isValidFuelType('')).toBe(false);
			expect(isValidFuelType('gas')).toBe(false);
		});
	});

	describe('createVehicle', () => {
		it('should create a valid vehicle', () => {
			const result = createVehicle(validVehicleParams);

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.id).toBe('vehicle-123');
				expect(result.value.ownerId).toBe('user-123');
				expect(result.value.manufacturer).toBe('トヨタ');
				expect(result.value.model).toBe('プリウス');
				expect(result.value.fuelType).toBe('hybrid');
				expect(result.value.memo).toBe('');
				expect(result.value.createdAt).toBeInstanceOf(Date);
				expect(result.value.updatedAt).toBeInstanceOf(Date);
			}
		});

		it('should create vehicle with memo', () => {
			const result = createVehicle({
				...validVehicleParams,
				memo: '2020年式、走行距離3万km'
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.memo).toBe('2020年式、走行距離3万km');
			}
		});

		it('should trim whitespace from string fields', () => {
			const result = createVehicle({
				...validVehicleParams,
				id: '  vehicle-123  ',
				manufacturer: '  トヨタ  ',
				model: '  プリウス  ',
				memo: '  メモ  '
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.id).toBe('vehicle-123');
				expect(result.value.manufacturer).toBe('トヨタ');
				expect(result.value.model).toBe('プリウス');
				expect(result.value.memo).toBe('メモ');
			}
		});

		it('should use provided timestamps', () => {
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const result = createVehicle({
				...validVehicleParams,
				createdAt,
				updatedAt
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.createdAt).toBe(createdAt);
				expect(result.value.updatedAt).toBe(updatedAt);
			}
		});

		it('should fail with empty id', () => {
			const result = createVehicle({ ...validVehicleParams, id: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidId);
			}
		});

		it('should fail with empty ownerId', () => {
			const result = createVehicle({ ...validVehicleParams, ownerId: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidOwnerId);
			}
		});

		it('should fail with empty manufacturer', () => {
			const result = createVehicle({ ...validVehicleParams, manufacturer: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidManufacturer);
			}
		});

		it('should fail with manufacturer exceeding max length', () => {
			const longManufacturer = 'あ'.repeat(51);
			const result = createVehicle({ ...validVehicleParams, manufacturer: longManufacturer });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.ManufacturerTooLong);
			}
		});

		it('should fail with empty model', () => {
			const result = createVehicle({ ...validVehicleParams, model: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidModel);
			}
		});

		it('should fail with model exceeding max length', () => {
			const longModel = 'あ'.repeat(101);
			const result = createVehicle({ ...validVehicleParams, model: longModel });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.ModelTooLong);
			}
		});

		it('should fail with invalid fuel type', () => {
			const result = createVehicle({
				...validVehicleParams,
				fuelType: 'invalid' as FuelType
			});
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidFuelType);
			}
		});

		it('should fail with memo exceeding max length', () => {
			const longMemo = 'あ'.repeat(501);
			const result = createVehicle({ ...validVehicleParams, memo: longMemo });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.MemoTooLong);
			}
		});
	});

	describe('updateVehicle', () => {
		let vehicle: Vehicle;

		beforeEach(() => {
			const result = createVehicle(validVehicleParams);
			if (isOk(result)) {
				vehicle = result.value;
			}
		});

		it('should update manufacturer', async () => {
			await new Promise((resolve) => setTimeout(resolve, 1));
			const result = updateVehicle(vehicle, { manufacturer: 'ホンダ' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.manufacturer).toBe('ホンダ');
				expect(result.value.model).toBe(vehicle.model);
				expect(result.value.updatedAt.getTime()).toBeGreaterThan(vehicle.updatedAt.getTime());
			}
		});

		it('should update model', () => {
			const result = updateVehicle(vehicle, { model: 'アクア' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.manufacturer).toBe(vehicle.manufacturer);
				expect(result.value.model).toBe('アクア');
			}
		});

		it('should update fuel type', () => {
			const result = updateVehicle(vehicle, { fuelType: 'gasoline' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.fuelType).toBe('gasoline');
			}
		});

		it('should update memo', () => {
			const result = updateVehicle(vehicle, { memo: '新しいメモ' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.memo).toBe('新しいメモ');
			}
		});

		it('should update multiple fields', () => {
			const result = updateVehicle(vehicle, {
				manufacturer: 'ホンダ',
				model: 'フィット',
				fuelType: 'gasoline',
				memo: '更新済み'
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.manufacturer).toBe('ホンダ');
				expect(result.value.model).toBe('フィット');
				expect(result.value.fuelType).toBe('gasoline');
				expect(result.value.memo).toBe('更新済み');
			}
		});

		it('should trim updated values', () => {
			const result = updateVehicle(vehicle, {
				manufacturer: '  ホンダ  ',
				model: '  フィット  ',
				memo: '  メモ  '
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.manufacturer).toBe('ホンダ');
				expect(result.value.model).toBe('フィット');
				expect(result.value.memo).toBe('メモ');
			}
		});

		it('should allow empty memo', () => {
			const vehicleWithMemo = { ...vehicle, memo: '既存のメモ' };
			const result = updateVehicle(vehicleWithMemo, { memo: '' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.memo).toBe('');
			}
		});

		it('should not change values when no updates provided', async () => {
			await new Promise((resolve) => setTimeout(resolve, 1));
			const result = updateVehicle(vehicle, {});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.manufacturer).toBe(vehicle.manufacturer);
				expect(result.value.model).toBe(vehicle.model);
				expect(result.value.fuelType).toBe(vehicle.fuelType);
				expect(result.value.memo).toBe(vehicle.memo);
				expect(result.value.updatedAt.getTime()).toBeGreaterThan(vehicle.updatedAt.getTime());
			}
		});

		it('should fail with empty manufacturer', () => {
			const result = updateVehicle(vehicle, { manufacturer: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidManufacturer);
			}
		});

		it('should fail with manufacturer exceeding max length', () => {
			const longManufacturer = 'あ'.repeat(51);
			const result = updateVehicle(vehicle, { manufacturer: longManufacturer });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.ManufacturerTooLong);
			}
		});

		it('should fail with empty model', () => {
			const result = updateVehicle(vehicle, { model: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidModel);
			}
		});

		it('should fail with invalid fuel type', () => {
			const result = updateVehicle(vehicle, { fuelType: 'invalid' as FuelType });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(VehicleErrors.InvalidFuelType);
			}
		});
	});

	describe('getVehicleDisplayName', () => {
		it('should return manufacturer and model', () => {
			const result = createVehicle(validVehicleParams);
			if (isOk(result)) {
				expect(getVehicleDisplayName(result.value)).toBe('トヨタ プリウス');
			}
		});
	});

	describe('getFuelTypeDisplayName', () => {
		it('should return Japanese names for fuel types', () => {
			expect(getFuelTypeDisplayName('gasoline')).toBe('ガソリン');
			expect(getFuelTypeDisplayName('diesel')).toBe('軽油');
			expect(getFuelTypeDisplayName('hybrid')).toBe('ハイブリッド');
			expect(getFuelTypeDisplayName('plugin_hybrid')).toBe('プラグインハイブリッド');
			expect(getFuelTypeDisplayName('electric')).toBe('電気');
		});
	});
});
