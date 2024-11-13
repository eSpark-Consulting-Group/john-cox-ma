import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {EngineData, SocketJSON} from '../../types';
import {useFocusEffect} from '@react-navigation/native';
import {useService} from '../ServiceProvider';

type ProvisionData = {timesp1: boolean; timesp2: boolean};
type SetState = Dispatch<SetStateAction<ProvisionData>>;

const initialState = {
  enginesData1: [] as EngineData[],
  enginesData2: [] as EngineData[],
  setProvision: (() => {}) as SetState,
  provision: {
    timesp1: false,
    timesp2: false,
  },
  speed: '0' as string | number,
  tank1_fuel: 0 as number,
  tank2_fuel: 0 as number,
  tank3_fuel: 0 as number,
  tank4_fuel: 0 as number,
  getTimerValue: () => 0,
  getSocketData: (host: string, port: number, serviceName: string) => {},
};

const SocketContext = createContext(initialState);

export const useSocket = () => useContext(SocketContext);

function SocketProvider({children}: {children: React.ReactNode}) {
  const {resolvedService1, resolvedService2} = useService();
  useFocusEffect(
    React.useCallback(() => {
      if (resolvedService1?.addresses) {
        getSocketData(resolvedService1.host, resolvedService1.port, 'timesp1');
      }
      // Cleanup function
      return () => {
        if (wsRef.current.timesp1) {
          wsRef.current.timesp1.close();
          wsRef.current.timesp1 = null;
          setEnginesData1([]);
          engine1Ref.current = [];
        }
      };
    }, [resolvedService1]),
  );
  useFocusEffect(
    React.useCallback(() => {
      if (resolvedService2?.addresses) {
        getSocketData(resolvedService2.host, resolvedService2.port, 'timesp2');
      }
      // Cleanup function
      return () => {
        if (wsRef.current.timesp2) {
          wsRef.current.timesp2.close();
          wsRef.current.timesp2 = null;
          setEnginesData2([]);
          engine2Ref.current = [];
        }
      };
    }, [resolvedService2]),
  );
  const [enginesData1, setEnginesData1] = useState<EngineData[]>([]);
  const [enginesData2, setEnginesData2] = useState<EngineData[]>([]);
  const [speed, setSpeed] = useState<number | string>('0');
  const [tank1_fuel, setTank1_fuel] = useState<number>(0);
  const [tank2_fuel, setTank2_fuel] = useState<number>(0);
  const [tank3_fuel, setTank3_fuel] = useState<number>(0);
  const [tank4_fuel, setTank4_fuel] = useState<number>(0);
  const [provision, setProvision] = useState<ProvisionData>({
    timesp1: false,
    timesp2: false,
  });
  const engine1Ref = useRef<EngineData[]>([]);
  const engine2Ref = useRef<EngineData[]>([]);
  const timer = useRef(0);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<{timesp1: WebSocket | null; timesp2: WebSocket | null}>({
    timesp1: null,
    timesp2: null,
  });

  // Function to establish WebSocket connection
  const getSocketData = (host: string, port: number, serviceName: string) => {
    const wsUrl = `ws://${host}:${port}/ws`;
    const servName = serviceName as 'timesp1' | 'timesp2';
    if (wsRef.current[servName]?.OPEN) {
      return;
    }
    console.log('Connecting to WebSocket at:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current[serviceName as 'timesp1' | 'timesp2'] = ws;

    ws.onopen = () => {
      console.log('WebSocket connection opened for:', host);
      clearInterval(interval.current!);
      startTimer(); // Reset retry count on successful connection
    };

    ws.onmessage = e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        const enginesData = jsonData;
        if (!enginesData?.Engines || enginesData.Engines.length === 0) {
          console.log('No engine data or empty array received');
          ws.close();
          return;
        }

        if (serviceName === 'timesp1') {
          handleTimesp1Data(enginesData);
          // console.log('🚀 ~ getSocketData ~ enginesData: timesp1', enginesData);
        } else if (serviceName === 'timesp2') {
          // console.log('🚀 ~ getSocketData ~ enginesData: timesp2', enginesData);
          handleTimesp2Data(enginesData);
        }
      } catch (error) {
        console.error('Error during WebSocket message processing:', error);
        ws.close();
      }
    };

    ws.onerror = e => {
      console.log('WebSocket error:', e.message);
      resetEgninesData(servName);
    };

    ws.onclose = e => {
      resetEgninesData(servName);
      console.log('WebSocket connection closed:', e.code, e.reason);
    };
  };

  // Function to start the timer
  const startTimer = () => {
    interval.current = setInterval(async () => {
      timer.current++;
      await AsyncStorage.setItem('timer', timer.current.toString());
    }, 1000);
  };

  const getTimerValue = () => timer.current;

  // Handle data for timesp1
  const handleTimesp1Data = (enginesData: SocketJSON) => {
    // console.log(enginesData.Engines);

    const currentSpeed = enginesData.speed || 0;
    const current_tank1_fuel = enginesData.tank1_fuel;
    const current_tank2_fuel = enginesData.tank2_fuel;
    const current_tank3_fuel = enginesData.tank3_fuel;
    const current_tank4_fuel = enginesData.tank4_fuel;

    if (currentSpeed !== undefined && currentSpeed !== null) {
      setSpeed(currentSpeed);
    } else {
      setSpeed('0');
    }
    if (current_tank1_fuel !== undefined && current_tank1_fuel !== null) {
      setTank1_fuel(current_tank1_fuel);
    } else {
      setTank1_fuel(0);
    }
    if (current_tank2_fuel !== undefined && current_tank2_fuel !== null) {
      setTank2_fuel(current_tank2_fuel);
    } else {
      setTank2_fuel(0);
    }
    if (current_tank3_fuel !== undefined && current_tank3_fuel !== null) {
      setTank3_fuel(current_tank3_fuel);
    } else {
      setTank3_fuel(0);
    }
    if (current_tank4_fuel !== undefined && current_tank4_fuel !== null) {
      setTank4_fuel(current_tank4_fuel);
    } else {
      setTank4_fuel(0);
    }

    if (
      JSON.stringify(engine1Ref.current) !== JSON.stringify(enginesData.Engines)
    ) {
      engine1Ref.current = enginesData.Engines;
      setEnginesData1(enginesData.Engines);
    }
  };

  // Handle data for timesp2
  const handleTimesp2Data = (enginesData: SocketJSON) => {
    const currentSpeed = enginesData.speed || 0;
    const current_tank1_fuel = enginesData.tank1_fuel;
    const current_tank2_fuel = enginesData.tank2_fuel;
    const current_tank3_fuel = enginesData.tank3_fuel;
    const current_tank4_fuel = enginesData.tank4_fuel;

    if (!wsRef.current.timesp1?.OPEN) {
      if (currentSpeed !== undefined && currentSpeed !== null) {
        setSpeed(currentSpeed);
      } else {
        setSpeed('0');
      }
      if (current_tank1_fuel !== undefined && current_tank1_fuel !== null) {
        setTank1_fuel(current_tank1_fuel);
      } else {
        setTank1_fuel(0);
      }
      if (current_tank2_fuel !== undefined && current_tank2_fuel !== null) {
        setTank2_fuel(current_tank2_fuel);
      } else {
        setTank2_fuel(0);
      }
      if (current_tank3_fuel !== undefined && current_tank3_fuel !== null) {
        setTank3_fuel(current_tank3_fuel);
      } else {
        setTank3_fuel(0);
      }
      if (current_tank4_fuel !== undefined && current_tank4_fuel !== null) {
        setTank4_fuel(current_tank4_fuel);
      } else {
        setTank4_fuel(0);
      }
    }

    if (
      JSON.stringify(engine2Ref.current) !== JSON.stringify(enginesData.Engines)
    ) {
      engine2Ref.current = enginesData.Engines;
      setEnginesData2(enginesData.Engines);
    }
  };

  // Load initial provisioned devices and timer
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const isProvisioned = await AsyncStorage.getItem('provisionedDevices');
        const prevTime = await AsyncStorage.getItem('timer');
        if (prevTime) {
          timer.current = parseInt(prevTime, 10);
        }
        if (isProvisioned) {
          const data = JSON.parse(isProvisioned) as ProvisionData;
          setProvision(data);
        }
      } catch (error) {
        console.error(`Error loading provisioned devices or timer: ${error}`);
      }
    };

    loadInitialData();
  }, []);

  const resetEgninesData = (servName: 'timesp1' | 'timesp2') => {
    if (servName === 'timesp1') {
      setEnginesData1([]);
      engine1Ref.current = [];
      wsRef.current.timesp1 = null;
    }
    if (servName === 'timesp2') {
      setEnginesData2([]);
      engine2Ref.current = [];
      wsRef.current.timesp2 = null;
    }
  };
  return (
    <SocketContext.Provider
      value={{
        getSocketData,
        enginesData1,
        enginesData2,
        setProvision,
        speed,
        provision,
        getTimerValue,
        tank1_fuel,
        tank2_fuel,
        tank3_fuel,
        tank4_fuel,
      }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
