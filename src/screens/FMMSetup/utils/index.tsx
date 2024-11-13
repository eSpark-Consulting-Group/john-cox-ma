// conversions.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import {DistanceUnit, TimeFormat, VolumeUnit} from '../../../types';

type volumeUnitsType = 'ltr' | 'gal';
type distanceUnitsType = 'S.Mile' | 'N.Mile' | 'Km';
// type temperatureUnitsType = 'ltr' | 'gal';
type timeFormatType = '12' | '24';

export const updateUnits = async (units: {
  distance: DistanceUnit;
  volume: VolumeUnit;
  time: TimeFormat;
}) => {
  try {
    AsyncStorage.setItem('units', JSON.stringify(units));
    const response = await AsyncStorage.getItem('units');
    console.log('Units saved successfully', response);
  } catch (error) {
    console.error('Failed to save units:', error);
  }
};

export const getUnits = async () => {
  const units = await AsyncStorage.getItem('units');
  if (units) {
    const parsedUnits: {
      distance: DistanceUnit;
      volume: VolumeUnit;
      time: TimeFormat;
    } = JSON.parse(units);

    return parsedUnits;
  }
};

export const distanceUnit = (value: DistanceUnit) => {
  switch (value) {
    case 'Statute Miles':
      return 'S.Mile';
    case 'Nautical Miles':
      return 'N.Mile';
    default:
      return 'Km';
  }
};

export const volumeUnit = (value: VolumeUnit) => {
  switch (value) {
    case 'Gallons':
      return 'gal';
    default:
      return 'ltr';
  }
};

export const distanceValue = (
  incomingDistance: number,
  unit: distanceUnitsType,
) => {
  const conversionRates = {
    kilometersToMiles: 0.621371,
    kilometersToNauticalMiles: 0.539957,
  };

  if (incomingDistance) {
    switch (unit) {
      case 'S.Mile':
        return incomingDistance * conversionRates.kilometersToMiles;
      case 'N.Mile':
        return incomingDistance * conversionRates.kilometersToNauticalMiles;
      default:
        return incomingDistance;
    }
  } else return NaN;
};

export const volumeValue = (incomingVolume: number, unit: volumeUnitsType) => {
  const conversionRates = {
    litresToGallons: 0.264172,
  };

  if (incomingVolume && unit == 'gal') {
    return incomingVolume * conversionRates.litresToGallons;
  } else {
    return incomingVolume;
  }
};

export const convertConsumption = (
  consumption: number,
  volUnit: VolumeUnit,
  distUnit: DistanceUnit,
) => {
  if (volUnit === 'Gallons') {
    consumption /= 3.78541;
  }
  if (distUnit === 'Nautical Miles') {
    consumption *= 1.852;
  } else if (distUnit === 'Statute Miles') {
    consumption *= 1.609;
  }
  return consumption;
};

export const formatTime = (time: string, timeFormat: TimeFormat) => {
  const [hours, minutes] = time.split(':').map(Number);

  if (timeFormat === '12') {
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const amPm = hours >= 12 ? 'PM' : 'AM';
    console.log(
      '12 hey: ',
      `${formattedHours}:${String(minutes).padStart(2, '0')} ${amPm}`,
    );

    return `${formattedHours}:${String(minutes).padStart(2, '0')} ${amPm}`;
  } else {
    console.log(
      '24 hey: ',
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    );

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
  }
};
