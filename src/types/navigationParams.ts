import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import {EngineData} from '.';

export type RootStackParamsList = {
  Test: undefined;
  Splash: undefined;
  Trips: undefined;
  Main: undefined;
  Login: undefined;
  // Login: {reolvedService?: Service | null};
  Setup: {loggedinDomain: string};
  FMMSetup: {config: EngineData[]; loggedinDomain: string};
  FuelTanks: undefined;
  ScanDevices: undefined;
  Proof: {device: ESPDevice};
  ScanNetworks: {device: ESPDevice};
  Confirmation: undefined;
};
