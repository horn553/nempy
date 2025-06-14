import { describe, it, expect } from 'vitest';
import {
	Ok,
	Err,
	isOk,
	isErr,
	map,
	mapErr,
	flatMap,
	unwrap,
	unwrapOr,
	unwrapOrElse
} from './result';

describe('Result type', () => {
	describe('Ok and Err constructors', () => {
		it('should create Ok result', () => {
			const result = Ok(42);
			expect(result).toEqual({ ok: true, value: 42 });
		});

		it('should create Err result', () => {
			const error = new Error('Something went wrong');
			const result = Err(error);
			expect(result).toEqual({ ok: false, error });
		});
	});

	describe('Type guards', () => {
		it('isOk should return true for Ok result', () => {
			const result = Ok(42);
			expect(isOk(result)).toBe(true);
		});

		it('isOk should return false for Err result', () => {
			const result = Err(new Error('Error'));
			expect(isOk(result)).toBe(false);
		});

		it('isErr should return true for Err result', () => {
			const result = Err(new Error('Error'));
			expect(isErr(result)).toBe(true);
		});

		it('isErr should return false for Ok result', () => {
			const result = Ok(42);
			expect(isErr(result)).toBe(false);
		});
	});

	describe('map function', () => {
		it('should map Ok value', () => {
			const result = Ok(42);
			const mapped = map(result, (x) => x * 2);
			expect(mapped).toEqual({ ok: true, value: 84 });
		});

		it('should not map Err value', () => {
			const error = new Error('Error');
			const result = Err(error);
			const mapped = map(result, (x) => x * 2);
			expect(mapped).toEqual({ ok: false, error });
		});
	});

	describe('mapErr function', () => {
		it('should not map Ok value', () => {
			const result = Ok(42);
			const mapped = mapErr(result, () => new Error('Modified'));
			expect(mapped).toEqual({ ok: true, value: 42 });
		});

		it('should map Err value', () => {
			const result = Err('Original error');
			const mapped = mapErr(result, (err) => `Modified: ${err}`);
			expect(mapped).toEqual({ ok: false, error: 'Modified: Original error' });
		});
	});

	describe('flatMap function', () => {
		it('should flatMap Ok value to Ok', () => {
			const result = Ok(42);
			const flatMapped = flatMap(result, (x) => Ok(x * 2));
			expect(flatMapped).toEqual({ ok: true, value: 84 });
		});

		it('should flatMap Ok value to Err', () => {
			const result = Ok(42);
			const error = new Error('Error in flatMap');
			const flatMapped = flatMap(result, () => Err(error));
			expect(flatMapped).toEqual({ ok: false, error });
		});

		it('should not flatMap Err value', () => {
			const error = new Error('Original error');
			const result = Err(error);
			const flatMapped = flatMap(result, () => Ok(42));
			expect(flatMapped).toEqual({ ok: false, error });
		});
	});

	describe('unwrap functions', () => {
		it('unwrap should return value for Ok', () => {
			const result = Ok(42);
			expect(unwrap(result)).toBe(42);
		});

		it('unwrap should throw for Err', () => {
			const result = Err(new Error('Error'));
			expect(() => unwrap(result)).toThrow('Called unwrap on an Err value');
		});

		it('unwrapOr should return value for Ok', () => {
			const result = Ok(42);
			expect(unwrapOr(result, 0)).toBe(42);
		});

		it('unwrapOr should return default for Err', () => {
			const result = Err(new Error('Error'));
			expect(unwrapOr(result, 0)).toBe(0);
		});

		it('unwrapOrElse should return value for Ok', () => {
			const result = Ok(42);
			expect(unwrapOrElse(result, () => 0)).toBe(42);
		});

		it('unwrapOrElse should call function for Err', () => {
			const result = Err('Error message');
			expect(unwrapOrElse(result, (err) => err.length)).toBe(13);
		});
	});
});
