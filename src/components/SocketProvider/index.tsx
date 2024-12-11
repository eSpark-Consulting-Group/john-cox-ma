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
import {Service} from 'react-native-zeroconf';

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
  tanks: [0, 0, 0, 0] as number[],
  getTimerValue: () => 0,
  getSocketData: (host: string, port: number, serviceName: string) => {},
  isService1Resolved: false,
  isService2Resolved: false,
};

const SocketContext = createContext(initialState);

export const useSocket = () => useContext(SocketContext);

function SocketProvider({children}: {children: React.ReactNode}) {
  // const {resolvedService1, resolvedService2} = useService();
  const resolvedService1 = useService('timesp1') as Service;
  const resolvedService2 = useService('timesp2') as Service;
  const [isService1Resolved, setIsService1Resolved] = useState(
    !!resolvedService1,
  );
  const [isService2Resolved, setIsService2Resolved] = useState(
    !!resolvedService2,
  );

  const retryCountRef = useRef<{timesp1: number; timesp2: number}>({
    timesp1: 0,
    timesp2: 0,
  });

  const lastDataReceiveTimeRef = useRef<{timesp1: number; timesp2: number}>({
    timesp1: Date.now(),
    timesp2: Date.now(),
  });

  // New effect to check data receive timeout
  useEffect(() => {
    const checkDataReceiveTimeout = () => {
      const currentTime = Date.now();
      const TIMEOUT_DURATION = 30000; // 30 seconds

      // Check timesp1
      if (
        resolvedService1 &&
        currentTime - lastDataReceiveTimeRef.current.timesp1 > TIMEOUT_DURATION
      ) {
        console.log(
          'No data received for timesp1 in 30 seconds. Reconnecting...',
        );
        if (wsRef.current.timesp1) {
          wsRef.current.timesp1.close();
          wsRef.current.timesp1 = null;
          setEnginesData1([]);
          engine1Ref.current = [];
          retryCountRef.current.timesp1 = 0;
          setIsService1Resolved(false);
        }
        getSocketData(resolvedService1.host, resolvedService1.port, 'timesp1');
      }

      // Check timesp2
      if (
        resolvedService2 &&
        currentTime - lastDataReceiveTimeRef.current.timesp2 > TIMEOUT_DURATION
      ) {
        console.log(
          'No data received for timesp2 in 30 seconds. Reconnecting...',
        );
        if (wsRef.current.timesp2) {
          wsRef.current.timesp2.close();
          wsRef.current.timesp2 = null;
          setEnginesData2([]);
          engine2Ref.current = [];
          retryCountRef.current.timesp2 = 0;
          setIsService2Resolved(false);
        }
        getSocketData(resolvedService2.host, resolvedService2.port, 'timesp2');
      }
    };

    // Run check every 30 seconds
    const timeoutCheckInterval = setInterval(checkDataReceiveTimeout, 30000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(timeoutCheckInterval);
    };
  }, [resolvedService1, resolvedService2]);

  const MAX_RETRIES = 5;
  const RETRY_INTERVAL = 5000; // 5 seconds

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
          retryCountRef.current.timesp1 = 0;
          setIsService1Resolved(false);
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
          retryCountRef.current.timesp2 = 0;
          setIsService2Resolved(false);
        }
      };
    }, [resolvedService2]),
  );
  const [enginesData1, setEnginesData1] = useState<EngineData[]>([]);
  const [enginesData2, setEnginesData2] = useState<EngineData[]>([]);
  const [speed, setSpeed] = useState<number | string>('0');
  const [tanks, setTanks] = useState<number[]>([0, 0, 0, 0]);
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

    if (retryCountRef.current[servName] >= MAX_RETRIES) {
      console.log(
        `Max retries reached for ${servName}. Stopping reconnection attempts.`,
      );
      resetEgninesData(servName);
      return;
    }

    console.log('Connecting to WebSocket at:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current[serviceName as 'timesp1' | 'timesp2'] = ws;

    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.log(`Connection timeout for ${servName}. Closing socket.`);
        ws.close();
      }
    }, 10000);

    ws.onopen = () => {
      clearTimeout(connectionTimeout);
      console.log('WebSocket connection opened for:', host);
      clearInterval(interval.current!);
      startTimer(); // Reset retry count on successful connection
      retryCountRef.current[servName] = 0; // Reset retry count on successful connection
      if (servName === 'timesp1') {
        setIsService1Resolved(true);
      } else if (servName === 'timesp2') {
        setIsService2Resolved(true);
      }
    };

    ws.onmessage = e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        lastDataReceiveTimeRef.current[servName] = Date.now();

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
      clearTimeout(connectionTimeout);
      console.log('WebSocket error:', serviceName, e.message);
    };

    ws.onclose = e => {
      clearTimeout(connectionTimeout);
      console.log(
        `WebSocket connection closed for ${serviceName}:`,
        e.code,
        e.reason,
      );
      retryConnection(host, port, servName);
    };
  };

  const retryConnection = (
    host: string,
    port: number,
    serviceName: 'timesp1' | 'timesp2',
  ) => {
    retryCountRef.current[serviceName]++;
    console.log(
      `Retrying connection for ${serviceName}. Attempt ${retryCountRef.current[serviceName]} of ${MAX_RETRIES}`,
    );

    if (retryCountRef.current[serviceName] < MAX_RETRIES) {
      setTimeout(() => {
        getSocketData(host, port, serviceName);
        console.log('asd');
      }, RETRY_INTERVAL);
    } else {
      console.log(
        `Max retries reached for ${serviceName}. Stopping reconnection attempts.`,
      );
      resetEgninesData(serviceName);
    }
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
    const current_tanks = enginesData.tanks || 0;

    if (currentSpeed !== undefined && currentSpeed !== null) {
      setSpeed(currentSpeed);
    } else {
      setSpeed('0');
    }
    if (current_tanks !== undefined && current_tanks !== null) {
      setTanks(current_tanks);
    } else {
      setTanks([0, 0, 0, 0]);
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
    const current_tanks = enginesData.tanks;

    if (!wsRef.current.timesp1?.OPEN) {
      if (currentSpeed !== undefined && currentSpeed !== null) {
        setSpeed(currentSpeed);
      } else {
        setSpeed('0');
      }
      if (current_tanks !== undefined && current_tanks !== null) {
        setTanks(current_tanks);
      } else {
        setTanks([0, 0, 0, 0]);
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
          console.log('provision hoa ===============+++++++++++++', data);

          setProvision(data);
        }
      } catch (error) {
        console.error(`Error loading provisioned devices or timer: ${error}`);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (resolvedService1) {
      getSocketData(resolvedService1.host, resolvedService1.port, 'timesp1');
    }
    if (resolvedService2) {
      getSocketData(resolvedService2.host, resolvedService2.port, 'timesp2');
    }

    return () => {
      Object.keys(wsRef.current).forEach(key => {
        const ws = wsRef.current[key as 'timesp1' | 'timesp2'];
        if (ws) {
          ws.close();
        }
      });
    };
  }, [resolvedService1, resolvedService2]);

  const resetEgninesData = (servName: 'timesp1' | 'timesp2') => {
    if (servName === 'timesp1') {
      setEnginesData1([]);
      engine1Ref.current = [];
      wsRef.current.timesp1 = null;
      setIsService1Resolved(false);
    }
    if (servName === 'timesp2') {
      setEnginesData2([]);
      engine2Ref.current = [];
      wsRef.current.timesp2 = null;
      setIsService2Resolved(false);
    }
    retryCountRef.current[servName] = 0;
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
        tanks,
        isService1Resolved,
        isService2Resolved,
      }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
