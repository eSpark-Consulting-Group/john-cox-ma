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
    secondary?: string;
  };
};

type Fonts =
  | 'AnonymousPro-Bold'
  | 'AnonymousPro-Regular'
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
}

export interface MyInputProps {
  text?: string;
  onChange?: (val: string) => void;
  onChangeText?: (value: string) => void;
  width?: any;
  height?: any;
}

export interface LabelInputProps {
  text: string;
  size?: number;
  checkbox?: boolean;
  width?: DimensionValue | any;
  height?: DimensionValue | any;
}

export interface DropdownProps {
  data: string[];
  zIndex?: number;
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: ViewStyle;
  height?: number;
  theme: MyTheme;
}
