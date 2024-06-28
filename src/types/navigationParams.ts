import { ESPDevice } from "@espark-consultants/react-native-esp-idf-provisioning";

export type RootStackParamsList = {
  Test: undefined;
  Splash: undefined;
  Trips: undefined;
  Main: undefined;
  Login: undefined;
  Setup: undefined;
  FMMSetup: undefined;
  FuelTanks: undefined;
  Proof: { device: ESPDevice };
  ScanDevices: undefined;
  ScanNetworks: undefined;
};
