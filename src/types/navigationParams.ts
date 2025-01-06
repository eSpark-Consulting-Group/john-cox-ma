import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import {EngineData, DistanceUnit, VolumeUnit, TimeFormat, TempUnit} from '.';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamsList = {
  WithContext: undefined;
  Splash: undefined;
  Trips: undefined;
  Main: {isConfirmation: boolean} | undefined;
  Login: undefined;
  Setup: {loggedinDomain: string; deviceName: 'timesp1' | 'timesp2'};
  FMMSetup: {
    config: EngineData[];
    loggedinDomain: string;
    deviceName: 'timesp1' | 'timesp2';
    distanceToUnit?: DistanceUnit;
    volumeToUnit?: VolumeUnit;
    timeToFormat?: TimeFormat;
    temperatureToUnit?: TempUnit;
  };
  FuelTanks: undefined;
  ScanDevices: undefined;
  Proof: {device: ESPDevice};
  ScanNetworks: {device: ESPDevice};
  Confirmation: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamsList> =
  NativeStackScreenProps<RootStackParamsList, T>;

export type FMMSetupScreenProps = RootStackScreenProps<'FMMSetup'>;
