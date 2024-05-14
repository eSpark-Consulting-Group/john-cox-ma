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
  value?: string;
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
  value: string;
  width?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  height?: number;
  textColor?: string;
  size?: number;
  fontFamily?: Fonts;
};
