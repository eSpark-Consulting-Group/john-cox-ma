import {TextStyle} from 'react-native';
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
