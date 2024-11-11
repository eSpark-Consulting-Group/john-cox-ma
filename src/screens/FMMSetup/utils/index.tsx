// conversions.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Unit} from '../../../types';
import {useState} from 'react';

export const updateUnits = async (units: {distance: Unit}) => {
  try {
    AsyncStorage.setItem('units', JSON.stringify(units));
    console.log('Units saved successfully');
  } catch (error) {
    console.error('Failed to save units:', error);
  }
};

export const getUnits = async () => {
  const units = await AsyncStorage.getItem('units');
  if (units) {
    const parsedUnits: {distance: Unit} = JSON.parse(units);

    return parsedUnits;
  }
};

export const distanceUnit = (value: Unit) => {
  switch (value) {
    case 'miles':
      return 'S.Mile';
    case 'nauticalMiles':
      return 'N.Mile';
    default:
      return 'Km';
  }
};

type distanceUnitsType = 'S.Mile' | 'N.Mile' | 'Km';

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
  }
};

interface ConversionResult {
  value: number;
  fromUnit: Unit;
  toUnit: Unit;
}

export const convertDistance = (
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
): ConversionResult => {
  if (fromUnit === toUnit) {
    return {value, fromUnit, toUnit}; // No conversion needed
  }

  // Conversion rates
  const conversionRates = {
    kilometersToMiles: 0.621371,
    kilometersToNauticalMiles: 0.539957,
  };

  let convertedValue: number;

  switch (`${fromUnit}To${toUnit}`) {
    case 'kilometersToMiles':
      convertedValue = value * conversionRates.kilometersToMiles;
      break;
    case 'kilometersToNauticalMiles':
      convertedValue = value * conversionRates.kilometersToNauticalMiles;
      break;
    case 'milesToKilometers':
      convertedValue = value / conversionRates.kilometersToMiles;
      break;
    case 'milesToNauticalMiles':
      convertedValue =
        (value / conversionRates.kilometersToMiles) *
        conversionRates.kilometersToNauticalMiles;
      break;
    case 'nauticalMilesToKilometers':
      convertedValue = value / conversionRates.kilometersToNauticalMiles;
      break;
    case 'nauticalMilesToMiles':
      convertedValue =
        (value / conversionRates.kilometersToNauticalMiles) *
        conversionRates.kilometersToMiles;
      break;
    default:
      convertedValue = value; // No conversion if case not matched
  }

  return {value: convertedValue, fromUnit, toUnit};
};
