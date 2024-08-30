import {useRef, useState} from 'react';
import {EngineData, FuelManagementData, SocketJSON} from '../../types';

const getFuelMGT = (jsonData: SocketJSON) => {
  // Ensure jsonData.data.Engines is an array and properly mapped
  const fuelData: FuelManagementData[] = jsonData.data.Engines.map(
    engine => engine.FuelManagement,
  ).filter(Boolean);

  let remaining_fuel = 0;
  let distance_to_empty = 0;
  let total_fuel_burned = 0;

  fuelData.forEach(item => {
    remaining_fuel += +item.remaining_fuel || 0;
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

const getEnginesData = (jsonData: SocketJSON): EngineData[] => {
  const data = jsonData.data.Engines;
  return jsonData.data.Engines.map(engine => {
    // const foundData = data.find(s => s.FuelManagement?.engine_id === engine.id);
    return {
      name: engine.name,
      id: engine.id,
      enabled: engine.enabled,
      position: engine.position,
      volume_per_cycle: engine.volume_per_cycle,
      engine_type: engine.engine_type,
      fuel_type: engine.fuel_type,
      SensorData: engine?.SensorData,
      FuelManagement: engine?.FuelManagement,
    };
  });
};
export {getEnginesData};
