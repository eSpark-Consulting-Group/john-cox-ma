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
  fuelManagementData: {
    distance_to_empty: number;
    remaining_fuel: number;
    total_fuel_burned: number;
  };
  fuelManagementData2: {
    distance_to_empty: number;
    remaining_fuel: number;
    total_fuel_burned: number;
  };
  speed: string;
  getTimerValue: () => number;
} = {
  enginesData1: [],
  enginesData2: [],
  setProvision: () => {},
  provision: {
    timesp1: false,
    timesp2: false,
  },
  fuelManagementData: {
    distance_to_empty: 0,
    remaining_fuel: 0,
    total_fuel_burned: 0,
  },
  fuelManagementData2: {
    distance_to_empty: 0,
    remaining_fuel: 0,
    total_fuel_burned: 0,
  },
  speed: '0',
  getTimerValue: () => 0,
};
const SocketContext = createContext(initialState);
export const useSocket = () => useContext(SocketContext);

function SocketProvider({children}: {children: React.ReactNode}) {
  const [enginesData1, setEnginesData1] = useState<EngineData[]>([]);
  const [enginesData2, setEnginesData2] = useState<EngineData[]>([]);
  const [speed, setSpeed] = useState('0');
  const [fuelManagementData, setFuelManagementData] = useState({
    distance_to_empty: 0,
    remaining_fuel: 0,
    total_fuel_burned: 0,
  });
  const [fuelManagementData2, setFuelManagementData2] = useState({
    distance_to_empty: 0,
    remaining_fuel: 0,
    total_fuel_burned: 0,
  });
  const engine1Ref = useRef<EngineData[]>([]);
  const engine2Ref = useRef<EngineData[]>([]);
  const fuelDataRef = useRef({
    distance_to_empty: 0,
    remaining_fuel: 0,
    total_fuel_burned: 0,
  });
  const fuelDataRef2 = useRef({
    distance_to_empty: 0,
    remaining_fuel: 0,
    total_fuel_burned: 0,
  });
  const [provision, setProvision] = useState<ProvisionData>({
    timesp1: false,
    timesp2: false,
  });

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
      // console.log('engines data fr 2: ', enginesData2);
    };

    ws.onmessage = e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        const sensors = jsonData.data.SensorData;
        const enginesData = getEnginesData(jsonData);

        if (domain === 'timesp1.local') {
          handleTimesp1Data(sensors, enginesData, jsonData);
        } else if (domain === 'timesp2.local') {
          // console.log('engines data for 2 ye aya : ', enginesData);
          handleTimesp2Data(sensors, enginesData, jsonData);
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

  const handleTimesp1Data = (
    sensors: {engine_id: string; fuel: string | undefined; speed: string}[],
    enginesData: EngineData[],
    jsonData: SocketJSON,
  ) => {
    if (sensors.length) {
      setSpeed(sensors[0].speed);
    } else {
      setSpeed('0');
    }
    const fuelMGT = getFuelMGT(jsonData);
    if (JSON.stringify(fuelDataRef.current) !== JSON.stringify(fuelMGT)) {
      fuelDataRef.current = fuelMGT;
      setFuelManagementData(fuelMGT);
    }
    if (JSON.stringify(engine1Ref.current) !== JSON.stringify(enginesData)) {
      engine1Ref.current = enginesData;
      setEnginesData1(enginesData);
    }
  };

  const handleTimesp2Data = (
    sensors: {engine_id: string; fuel: string | undefined; speed: string}[],
    enginesData: EngineData[],
    jsonData: SocketJSON,
  ) => {
    const fuelMGT = getFuelMGT(jsonData);
    if (JSON.stringify(fuelDataRef2.current) !== JSON.stringify(fuelMGT)) {
      fuelDataRef2.current = fuelMGT;
      setFuelManagementData2(fuelMGT);
      // console.log(fuelManagementData2);
    }
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
        fuelManagementData,
        fuelManagementData2,
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
