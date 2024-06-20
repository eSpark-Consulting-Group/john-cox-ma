import {useRef, useState} from 'react';
import {EngineData, SocketJSON} from '../../types';

const getFuelMGT = (jsonData: SocketJSON) => {
  const fuelData = jsonData.data.FuelManagement;
  let remaining_fuel = 0;
  let distance_to_empty = 0;
  let total_fuel_burned = 0;
  fuelData.forEach(item => {
    remaining_fuel += +item.remaining_fuel;
    distance_to_empty += +item.distance_to_empty;
    total_fuel_burned += +item.total_fuel_burned;
  });
  const fuelMGT = {
    remaining_fuel,
    distance_to_empty,
    total_fuel_burned,
  };
  return fuelMGT;
};
const getEnginesData = (jsonData: SocketJSON): EngineData[] => {
  const sensors = jsonData.data.SensorData;
  return jsonData.data.Engines.map(engine => {
    const foundSensor = sensors.find(s => s.engine_id === engine.id);
    return {
      name: engine.name,
      id: engine.id,
      fuel: foundSensor?.fuel,
      enabled: engine.enabled,
      position: engine.position,
      volume_per_cycle: engine.volume_per_cycle,
      engine_type: engine.engine_type,
      fuel_type: engine.fuel_type,
    };
  });
};
export {getFuelMGT, getEnginesData};
