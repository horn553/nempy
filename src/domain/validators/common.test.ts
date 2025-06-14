import { describe, it, expect } from 'vitest';
import {
  validateString,
  validateEmail,
  validateNumber,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateInteger,
  validateDate,
  validateId,
  validateCurrency,
  validateOdometer,
  validateFuelAmount,
  validateFuelPrice,
  ValidationErrors
} from './common';
import { isOk, isErr } from '../types/result';

describe('Common validators', () => {
  describe('validateString', () => {
    it('should validate valid strings', () => {
      const result = validateString('test');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('test');
      }
    });

    it('should trim whitespace', () => {
      const result = validateString('  test  ');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('test');
      }
    });

    it('should return empty string for null/undefined when not required', () => {
      const nullResult = validateString(null);
      const undefinedResult = validateString(undefined);
      
      expect(isOk(nullResult)).toBe(true);
      expect(isOk(undefinedResult)).toBe(true);
      if (isOk(nullResult)) expect(nullResult.value).toBe('');
      if (isOk(undefinedResult)) expect(undefinedResult.value).toBe('');
    });

    it('should fail when required but empty', () => {
      const emptyResult = validateString('', { required: true });
      const whitespaceResult = validateString('   ', { required: true });
      const nullResult = validateString(null, { required: true });
      
      expect(isErr(emptyResult)).toBe(true);
      expect(isErr(whitespaceResult)).toBe(true);
      expect(isErr(nullResult)).toBe(true);
    });

    it('should validate min/max length', () => {
      const tooShortResult = validateString('ab', { minLength: 3 });
      const tooLongResult = validateString('abcde', { maxLength: 3 });
      const validResult = validateString('abc', { minLength: 2, maxLength: 4 });
      
      expect(isErr(tooShortResult)).toBe(true);
      expect(isErr(tooLongResult)).toBe(true);
      expect(isOk(validResult)).toBe(true);
    });

    it('should use custom message', () => {
      const result = validateString('', { required: true, customMessage: 'カスタムエラー' });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('カスタムエラー');
      }
    });
  });

  describe('validateEmail', () => {
    it('should validate valid emails', () => {
      const result = validateEmail('test@example.com');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('test@example.com');
      }
    });

    it('should convert to lowercase', () => {
      const result = validateEmail('TEST@EXAMPLE.COM');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('test@example.com');
      }
    });

    it('should fail with invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@.com',
        'user@example',
        'user @example.com',
        'user@example .com',
      ];

      for (const email of invalidEmails) {
        const result = validateEmail(email);
        expect(isErr(result)).toBe(true);
        if (isErr(result)) {
          expect(result.error).toBe(ValidationErrors.InvalidEmail);
        }
      }
    });

    it('should return empty string for empty input when not required', () => {
      const result = validateEmail('');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('');
      }
    });
  });

  describe('validateNumber', () => {
    it('should validate valid numbers', () => {
      const intResult = validateNumber(123);
      const floatResult = validateNumber(123.45);
      const stringResult = validateNumber('123.45');
      
      expect(isOk(intResult)).toBe(true);
      expect(isOk(floatResult)).toBe(true);
      expect(isOk(stringResult)).toBe(true);
      
      if (isOk(intResult)) expect(intResult.value).toBe(123);
      if (isOk(floatResult)) expect(floatResult.value).toBe(123.45);
      if (isOk(stringResult)) expect(stringResult.value).toBe(123.45);
    });

    it('should fail with invalid numbers', () => {
      const nanResult = validateNumber('not a number');
      const nullResult = validateNumber(null);
      const undefinedResult = validateNumber(undefined);
      
      expect(isErr(nanResult)).toBe(true);
      expect(isErr(nullResult)).toBe(true);
      expect(isErr(undefinedResult)).toBe(true);
    });

    it('should validate min/max values', () => {
      const tooSmallResult = validateNumber(5, { min: 10 });
      const tooLargeResult = validateNumber(15, { max: 10 });
      const validResult = validateNumber(10, { min: 5, max: 15 });
      
      expect(isErr(tooSmallResult)).toBe(true);
      expect(isErr(tooLargeResult)).toBe(true);
      expect(isOk(validResult)).toBe(true);
    });
  });

  describe('validatePositiveNumber', () => {
    it('should accept positive numbers', () => {
      const result = validatePositiveNumber(5.5);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(5.5);
      }
    });

    it('should reject zero and negative numbers', () => {
      const zeroResult = validatePositiveNumber(0);
      const negativeResult = validatePositiveNumber(-5);
      
      expect(isErr(zeroResult)).toBe(true);
      expect(isErr(negativeResult)).toBe(true);
    });
  });

  describe('validateNonNegativeNumber', () => {
    it('should accept zero and positive numbers', () => {
      const zeroResult = validateNonNegativeNumber(0);
      const positiveResult = validateNonNegativeNumber(5.5);
      
      expect(isOk(zeroResult)).toBe(true);
      expect(isOk(positiveResult)).toBe(true);
    });

    it('should reject negative numbers', () => {
      const result = validateNonNegativeNumber(-5);
      expect(isErr(result)).toBe(true);
    });
  });

  describe('validateInteger', () => {
    it('should floor numbers to integers', () => {
      const result = validateInteger(5.7);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(5);
      }
    });

    it('should handle string numbers', () => {
      const result = validateInteger('5.7');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(5);
      }
    });
  });

  describe('validateDate', () => {
    it('should validate valid dates', () => {
      const dateResult = validateDate(new Date('2024-01-01'));
      const stringResult = validateDate('2024-01-01');
      
      expect(isOk(dateResult)).toBe(true);
      expect(isOk(stringResult)).toBe(true);
    });

    it('should fail with invalid dates', () => {
      const invalidResult = validateDate('invalid date');
      const nullResult = validateDate(null);
      
      expect(isErr(invalidResult)).toBe(true);
      expect(isErr(nullResult)).toBe(true);
    });

    it('should validate future/past restrictions', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const noFutureResult = validateDate(futureDate, { allowFuture: false });
      const noPastResult = validateDate(pastDate, { allowPast: false });
      
      expect(isErr(noFutureResult)).toBe(true);
      expect(isErr(noPastResult)).toBe(true);
    });
  });

  describe('validateId', () => {
    it('should validate valid IDs', () => {
      const result = validateId('valid-id-123');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe('valid-id-123');
      }
    });

    it('should fail with empty or invalid IDs', () => {
      const emptyResult = validateId('');
      const nullResult = validateId(null);
      const whitespaceResult = validateId('   ');
      
      expect(isErr(emptyResult)).toBe(true);
      expect(isErr(nullResult)).toBe(true);
      expect(isErr(whitespaceResult)).toBe(true);
    });
  });

  describe('validateCurrency', () => {
    it('should round to 2 decimal places', () => {
      const result = validateCurrency(123.456);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(123.46);
      }
    });

    it('should handle string input', () => {
      const result = validateCurrency('123.45');
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(123.45);
      }
    });

    it('should reject zero and negative values', () => {
      const zeroResult = validateCurrency(0);
      const negativeResult = validateCurrency(-5);
      
      expect(isErr(zeroResult)).toBe(true);
      expect(isErr(negativeResult)).toBe(true);
    });
  });

  describe('validateOdometer', () => {
    it('should floor to integer', () => {
      const result = validateOdometer(15000.7);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(15000);
      }
    });

    it('should accept zero', () => {
      const result = validateOdometer(0);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(0);
      }
    });

    it('should reject negative values', () => {
      const result = validateOdometer(-1);
      expect(isErr(result)).toBe(true);
    });

    it('should reject values exceeding maximum', () => {
      const result = validateOdometer(10000000);
      expect(isErr(result)).toBe(true);
    });
  });

  describe('validateFuelAmount', () => {
    it('should validate positive fuel amounts', () => {
      const result = validateFuelAmount(35.5);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(35.5);
      }
    });

    it('should round to 2 decimal places', () => {
      const result = validateFuelAmount(35.555);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(35.56);
      }
    });

    it('should reject zero and negative amounts', () => {
      const zeroResult = validateFuelAmount(0);
      const negativeResult = validateFuelAmount(-5);
      
      expect(isErr(zeroResult)).toBe(true);
      expect(isErr(negativeResult)).toBe(true);
    });

    it('should reject amounts exceeding maximum', () => {
      const result = validateFuelAmount(1000);
      expect(isErr(result)).toBe(true);
    });
  });

  describe('validateFuelPrice', () => {
    it('should validate positive fuel prices', () => {
      const result = validateFuelPrice(165.5);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(165.5);
      }
    });

    it('should round to 2 decimal places', () => {
      const result = validateFuelPrice(165.555);
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(165.56);
      }
    });

    it('should reject zero and negative prices', () => {
      const zeroResult = validateFuelPrice(0);
      const negativeResult = validateFuelPrice(-5);
      
      expect(isErr(zeroResult)).toBe(true);
      expect(isErr(negativeResult)).toBe(true);
    });

    it('should reject prices exceeding maximum', () => {
      const result = validateFuelPrice(1000);
      expect(isErr(result)).toBe(true);
    });
  });
});