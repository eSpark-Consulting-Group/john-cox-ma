import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {EngineData, FuelManagementData, SocketJSON} from '../../types';
import {getEnginesData} from './socket.helper';
import {fuelData} from '../../constants';

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
};

const SocketContext = createContext(initialState);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({children}: {children: React.ReactNode}) {
  const [enginesData1, setEnginesData1] = useState<EngineData[]>([]);
  const [enginesData2, setEnginesData2] = useState<EngineData[]>([]);
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

  const startTimer = () => {
    interval.current = setInterval(async () => {
      timer.current++;
      await AsyncStorage.setItem('timer', timer.current.toString());
    }, 1000);
  };

  const getTimerValue = () => timer.current;

  const getSocketData = (domain: string) => {
    console.log('=====WEB SOCKET START======');
    const ws = new WebSocket(`wss://${domain}/ws`);

    ws.onopen = () => {
      if (domain === 'timesp1.local' || domain === 'timesp2.local') {
        clearInterval(interval.current);
        startTimer();
      }
      console.log('WebSocket connection opened for : ', domain);
    };

    ws.onmessage = e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        // console.log('jsonData=====>>>>>', jsonData);

        const enginesData = jsonData.data.Engines;
        const speedCheck = jsonData.data.Engines[0].SensorData.speed;
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
      console.log(engine1Ref.current);
      console.log('different======================================');
      console.log(enginesData);
      engine1Ref.current = enginesData;
      setEnginesData1(enginesData);
      // console.log(enginesData);
    }
  };

  const handleTimesp2Data = (enginesData: EngineData[]) => {
    if (JSON.stringify(engine2Ref.current) !== JSON.stringify(enginesData)) {
      engine2Ref.current = enginesData;
      setEnginesData2(enginesData);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const isProvisioned = await AsyncStorage.getItem('provisionedDevices');
        const prevTime = await AsyncStorage.getItem('timer');
        if (prevTime) {
          timer.current = +prevTime;
        }
        if (isProvisioned) {
          const data = JSON.parse(isProvisioned);
          if (data.timesp1) {
            getSocketData('timesp1.local');
          }
        }
      } catch (error) {
        console.log(`error: ${error}`);
      }
    })();
  }, [provision.timesp1]);

  useEffect(() => {
    (async () => {
      try {
        const isProvisioned = await AsyncStorage.getItem('provisionedDevices');
        if (isProvisioned) {
          const data = JSON.parse(isProvisioned);
          if (data.timesp2) {
            getSocketData('timesp2.local');
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
      }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
