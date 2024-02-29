import {DarkTheme as DT, DefaultTheme} from '@react-navigation/native';

const colors = {
  light: {
    primary: '#4BDB07',
    secondary: '#0E3D5F',
    background: '#FFFFFF',
    text: '#4BDB07',
  },
  dark: {
    primary: '#4BDB07',
    secondary: '#3CA9F9',
    background: '#090824',
    text: '#4BDB07',
  },
};

const LightTheme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, ...colors.light},
};

const DarkTheme = {
  ...DT,
  colors: {...DT.colors, ...colors.dark},
};

export {colors, LightTheme, DarkTheme};
