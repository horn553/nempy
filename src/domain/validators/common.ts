import { Result, Ok, Err } from '../types/result';

export const ValidationErrors = {
  Required: '必須項目です',
  TooLong: '文字数が上限を超えています',
  TooShort: '文字数が不足しています',
  InvalidFormat: '形式が正しくありません',
  InvalidEmail: '有効なメールアドレスを入力してください',
  InvalidNumber: '有効な数値を入力してください',
  NumberTooSmall: '値が小さすぎます',
  NumberTooLarge: '値が大きすぎます',
  InvalidDate: '有効な日付を入力してください',
  FutureDateNotAllowed: '未来の日付は指定できません',
  PastDateNotAllowed: '過去の日付は指定できません',
} as const;

export interface ValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  allowEmpty?: boolean;
  customMessage?: string;
}

export const validateString = (
  value: string | undefined | null,
  options: ValidationOptions = {}
): Result<string, string> => {
  const {
    required = false,
    minLength = 0,
    maxLength = Number.MAX_SAFE_INTEGER,
    allowEmpty = true,
    customMessage
  } = options;

  if (required && (value === undefined || value === null || value.trim() === '')) {
    return Err(customMessage || ValidationErrors.Required);
  }

  if (value === undefined || value === null) {
    return Ok('');
  }

  const trimmedValue = value.trim();

  if (!allowEmpty && trimmedValue === '') {
    return Err(customMessage || ValidationErrors.Required);
  }

  if (trimmedValue.length < minLength) {
    return Err(customMessage || ValidationErrors.TooShort);
  }

  if (trimmedValue.length > maxLength) {
    return Err(customMessage || ValidationErrors.TooLong);
  }

  return Ok(trimmedValue);
};

export const validateEmail = (
  value: string | undefined | null,
  options: ValidationOptions = {}
): Result<string, string> => {
  const stringResult = validateString(value, options);
  if (!stringResult.ok) {
    return stringResult;
  }

  const email = stringResult.value;
  if (email === '') {
    return Ok(email);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Err(options.customMessage || ValidationErrors.InvalidEmail);
  }

  return Ok(email.toLowerCase());
};

export const validateNumber = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  const {
    required = false,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    customMessage
  } = options;

  if (required && (value === undefined || value === null)) {
    return Err(customMessage || ValidationErrors.Required);
  }

  if (value === undefined || value === null) {
    return Err(customMessage || ValidationErrors.InvalidNumber);
  }

  let numValue: number;
  if (typeof value === 'string') {
    numValue = parseFloat(value);
  } else {
    numValue = value;
  }

  if (isNaN(numValue)) {
    return Err(customMessage || ValidationErrors.InvalidNumber);
  }

  if (numValue < min) {
    return Err(customMessage || ValidationErrors.NumberTooSmall);
  }

  if (numValue > max) {
    return Err(customMessage || ValidationErrors.NumberTooLarge);
  }

  return Ok(numValue);
};

export const validatePositiveNumber = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  return validateNumber(value, {
    ...options,
    min: 0.01,
    customMessage: options.customMessage || '0より大きい値を入力してください'
  });
};

export const validateNonNegativeNumber = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  return validateNumber(value, {
    ...options,
    min: 0,
    customMessage: options.customMessage || '0以上の値を入力してください'
  });
};

export const validateInteger = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  const numberResult = validateNumber(value, options);
  if (!numberResult.ok) {
    return numberResult;
  }

  const intValue = Math.floor(numberResult.value);
  return Ok(intValue);
};

export const validateDate = (
  value: Date | string | undefined | null,
  options: {
    required?: boolean;
    allowFuture?: boolean;
    allowPast?: boolean;
    customMessage?: string;
  } = {}
): Result<Date, string> => {
  const {
    required = false,
    allowFuture = true,
    allowPast = true,
    customMessage
  } = options;

  if (required && (value === undefined || value === null)) {
    return Err(customMessage || ValidationErrors.Required);
  }

  if (value === undefined || value === null) {
    return Err(customMessage || ValidationErrors.InvalidDate);
  }

  let dateValue: Date;
  if (typeof value === 'string') {
    dateValue = new Date(value);
  } else {
    dateValue = value;
  }

  if (isNaN(dateValue.getTime())) {
    return Err(customMessage || ValidationErrors.InvalidDate);
  }

  const now = new Date();
  if (!allowFuture && dateValue > now) {
    return Err(customMessage || ValidationErrors.FutureDateNotAllowed);
  }

  if (!allowPast && dateValue < now) {
    return Err(customMessage || ValidationErrors.PastDateNotAllowed);
  }

  return Ok(dateValue);
};

export const validateId = (
  value: string | undefined | null,
  options: { customMessage?: string } = {}
): Result<string, string> => {
  return validateString(value, {
    required: true,
    minLength: 1,
    allowEmpty: false,
    customMessage: options.customMessage || 'IDが無効です'
  });
};

export const validateCurrency = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  const numberResult = validatePositiveNumber(value, options);
  if (!numberResult.ok) {
    return numberResult;
  }

  // Round to 2 decimal places for currency
  const rounded = Math.round(numberResult.value * 100) / 100;
  return Ok(rounded);
};

export const validateOdometer = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  const numberResult = validateNonNegativeNumber(value, {
    ...options,
    max: 9999999, // 9,999,999 km
    customMessage: options.customMessage || '走行距離が無効です'
  });
  if (!numberResult.ok) {
    return numberResult;
  }

  // Floor for odometer (no decimal places)
  const floored = Math.floor(numberResult.value);
  return Ok(floored);
};

export const validateFuelAmount = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  return validateCurrency(value, {
    ...options,
    max: 999.99,
    customMessage: options.customMessage || '給油量が無効です'
  });
};

export const validateFuelPrice = (
  value: number | string | undefined | null,
  options: ValidationOptions = {}
): Result<number, string> => {
  return validateCurrency(value, {
    ...options,
    max: 999.99,
    customMessage: options.customMessage || '燃料単価が無効です'
  });
};