import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import {EngineData, Unit} from '.';

export type RootStackParamsList = {
  WithContext: undefined;
  Test: undefined;
  Splash: undefined;
  Trips: undefined;
  Main: undefined;
  Login: undefined;
  // Login: {reolvedService?: Service | null};
  Setup: {loggedinDomain: string; deviceName: 'timesp1' | 'timesp2'};
  FMMSetup: {
    config: EngineData[];
    loggedinDomain: string;
    deviceName: 'timesp1' | 'timesp2';
    toUnit: Unit
  };
  FuelTanks: undefined;
  ScanDevices: undefined;
  Proof: {device: ESPDevice};
  ScanNetworks: {device: ESPDevice};
  Confirmation: undefined;
};
