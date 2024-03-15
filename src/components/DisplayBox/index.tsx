import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from '@react-navigation/native';

import MyText from '../MyText';

import {DisplayBoxProps, MyTheme} from '../../types';

function DisplayBox({
  value,
  textColor = 'white',
  size,
  fontFamily,
  paddingHorizontal,
  paddingVertical,
}: DisplayBoxProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View
      style={[
        styles(theme).displayBox,
        {
          paddingHorizontal: paddingHorizontal ? paddingHorizontal : 5,
          paddingVertical: paddingVertical ? paddingVertical : 5,
        },
      ]}>
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
      borderWidth: 2,
      borderColor: theme?.colors.paleBorder,
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
