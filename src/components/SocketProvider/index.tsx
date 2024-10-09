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
  getTimerValue: () => 0,
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
        }
      };
    }, [resolvedService2]),
  );
  const [enginesData1, setEnginesData1] = useState<EngineData[]>([]);
  const [enginesData2, setEnginesData2] = useState<EngineData[]>([]);
  const [speed, setSpeed] = useState<number | string>('0');
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

        const enginesData = jsonData.Engines;
        if (!enginesData || enginesData.length === 0) {
          console.log('No engine data or empty array received');
          ws.close();
          return;
        }

        if (serviceName === 'timesp1') {
          handleTimesp1Data(enginesData);
        } else if (serviceName === 'timesp2') {
          handleTimesp2Data(enginesData);
        }
      } catch (error) {
        console.error('Error during WebSocket message processing:', error);
        ws.close();
      }
    };

    ws.onerror = e => {
      console.log('WebSocket error:', e.message);
    };

    ws.onclose = e => {
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
  const handleTimesp1Data = (enginesData: EngineData[]) => {
    const currentSpeed =
      enginesData[0]?.SensorData?.speed || enginesData[1]?.SensorData?.speed;

    if (currentSpeed !== undefined && currentSpeed !== null) {
      setSpeed(currentSpeed);
    } else {
      setSpeed('0');
    }

    if (JSON.stringify(engine1Ref.current) !== JSON.stringify(enginesData)) {
      engine1Ref.current = enginesData;
      setEnginesData1(enginesData);
    }
  };

  // Handle data for timesp2
  const handleTimesp2Data = (enginesData: EngineData[]) => {
    // console.log('############ handling engine 2 data ##########');
    if (JSON.stringify(engine2Ref.current) !== JSON.stringify(enginesData)) {
      engine2Ref.current = enginesData;
      setEnginesData2(enginesData);
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

  return (
    <SocketContext.Provider
      value={{
        enginesData1,
        enginesData2,
        setProvision,
        speed,
        provision,
        getTimerValue,
      }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
