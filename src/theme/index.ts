import {DarkTheme as DT, DefaultTheme} from '@react-navigation/native';

const colors = {
  light: {
    primary: '#4BDB07',
    secondary: '#3CA9F9',
    background: '#FFFFFF',
    text: '#4BDB07',
    // border: '#E4E4E4',
    // notification: '#FFFFFF', //todo: set later
    // textSec: '#666666',
    // placeholder: '#888888',
    // statusBar: '#49ACE1',
    // focused: '#0F5D9F',
    // positive: '#ffffff',
    // negative: '#000000',
  },
  dark: {
    primary: '#4BDB07',
    secondary: '#0E3D5F',
    background: '#101010',
    text: '#4BDB07',
    // border: '#6F6F6F',
    // notification: '#FFFFFF', //todo: set later
    // textSec: '#FFFFFF',
    // placeholder: '#FFFFFF',
    // statusBar: '#29292E',
    // focused: '#49ACE1',
    // positive: '#000000',
    // negative: '#ffffff',
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
