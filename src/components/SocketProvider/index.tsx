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
import {EngineData, SocketJSON} from '../../types';
import {getEnginesData, getFuelMGT} from './socket.helper';
type ProvisionData = {timesp1: boolean; timesp2: boolean};
type SetState = Dispatch<SetStateAction<ProvisionData>>;

const initialState: {
  enginesData1: EngineData[];
  enginesData2: EngineData[];
  setProvision: SetState;
  provision: ProvisionData;
  speed: string | number;
  getTimerValue: () => number;
} = {
  enginesData1: [],
  enginesData2: [],
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
  const [speed, setSpeed] = useState<number | string>('0');
  const [provision, setProvision] = useState<ProvisionData>({
    timesp1: false,
    timesp2: false,
  });
  const engine1Ref = useRef<EngineData[]>([]);
  const engine2Ref = useRef<EngineData[]>([]);
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
      if (domain === 'timesp1.local' || 'timesp2.local') {
        clearInterval(interval.current);
        startTimer();
      }
      console.log('WebSocket connection opened for : ', domain);
    };

    ws.onmessage = e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        const enginesData = getEnginesData(jsonData);

        if (domain === 'timesp1.local') {
          handleTimesp1Data(enginesData);
        } else if (domain === 'timesp2.local') {
          handleTimesp2Data(enginesData);
        }
      } catch (error) {
        console.log(error);
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
    if (enginesData1[0]?.SensorData?.speed! > 0) {
      setSpeed(enginesData1[0]?.SensorData?.speed!);
    } else {
      setSpeed('0');
    }
    if (JSON.stringify(engine1Ref.current) !== JSON.stringify(enginesData)) {
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
        setProvision,
        speed,
        enginesData2,
        provision,
        getTimerValue,
      }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
