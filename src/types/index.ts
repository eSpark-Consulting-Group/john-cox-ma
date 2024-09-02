import {
  ColorValue,
  DimensionValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Theme} from '@react-navigation/native';

export type MyTheme = Theme & {
  colors: {
    placeholder?: string;
    secondary: string;
    switch?: string;
    proSecondary?: string;
    semiSecondary?: string;
    pale: string;
    paleBorder?: string;
    highlight?: string;
    checkbox?: string;
    box?: string;
  };
};

export type Fonts =
  | 'AnonymousPro-Bold'
  | 'AnonymousPro-Regular'
  | 'AnonymousPro-Italic'
  | 'CrimsonText-Bold'
  | 'CrimsonText-Regular'
  | 'NotoSerif-Bold'
  | 'NotoSerif-Regular'
  | 'NotoSans-Bold'
  | 'NotoSans-Regular'
  | 'NotoSans-BoldItalic';

export type MyTextProps = {
  text?: string;
  textColor?: string;
  style?: TextStyle;
  size?: number;
  fontFamily?: Fonts;
};

export interface MyButtonProps {
  label?: string;
  onPress?: () => void;
  textColor?: string;
  backgroundColor?: ColorValue | undefined | string;
  style?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle;
  key?: string;
  fontFamily?: Fonts;
  gradient?: boolean;
  height?: any;
  width?: any;
}

export interface MyInputProps {
  text?: string;
  onChange?: (val: string) => void;
  onChangeText?: (value: string) => void;
  width?: DimensionValue | any;
  height?: DimensionValue | any;
  password?: boolean;
  onFocus?: () => void;
  size?: number;
  placeholder?: string;
  value?: string | number | any;
  editable?: boolean;
}

export interface LabelInputProps {
  text: string;
  placeholder?: string;
  subText?: string;
  size?: number;
  checkbox?: boolean;
  width?: DimensionValue | any;
  height?: DimensionValue | any;
  password?: boolean;
  value?: boolean;
  onFocus?: () => void;
  onChange?: (e: string) => void;
  inputValue?: string;
}

export interface DropdownProps {
  data: string[];
  zIndex?: number;
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: ViewStyle;
  height?: number;
  dropdnHeight?: number;
  theme: MyTheme;
  value?: string;
}

export interface LabelDropdownProps {
  text: string;
  size?: number;
  data: string[];
  zIndex?: number;
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: ViewStyle;
  height?: number;
  status?: boolean;
  isActive?: boolean;
  dropdnHeight?: number;
  egnineId?: string;
  onPress?: (id: string | undefined) => void;
  value?: string;
}

export type MyCheckboxProps = {
  onChange?: (checked: boolean) => void;
  style?: ViewStyle;
  checkboxStyle?: ViewStyle;
  width?: DimensionValue | any;
  value?: boolean;
  disabled?: boolean;
};

export type DisplayBoxProps = {
  value: string | number;
  width?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  height?: number;
  textColor?: string;
  size?: number;
  fontFamily?: Fonts;
};

export type FuelManagementData = {
  id: number;
  engine_id: number;
  distance_to_empty: number;
  remaining_fuel: number;
  total_fuel_burned: number;
};

export type SensorDataProps = {
  id: number;
  engine_id: number;
  fuel: string | undefined;
  speed: number;
  temperature_return: string;
  temperature_supply: string;
  timestamp_unix: string;
};

export type EngineData = {
  id: number;
  name: string;
  enabled: '1' | '0';
  engine_type: string;
  fuel_type: string;
  position: string;
  volume_per_cycle: string;
  FuelManagement: FuelManagementData;
  SensorData: SensorDataProps;
};

export type SocketJSON = {
  data: {
    Engines: EngineData[];
  };
};

export interface TripData {
  name: string;
  startingTime: Date | null;
  endingTime: Date | null;
  distanceCovered: number;
  tripTime: string;
  fuelConsumption: number[];
  tripEfficiency: number | undefined;
}

// ```
// "data": {
//         "Engines": [
//             {
//                 "id": "1",
//                 "name": "Engine M1",
//                 "enabled": "1",
//                 "engine_type": "Type 1",
//                 "fuel_type": "Type 1",
//                 "position": "P0.500000",
//                 "volume_per_cycle": "0.5",
//                 "FuelManagement": {
//                     "id": "1",
//                     "engine_id": "1",
//                     "distance_to_empty": "200",
//                     "remaining_fuel": "50",
//                     "total_fuel_burned": "100"
//                 },
//                 "SensorData": {
//                     "id": "10",
//                     "engine_id": "1",
//                     "fuel": "18.609697",
//                     "speed": "75.245766",
//                     "temperature_return": "33.029606",
//                     "temperature_supply": "25.658394",
//                     "timestamp_unix": "1"
//                 }
//             },
//             {
//                 "id": "2",
//                 "name": "Engine M2",
//                 "enabled": "0",
//                 "engine_type": "Type 2",
//                 "fuel_type": "Type 2",
//                 "position": "P1.000000",
//                 "volume_per_cycle": "1.0",
//                 "FuelManagement": {},
//                 "SensorData": {}
//             }
//         ]
//     }
// ```
