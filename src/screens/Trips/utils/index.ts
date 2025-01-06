import {TripsState} from '../../../types';

/**
 * Default date format options
 */
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

/**
 * Default time format options
 */
const DEFAULT_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

/**
 * Formats a Date object into a localized date string (MM/DD/YYYY).
 *
 * @param {Date | null} date - The date to format
 * @param {Intl.DateTimeFormatOptions} [options=DEFAULT_DATE_OPTIONS] - Optional formatting options
 * @returns {string} Formatted date string or empty string if date is null
 *
 * @example
 * formatDate(new Date('2024-01-03')) // Returns "01/03/2024"
 * formatDate(null) // Returns ""
 */
export const formatDate = (
  date: Date | null,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
): string => {
  if (!date) return '';
  return date.toLocaleDateString(undefined, options);
};

/**
 * Formats a Date object into a localized time string (HH:MM:SS).
 *
 * @param {Date | null} date - The date to format
 * @param {Intl.DateTimeFormatOptions} [options=DEFAULT_TIME_OPTIONS] - Optional formatting options
 * @returns {string} Formatted time string or empty string if date is null
 *
 * @example
 * formatTime(new Date('2024-01-03T15:30:00')) // Returns "15:30:00"
 * formatTime(null) // Returns ""
 */
export const formatTime = (
  date: Date | null,
  options: Intl.DateTimeFormatOptions = DEFAULT_TIME_OPTIONS,
): string => {
  if (!date) return '';
  return date.toLocaleTimeString(undefined, options);
};

/**
 * Calculates the sum of numbers in an array, handling null/undefined values as 0.
 *
 * @param {number[]} arr - Array of numbers to sum
 * @returns {number} Sum of all numbers in the array
 * @throws {Error} If input is not an array
 *
 * @example
 * sumOf([1, 2, 3]) // Returns 6
 * sumOf([1, null, 3]) // Returns 4
 * sumOf([]) // Returns 0
 */
export const sumOf = (arr: number[]): number => {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array.');
  }

  return arr.reduce(
    (total: number, num: number) => total + Number(num || 0),
    0,
  );
};

export const calculateDistance = (speed: number) => {
  return speed * (1 / 3600);
};

export const calculateEfficiency = (id: 1 | 2 | 3, td: TripsState): string => {
  const tripData = td[id];

  const totalFuelBurned = tripData.fuelBurned.reduce((a, b) => a + b, 0);
  const result = totalFuelBurned / tripData.totalDistance;

  if (!Number.isNaN(result) && result !== Infinity) {
    return result.toFixed(2);
  }

  return '0.00';
};
