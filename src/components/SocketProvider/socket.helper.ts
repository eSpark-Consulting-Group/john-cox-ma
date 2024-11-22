import {useRef, useState} from 'react';
import {EngineData, FuelManagementData, SocketJSON} from '../../types';

const getFuelMGT = (jsonData: SocketJSON) => {
  // Ensure jsonData.data.Engines is an array and properly mapped
  const fuelData: FuelManagementData[] = jsonData.Engines.map(
    engine => engine.FuelManagement,
  ).filter(Boolean);

  let remaining_fuel = 0;
  let distance_to_empty = 0;
  let total_fuel_burned = 0;

  fuelData.forEach(item => {
    // remaining_fuel += +item.remaining_fuel || 0;
    distance_to_empty += +item.distance_to_empty || 0;
    total_fuel_burned += +item.total_fuel_burned || 0;
  });

  const fuelMGT = {
    remaining_fuel,
    distance_to_empty,
    total_fuel_burned,
  };

  return fuelMGT;
};

