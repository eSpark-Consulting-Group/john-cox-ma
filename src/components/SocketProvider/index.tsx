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
import { EngineData } from '../../types';
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
  const enginer1Ref = useRef<EngineData[]>([]);
  const enginer2Ref = useRef<EngineData[]>([]);
  const fuelDataRef = useRef({
    distance_to_empty: 0,
    remaining_fuel: 0,
    total_fuel_burned: 0,
  });
  const [provision, setProvision] = useState({
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
    // Create socket`
    const ws = new WebSocket(`wss://${domain}/ws`);

    ws.onopen = () => {
      if (domain === 'timesp1.local') {
        clearInterval(interval.current);
        startTimer();
      }
      console.log('WebSocket connection opened');
    };
    ws.onmessage = e => {
      try {
        const jsonData = JSON.parse(e.data);
        const sensors = jsonData.data.SensorData;
        const enginesData: EngineData[] = jsonData.data.Engines.map(
          (engine: EngineData) => {
            const foundSensor = sensors.find(
              (s: any) => s.engine_id === engine.id,
            );
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
          },
        );
        if (domain === 'timesp1.local') {
          if (sensors.length) {
            setSpeed(sensors[0].speed);
          } else {
            setSpeed('0');
          }
          if (
            JSON.stringify(enginer1Ref.current) !== JSON.stringify(enginesData)
          ) {
            enginer1Ref.current = enginesData;
            setEnginesData1(enginesData);
          }
          const fuelData = jsonData.data.FuelManagement;
          let remaining_fuel = 0;
          let distance_to_empty = 0;
          let total_fuel_burned = 0;
          fuelData.forEach((item: any) => {
            remaining_fuel += +item.remaining_fuel;
            distance_to_empty += +item.distance_to_empty;
            total_fuel_burned += +item.total_fuel_burned;
          });
          const fuelDataJson = {
            remaining_fuel,
            distance_to_empty,
            total_fuel_burned,
          };
          if (
            JSON.stringify(fuelDataRef.current) !== JSON.stringify(fuelDataJson)
          ) {
            fuelDataRef.current = {
              remaining_fuel,
              distance_to_empty,
              total_fuel_burned,
            };
            setFuelManagementData({
              remaining_fuel,
              distance_to_empty,
              total_fuel_burned,
            });
          }
        } else {
          // if (JSON.stringify(enginer2Ref.current) !== enginesData) {
          //   enginer2Ref.current = jsonData.data.Engines;
          //   setEnginesData2(jsonData.data.Engines);
          // }
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
      if (reason === 'Broken pipe') {
        getSocketData(domain);
      } else if (reason === 'Connection reset') {
        getSocketData(domain);
      } else if (reason === null) {
        getSocketData(domain);
      } else if (reason === 'Control frames must be final.') {
        getSocketData(domain);
      }
    };
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
            // getSocketData('timesp2.local');
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
