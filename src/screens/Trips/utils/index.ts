import {TripData} from '../../../types';

export const formatDate = (date: Date | null) => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleDateString(undefined, options);
};

export const formatTime = (date: Date | null) => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return date.toLocaleTimeString(undefined, options);
};

export function sumOf(arr: number[]) {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array.");
  }

  return arr.reduce((total, num) => total + Number(num || 0), 0);
}
