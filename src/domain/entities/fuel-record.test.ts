import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	createFuelRecord,
	updateFuelRecord,
	calculateFuelEconomy,
	FuelRecordErrors,
	type FuelRecord
} from './fuel-record';
import { isOk, isErr } from '../types/result';

describe('FuelRecord entity', () => {
	const validFuelRecordParams = {
		id: 'fuel-123',
		vehicleId: 'vehicle-123',
		date: new Date('2024-01-15 10:30:00'),
		gasStationName: 'エネオス東京店',
		odometer: 15000,
		fuelPrice: 165.5,
		fuelAmount: 35.8,
		isFullTank: true
	};

	describe('createFuelRecord', () => {
		it('should create a valid fuel record', () => {
			const result = createFuelRecord(validFuelRecordParams);

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.id).toBe('fuel-123');
				expect(result.value.vehicleId).toBe('vehicle-123');
				expect(result.value.date).toEqual(new Date('2024-01-15 10:30:00'));
				expect(result.value.gasStationName).toBe('エネオス東京店');
				expect(result.value.odometer).toBe(15000);
				expect(result.value.fuelPrice).toBe(165.5);
				expect(result.value.fuelAmount).toBe(35.8);
				expect(result.value.totalCost).toBe(5925);
				expect(result.value.isFullTank).toBe(true);
				expect(result.value.createdAt).toBeInstanceOf(Date);
				expect(result.value.updatedAt).toBeInstanceOf(Date);
			}
		});

		it('should round numbers appropriately', () => {
			const result = createFuelRecord({
				...validFuelRecordParams,
				odometer: 15000.7,
				fuelPrice: 165.555,
				fuelAmount: 35.844
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.odometer).toBe(15000); // Floored
				expect(result.value.fuelPrice).toBe(165.56); // Rounded to 2 decimals
				expect(result.value.fuelAmount).toBe(35.84); // Rounded to 2 decimals
				expect(result.value.totalCost).toBe(5934); // 165.56 * 35.84 = 5934
			}
		});

		it('should trim whitespace from string fields', () => {
			const result = createFuelRecord({
				...validFuelRecordParams,
				id: '  fuel-123  ',
				vehicleId: '  vehicle-123  ',
				gasStationName: '  エネオス東京店  '
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.id).toBe('fuel-123');
				expect(result.value.vehicleId).toBe('vehicle-123');
				expect(result.value.gasStationName).toBe('エネオス東京店');
			}
		});

		it('should use provided timestamps', () => {
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const result = createFuelRecord({
				...validFuelRecordParams,
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
			const result = createFuelRecord({ ...validFuelRecordParams, id: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.InvalidId);
			}
		});

		it('should fail with empty vehicleId', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, vehicleId: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.InvalidVehicleId);
			}
		});

		it('should fail with invalid date', () => {
			const result = createFuelRecord({
				...validFuelRecordParams,
				date: new Date('invalid')
			});
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.InvalidDate);
			}
		});

		it('should fail with future date', () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 1);

			const result = createFuelRecord({
				...validFuelRecordParams,
				date: futureDate
			});
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.FutureDateNotAllowed);
			}
		});

		it('should fail with empty gas station name', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, gasStationName: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.InvalidGasStationName);
			}
		});

		it('should fail with gas station name exceeding max length', () => {
			const longName = 'あ'.repeat(101);
			const result = createFuelRecord({ ...validFuelRecordParams, gasStationName: longName });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.GasStationNameTooLong);
			}
		});

		it('should fail with negative odometer', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, odometer: -1 });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.OdometerTooLow);
			}
		});

		it('should fail with odometer exceeding max', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, odometer: 10000000 });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.OdometerTooHigh);
			}
		});

		it('should fail with zero or negative fuel price', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, fuelPrice: 0 });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.FuelPriceTooLow);
			}
		});

		it('should fail with fuel price exceeding max', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, fuelPrice: 1000 });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.FuelPriceTooHigh);
			}
		});

		it('should fail with zero or negative fuel amount', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, fuelAmount: 0 });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.FuelAmountTooLow);
			}
		});

		it('should fail with fuel amount exceeding max', () => {
			const result = createFuelRecord({ ...validFuelRecordParams, fuelAmount: 1000 });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.FuelAmountTooHigh);
			}
		});

		it('should fail with NaN values', () => {
			const nanOdometer = createFuelRecord({ ...validFuelRecordParams, odometer: NaN });
			expect(isErr(nanOdometer)).toBe(true);

			const nanPrice = createFuelRecord({ ...validFuelRecordParams, fuelPrice: NaN });
			expect(isErr(nanPrice)).toBe(true);

			const nanAmount = createFuelRecord({ ...validFuelRecordParams, fuelAmount: NaN });
			expect(isErr(nanAmount)).toBe(true);
		});
	});

	describe('updateFuelRecord', () => {
		let fuelRecord: FuelRecord;

		beforeEach(() => {
			const result = createFuelRecord(validFuelRecordParams);
			if (isOk(result)) {
				fuelRecord = result.value;
			}
		});

		it('should update date', async () => {
			await new Promise((resolve) => setTimeout(resolve, 1));
			const newDate = new Date('2024-01-20 15:00:00');
			const result = updateFuelRecord(fuelRecord, { date: newDate });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.date).toEqual(newDate);
				expect(result.value.updatedAt.getTime()).toBeGreaterThan(fuelRecord.updatedAt.getTime());
			}
		});

		it('should update gas station name', () => {
			const result = updateFuelRecord(fuelRecord, { gasStationName: 'シェル大阪店' });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.gasStationName).toBe('シェル大阪店');
			}
		});

		it('should update odometer', () => {
			const result = updateFuelRecord(fuelRecord, { odometer: 16000 });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.odometer).toBe(16000);
			}
		});

		it('should update fuel price and recalculate total', () => {
			const result = updateFuelRecord(fuelRecord, { fuelPrice: 170 });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.fuelPrice).toBe(170);
				expect(result.value.totalCost).toBe(6086); // 170 * 35.8
			}
		});

		it('should update fuel amount and recalculate total', () => {
			const result = updateFuelRecord(fuelRecord, { fuelAmount: 40 });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.fuelAmount).toBe(40);
				expect(result.value.totalCost).toBe(6620); // 165.5 * 40
			}
		});

		it('should update both price and amount and recalculate total', () => {
			const result = updateFuelRecord(fuelRecord, {
				fuelPrice: 170,
				fuelAmount: 40
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.fuelPrice).toBe(170);
				expect(result.value.fuelAmount).toBe(40);
				expect(result.value.totalCost).toBe(6800); // 170 * 40
			}
		});

		it('should update isFullTank', () => {
			const result = updateFuelRecord(fuelRecord, { isFullTank: false });

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.isFullTank).toBe(false);
			}
		});

		it('should update multiple fields', () => {
			const newDate = new Date('2024-01-20');
			const result = updateFuelRecord(fuelRecord, {
				date: newDate,
				gasStationName: 'シェル大阪店',
				odometer: 16000,
				fuelPrice: 170,
				fuelAmount: 40,
				isFullTank: false
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.date).toEqual(newDate);
				expect(result.value.gasStationName).toBe('シェル大阪店');
				expect(result.value.odometer).toBe(16000);
				expect(result.value.fuelPrice).toBe(170);
				expect(result.value.fuelAmount).toBe(40);
				expect(result.value.totalCost).toBe(6800);
				expect(result.value.isFullTank).toBe(false);
			}
		});

		it('should round updated numbers', () => {
			const result = updateFuelRecord(fuelRecord, {
				odometer: 16000.7,
				fuelPrice: 170.555,
				fuelAmount: 40.844
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.odometer).toBe(16000);
				expect(result.value.fuelPrice).toBe(170.56);
				expect(result.value.fuelAmount).toBe(40.84);
			}
		});

		it('should trim updated gas station name', () => {
			const result = updateFuelRecord(fuelRecord, {
				gasStationName: '  シェル大阪店  '
			});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.gasStationName).toBe('シェル大阪店');
			}
		});

		it('should not change values when no updates provided', async () => {
			await new Promise((resolve) => setTimeout(resolve, 1));
			const result = updateFuelRecord(fuelRecord, {});

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value.date).toEqual(fuelRecord.date);
				expect(result.value.gasStationName).toBe(fuelRecord.gasStationName);
				expect(result.value.odometer).toBe(fuelRecord.odometer);
				expect(result.value.fuelPrice).toBe(fuelRecord.fuelPrice);
				expect(result.value.fuelAmount).toBe(fuelRecord.fuelAmount);
				expect(result.value.totalCost).toBe(fuelRecord.totalCost);
				expect(result.value.isFullTank).toBe(fuelRecord.isFullTank);
				expect(result.value.updatedAt.getTime()).toBeGreaterThan(fuelRecord.updatedAt.getTime());
			}
		});

		it('should fail with invalid date', () => {
			const result = updateFuelRecord(fuelRecord, { date: new Date('invalid') });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.InvalidDate);
			}
		});

		it('should fail with future date', () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 1);

			const result = updateFuelRecord(fuelRecord, { date: futureDate });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.FutureDateNotAllowed);
			}
		});

		it('should fail with empty gas station name', () => {
			const result = updateFuelRecord(fuelRecord, { gasStationName: '' });
			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe(FuelRecordErrors.InvalidGasStationName);
			}
		});

		it('should fail with invalid numeric values', () => {
			const negativeOdometer = updateFuelRecord(fuelRecord, { odometer: -1 });
			expect(isErr(negativeOdometer)).toBe(true);

			const zeroPriceResult = updateFuelRecord(fuelRecord, { fuelPrice: 0 });
			expect(isErr(zeroPriceResult)).toBe(true);

			const zeroAmountResult = updateFuelRecord(fuelRecord, { fuelAmount: 0 });
			expect(isErr(zeroAmountResult)).toBe(true);
		});
	});

	describe('calculateFuelEconomy', () => {
		it('should calculate fuel economy correctly', () => {
			const previousRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 14600
			} as FuelRecord;

			const currentRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 15000,
				fuelAmount: 35.8,
				isFullTank: true
			} as FuelRecord;

			const result = calculateFuelEconomy(previousRecord, currentRecord);

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value).toBe(11.17); // (15000 - 14600) / 35.8 = 11.173... → 11.17
			}
		});

		it('should fail if current record is not full tank', () => {
			const previousRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 14600
			} as FuelRecord;

			const currentRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 15000,
				isFullTank: false
			} as FuelRecord;

			const result = calculateFuelEconomy(previousRecord, currentRecord);

			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe('燃費計算には満タン給油記録が必要です');
			}
		});

		it('should fail if distance is zero or negative', () => {
			const previousRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 15000
			} as FuelRecord;

			const currentRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 15000,
				isFullTank: true
			} as FuelRecord;

			const result = calculateFuelEconomy(previousRecord, currentRecord);

			expect(isErr(result)).toBe(true);
			if (isErr(result)) {
				expect(result.error).toBe('走行距離が正しくありません');
			}
		});

		it('should handle decimal results correctly', () => {
			const previousRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 14500
			} as FuelRecord;

			const currentRecord: FuelRecord = {
				...validFuelRecordParams,
				odometer: 15000,
				fuelAmount: 33.33,
				isFullTank: true
			} as FuelRecord;

			const result = calculateFuelEconomy(previousRecord, currentRecord);

			expect(isOk(result)).toBe(true);
			if (isOk(result)) {
				expect(result.value).toBe(15); // 500 / 33.33 = 15.001... → 15.00
			}
		});
	});
});
