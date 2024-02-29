import {ColorValue, TextStyle, ViewStyle} from 'react-native';
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
  | 'NotoSerif-Regular';

export type MyTextProps = {
  text?: string;
  textColor?: string;
  style?: TextStyle;
  size?: number;
  fontFamily: Fonts;
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
