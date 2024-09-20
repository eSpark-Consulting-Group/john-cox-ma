import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NetworkInfo} from 'react-native-network-info';
import {Alert, NativeModules} from 'react-native';

import {EngineData, FuelManagementData, SocketJSON} from '../../types';

type ProvisionData = {timesp1: boolean; timesp2: boolean};
type SetState = Dispatch<SetStateAction<ProvisionData>>;

const initialState: {
  enginesData1: EngineData[];
  enginesData2: EngineData[];
  fuelMgtData?: FuelManagementData[];
  fuelMgtData2?: FuelManagementData[];
  setProvision: SetState;
  provision: ProvisionData;
  speed: string | number;
  getTimerValue: () => number;
  reconnect: boolean;
} = {
  enginesData1: [],
  enginesData2: [],
  fuelMgtData: [],
  fuelMgtData2: [],
  setProvision: () => {},
  provision: {
    timesp1: false,
    timesp2: false,
  },
  speed: '0',
  getTimerValue: () => 0,
  reconnect: false,
};

const SocketContext = createContext(initialState);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({children}: {children: React.ReactNode}) {
  const [enginesData1, setEnginesData1] = useState<EngineData[]>([]);
  const [enginesData2, setEnginesData2] = useState<EngineData[]>([]);
  const [reconnect, setReconnect] = useState(false); // Declare and initialize reconnect state
  // const [fuelMgtData, setfuelMgtData] = useState<FuelManagementData[]>([]);
  // const [fuelMgtData2, setfuelMgtData2] = useState<FuelManagementData[]>([]);
  const [speed, setSpeed] = useState<number | string>('0');
  const [provision, setProvision] = useState<ProvisionData>({
    timesp1: false,
    timesp2: false,
  });
  const engine1Ref = useRef<EngineData[]>([]);
  const engine2Ref = useRef<EngineData[]>([]);
  // const fuleData1Ref = useRef<FuelManagementData[]>([]);
  // const fuleData2Ref = useRef<FuelManagementData[]>([]);
  const timer = useRef(0);
  const interval = useRef<NodeJS.Timeout>();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const startTimer = () => {
    interval.current = setInterval(async () => {
      timer.current++;
      await AsyncStorage.setItem('timer', timer.current.toString());
    }, 1000);
  };

  useEffect(() => {
    NetworkInfo.getIPAddress().then(ipAddress => {
      console.log(ipAddress);
    });
  }, []);

  const getTimerValue = () => timer.current;

  const getSocketData = (domain: string) => {
    console.log('=====WEB SOCKET START======');
    const ws = new WebSocket(`ws://${domain}/ws`);

    ws.onopen = () => {
      if (domain === 'timesp1.local' || domain === 'timesp2.local') {
        clearInterval(interval.current);
        startTimer();
      }
      console.log('WebSocket connection opened for : ', domain);
      // setRetryCount(0); // Reset retry count on successful connection
    };

    ws.onmessage = e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        // console.log('jsonData=====>>>>>', jsonData);

        const enginesData = jsonData.data.Engines;
        // const speedCheck = jsonData.data.Engines[0].SensorData.speed;
        // console.log('main engines data: =======', enginesData);
        // console.log('main engines Speed: =======', speedCheck);

        if (!enginesData || enginesData.length === 0) {
          console.log('No engine data or empty array received');
          ws.close();
          return;
        }

        if (domain === 'timesp1.local') {
          handleTimesp1Data(enginesData);
        } else if (domain === 'timesp2.local') {
          handleTimesp2Data(enginesData);
        }
      } catch (error) {
        console.log('Error during WebSocket message processing:', error);
        ws.close();
      }
    };

    ws.onerror = e => {
      console.log('WebSocket error:', e.message);
    };

    ws.onclose = e => {
      const {reason} = e;
      if (e.code === 1006) {
        // getSocketData(domain);
        console.log('idher');
      }
      console.log('WebSocket connection closed:', e.code, reason);
      if (
        !reason ||
        reason === 'Broken pipe' ||
        reason === 'Connection reset' ||
        reason === 'Control frames must be final.'
      ) {
        getSocketData(domain);
      }
    };
  };

  const handleTimesp1Data = (enginesData: EngineData[]) => {
    if (enginesData[0]?.SensorData?.speed!) {
      setSpeed(enginesData[0]?.SensorData?.speed!);
    } else {
      setSpeed('0');
    }
    if (JSON.stringify(engine1Ref.current) != JSON.stringify(enginesData)) {
      engine1Ref.current = enginesData;
      setEnginesData1(enginesData);
    }
  };

  const handleTimesp2Data = (enginesData: EngineData[]) => {
    if (JSON.stringify(engine2Ref.current) !== JSON.stringify(enginesData)) {
      engine2Ref.current = enginesData;
      setEnginesData2(enginesData);
    }
  };

  const handleReconnect = async () => {
    if (retryCount < maxRetries) {
      try {
        setTimeout(async () => {
          setRetryCount(prevCount => prevCount + 1);
          console.log(`Reconnecting: Attempt ${retryCount + 1}`);
        }, 5000); // Wait 5 seconds before turning Wi-Fi back on
      } catch (error) {
        console.error('Failed to toggle Wi-Fi:', error);
        Alert.alert(
          'Error',
          'Cannot toggle Wi-Fi. Please check your permissions.',
        );
      }
    } else {
      Alert.alert(
        'Error',
        'Cannot connect to the WebSocket server. Please check your connection.',
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let isProvisioned = await AsyncStorage.getItem('provisionedDevices');
        const prevTime = await AsyncStorage.getItem('timer');
        if (prevTime) {
          timer.current = +prevTime;
        }
        isProvisioned = JSON.stringify({timesp1: true, timesp2: false});
        console.log(isProvisioned, '>>>>>>');
        if (isProvisioned) {
          const data = JSON.parse(isProvisioned);
          if (data.timesp1) {
            if (retryCount < maxRetries) {
              getSocketData('timesp1.local');
            }
          }
        }
      } catch (error) {
        console.log(`error: ${error}`);
      }
      return () => {
        setRetryCount(0);
      };
    })();
  }, [provision.timesp1, retryCount]);

  useEffect(() => {
    (async () => {
      try {
        const isProvisioned = await AsyncStorage.getItem('provisionedDevices');
        if (isProvisioned) {
          const data = JSON.parse(isProvisioned);
          if (data.timesp2) {
            if (retryCount < 1) {
              getSocketData('timesp2.local');
            }
          }
        }
      } catch (error) {
        console.log(`error: ${error}`);
      }
    })();
  }, [provision.timesp2]);

  return (
    <SocketContext.Provider
      value={{
        enginesData1,
        enginesData2,
        setProvision,
        speed,
        provision,
        getTimerValue,
        reconnect,
      }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
