import {useState, useMemo, useRef, useEffect} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSocket} from '../../../providers/SocketProvider';
import {useService} from '../../../providers/ServiceProvider';
import {DistanceUnit, VolumeUnit} from '../../../types';
import {EngineUnits, getEngineUnits, getUnits} from '../../FMMSetup/utils';
import {sumOf} from '../../Trips/utils';
import React from 'react';
import {MainScreenProps} from '..';

export const useMainLogic = () => {
  const {
    enginesData1,
    enginesData2,
    getSocketData,
    speed,
    tanks,
    isService1Resolved,
    isService2Resolved,
  } = useSocket();
  const {resolvedService1, resolvedService2} = useService();
  const navigation = useNavigation<MainScreenProps['navigation']>();

  const [generatorRunning, setGeneratorRunning] = useState<'Yes' | 'No'>('Yes');
  const [confirmation, setConfirmation] = useState(false);
  const [units, setUnits] = useState<{
    distance: DistanceUnit;
    volume: VolumeUnit;
  }>();
  const [engineUnits, setEngineUnits] = useState<EngineUnits>();
  const hasFocusedRef = useRef(false);

  const buttonsData = useMemo(
    () => [
      {
        label: 'Main',
        labelStyle: {fontSize: 16, height: 65, textAlignVertical: 'center'},
        onPress: () => console.log(''),
      },
      {
        label: 'Fuel Tanks',
        labelStyle: {fontSize: 16, height: 65, textAlignVertical: 'center'},
        onPress: () => navigation.navigate('FuelTanks'),
      },
      {
        label: 'Trips',
        labelStyle: {fontSize: 16, height: 65, textAlignVertical: 'center'},
        onPress: () => navigation.navigate('Trips'),
      },
      {
        label: 'Setup',
        labelStyle: {fontSize: 16, height: 65, textAlignVertical: 'center'},
        onPress: async () => {
          navigation.navigate('Login');
        },
      },
    ],
    [],
  );

  const sumOfBurn = useMemo(() => {
    return (
      Number(enginesData1[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData1[1]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData2[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData2[1]?.FuelManagement.total_fuel_burned || 0)
    );
  }, [
    enginesData1[0]?.FuelManagement.total_fuel_burned,
    enginesData1[1]?.FuelManagement.total_fuel_burned,
    enginesData2[0]?.FuelManagement.total_fuel_burned,
    enginesData2[1]?.FuelManagement.total_fuel_burned,
  ]);

  const remainingFuel = useMemo(() => {
    return sumOf(tanks);
  }, [tanks]);

  const distanceToEmpty = useMemo(() => {
    return (
      Number(enginesData1[0]?.FuelManagement.distance_to_empty || 0) +
      Number(enginesData1[1]?.FuelManagement.distance_to_empty || 0) +
      Number(enginesData2[0]?.FuelManagement.distance_to_empty || 0) +
      Number(enginesData2[1]?.FuelManagement.distance_to_empty || 0)
    );
  }, [
    enginesData1[0]?.FuelManagement.distance_to_empty,
    enginesData1[1]?.FuelManagement.distance_to_empty,
    enginesData2[0]?.FuelManagement.distance_to_empty,
    enginesData2[1]?.FuelManagement.distance_to_empty,
  ]);

  const toggleGeneratorRunning = () =>
    setGeneratorRunning(prev => (prev === 'Yes' ? 'No' : 'Yes'));

  const fetchSocketData = () => {
    if (isService1Resolved && enginesData1.length === 0) {
      getSocketData(
        resolvedService1?.host!,
        resolvedService1?.port!,
        'timesp1',
      );
    }
    if (isService2Resolved && enginesData2.length === 0) {
      getSocketData(
        resolvedService2?.host!,
        resolvedService2?.port!,
        'timesp2',
      );
    }
  };

  const fetchUnits = async () => {
    const unitsData = await getUnits();
    const engineUnitsData = await getEngineUnits();
    setUnits(
      unitsData ? unitsData : {distance: 'Kilometers', volume: 'Liters'},
    );
    setEngineUnits(
      engineUnitsData
        ? engineUnits
        : {
            timesp1: {
              distance: 'Kilometers',
              volume: 'Gallons',
              temp: 'Fahrenheit',
              time: '24',
            },
            timesp2: {
              distance: 'Kilometers',
              volume: 'Gallons',
              temp: 'Fahrenheit',
              time: '24',
            },
          },
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (hasFocusedRef.current) {
        return;
      }
      fetchUnits();
      hasFocusedRef.current = true;

      return () => {
        hasFocusedRef.current = false;
      };
    }, []),
  );

  function YesResponse() {
    setConfirmation(false);
    navigation.navigate('ScanDevices');
  }
  function NoResponse() {
    setConfirmation(false);
    navigation.navigate('Main');
  }

  return {
    enginesData1,
    enginesData2,
    sumOfBurn,
    remainingFuel,
    distanceToEmpty,
    generatorRunning,
    toggleGeneratorRunning,
    confirmation,
    setConfirmation,
    fetchSocketData,
    units,
    engineUnits,
    speed,
    isService1Resolved,
    isService2Resolved,
    YesResponse,
    NoResponse,
    buttonsData,
  };
};
