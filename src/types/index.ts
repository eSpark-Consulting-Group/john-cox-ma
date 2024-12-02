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
  color?: string
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
  onSelect: (value: any) => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: ViewStyle;
  height?: number;
  status?: boolean;
  isActive?: boolean;
  dropdnHeight?: number;
  engineId?: string;
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
  current_fuel_consumption: number;
  distance_to_empty: number;
  total_fuel_burned: number;
};

export type SensorDataProps = {
  id: number;
  engine_id: number;
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
  Engines: EngineData[];
  speed: string;
  tanks: number[]
};

export type TripData = {
  id: 1 | 2 | 3;
  name: string;
  tripStarted?: boolean;
  tripEnded?: boolean;
  startingTime: Date | null;
  distanceCovered: number;
  tripTime: string;
  initialFuel: number[];
  fuelConsumption: number[]; // assuming it's an array of numbers
  tripEfficiency: number | undefined;
};

export type DistanceUnit = 'Kilometers' | 'Statute Miles' | 'Nautical Miles';
export type VolumeUnit = 'Gallons' | 'Liters' ;
export type TimeFormat = '12' | '24' ;
