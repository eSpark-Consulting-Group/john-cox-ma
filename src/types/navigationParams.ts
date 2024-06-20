import {NavigatorScreenParams} from '@react-navigation/native';
import { EngineData } from '.';

export type RootStackParamsList = {
  Test: undefined;
  Splash: undefined;
  DeviceSetup: undefined;
  Main: undefined;
  Login: undefined;
  Setup: undefined;
  FMMSetup: {config: EngineData[]};
  FuelTanks: undefined;
  Trips: undefined;
};
