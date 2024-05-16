import {DarkTheme as DT, DefaultTheme} from '@react-navigation/native';

const colors = {
  light: {
    primary: '#4BDB07',
    secondary: '#0E3D5F',
    background: '#FFFFFF',
    text: '#4BDB07',
    switch: '#ffff00',
    proSecondary: '#0E3D5F',
    semiSecondary: '#066DB8',
    pale: '#B9F29E',
    paleBorder: '#88B6D8',
    highlight: '#FAFF11',
    checkbox: '#f3f4f6',
    box: '#41759B',
  },
  dark: {
    primary: '#4BDB07',
    secondary: '#3CA9F9',
    proSecondary: '#0E3D5F',
    background: '#090824',
    text: '#4BDB07',
    switch: '#ffff00',
    semiSecondary: '#066DB8',
    pale: '#B9F29E',
    paleBorder: '#88B6D8',
    highlight: '#FAFF11',
    checkbox: '#70726F73',
    box: '#41759B',
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
