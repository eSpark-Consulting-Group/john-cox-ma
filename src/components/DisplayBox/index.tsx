import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from '@react-navigation/native';

import MyText from '../MyText';

import {DisplayBoxProps, Fonts, MyTheme} from '../../types';

function DisplayBox({
  value,
  width = 58,
  height = 27,
  textColor = 'white',
  size,
  fontFamily,
}: DisplayBoxProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={[styles(theme).displayBox, {width, height}]}>
      <LinearGradient
        colors={['#4d92e16f', '#090824']}
        style={styles().gradient}
        start={[0.5, -0.5]}
        end={[0.5, 1]}
      />
      <MyText textColor={textColor} size={size} fontFamily={fontFamily}>
        {value}
      </MyText>
    </View>
  );
}

export default memo(DisplayBox);

const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    displayBox: {
      borderWidth: 1,
      borderColor: theme?.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    gradient: {
      justifyContent: 'center',
      alignItems: 'center',
      ...StyleSheet.absoluteFillObject,
    },
  });
