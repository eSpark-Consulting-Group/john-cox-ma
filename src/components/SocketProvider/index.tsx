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
import Zeroconf, {Service} from 'react-native-zeroconf';

import {EngineData, SocketJSON} from '../../types';

type ProvisionData = {timesp1: boolean; timesp2: boolean};
type SetState = Dispatch<SetStateAction<ProvisionData>>;

const zeroconf = new Zeroconf();

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
  resolvedService1: {} as Service | null,
  resolvedService2: {} as Service | null,
};

const SocketContext = createContext(initialState);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({children}: {children: React.ReactNode}) {
  const [serviceFound, setServiceFound] = useState<{
    host: string;
    port: number;
  } | null>(null);
  const [resolvedService1, setResolvedService1] = useState<Service | null>(
    null,
  );
  const [resolvedService2, setResolvedService2] = useState<Service | null>(
    null,
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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 1;
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize Zeroconf and set up event listeners
  useEffect(() => {
    const onStart = () => {
      console.log('Zeroconf scan started.');
    };

    const onFound = (serviceName: string) => {
      console.log('Service found:', serviceName);
    };

    const onResolved = (service: Service) => {
      console.log('Service resolved:', service);
      // Check if this is the service we are looking for
      if (service.name === 'timesp1' && service.addresses.length > 0) {
        setResolvedService1(service);
        const host = service.addresses[0];
        const port = service.port;
        setServiceFound({host, port});
        getSocketData(host, port);
      } else if (service.name === 'timesp2' && service.addresses.length > 0) {
        setResolvedService2(service);
        const host = service.addresses[0];
        const port = service.port;
        setServiceFound({host, port});
        getSocketData(host, port);
      }
    };

    const onError = (err: Error) => {
      console.error('Zeroconf error:', err.message);
    };

    zeroconf.on('start', onStart);
    zeroconf.on('found', onFound);
    zeroconf.on('resolved', onResolved);
    zeroconf.on('error', onError);

    // Start scanning
    zeroconf.scan('websocket', 'tcp', 'local.');

    // Cleanup function
    return () => {
      zeroconf.removeListener('start', onStart);
      zeroconf.removeListener('found', onFound);
      zeroconf.removeListener('resolved', onResolved);
      zeroconf.removeListener('error', onError);
      zeroconf.stop();
    };
  }, [provision.timesp1]); //  provision.timesp2 removing temp

  // Function to establish WebSocket connection
  const getSocketData = (host: string, port: number) => {
    // Prevent multiple WebSocket instances
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = `ws://${host}:${port}/ws`;
    console.log('Connecting to WebSocket at:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection opened for:', host);
      clearInterval(interval.current!);
      startTimer();
      setRetryCount(0); // Reset retry count on successful connection
    };

    ws.onmessage = e => {
      // console.log('WebSocket message received:', e.data);
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);

        const enginesData = jsonData.Engines;
        if (!enginesData || enginesData.length === 0) {
          console.log('No engine data or empty array received');
          ws.close();
          return;
        }

        if (resolvedService1?.name == 'timesp1') {
          handleTimesp1Data(enginesData);
        } else if (resolvedService2?.name === 'timesp2.local') {
          // handleTimesp2Data(enginesData);
          console.log('removed temporarily');
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
      if (e.code !== 1000) {
        // 1000 = normal closure
        if (retryCount < maxRetries) {
          const retryDelay = Math.min(1000 * 2 ** retryCount, 30000); // Exponential backoff up to 30s
          console.log(
            `Attempting to reconnect in ${retryDelay / 1000} seconds...`,
          );
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            if (serviceFound) {
              getSocketData(serviceFound.host, serviceFound.port);
            }
          }, retryDelay);
        } else {
          console.log('some issue');
        }
      }
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
    const currentSpeed = enginesData[0]?.SensorData?.speed;

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

  useEffect(() => {
    console.log('Engine data >>>>>>>>>>>>>>>: ', enginesData1, [enginesData1]);
  });
  useEffect(() => {
    console.log('speed >>>>>>>>>>>>>>>: ', speed, [speed]);
  });
  // // Handle data for timesp2
  // const handleTimesp2Data = (enginesData: EngineData[]) => {
  //   if (JSON.stringify(engine2Ref.current) !== JSON.stringify(enginesData)) {
  //     engine2Ref.current = enginesData;
  //     setEnginesData2(enginesData);
  //   }
  // };

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

  // // Handle provision changes
  // useEffect(() => {
  //   const handleProvisionChange = () => {
  //     if (provision.timesp1 || provision.timesp2) {
  //       // Trigger Zeroconf scan by updating dependency
  //       setRetryCount(0);
  //     }
  //   };

  //   handleProvisionChange();
  // }, [provision]);

  return (
    <SocketContext.Provider
      value={{
        enginesData1,
        enginesData2,
        setProvision,
        speed,
        provision,
        getTimerValue,
        resolvedService1,
        resolvedService2,
      }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
