import React from 'react';
import {DimensionValue, StyleSheet, View} from 'react-native';
import MyText from '../MyText';
import {useTheme} from '@react-navigation/native';
import {MyTheme} from '../../types';

interface MyBoxProps {
  label?: string;
  text?: string;
  unit?: string;
  value?: number;
  width: DimensionValue | undefined;
  height: number;
}
export default function MyBox({
  label,
  text,
  unit,
  value,
  width,
  height,
}: MyBoxProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={{width: width, height: height + 20}}>
      <View style={{height: 17}}>
        <MyText textColor={theme.colors.secondary} fontFamily="NotoSans-Bold">
          {label}
        </MyText>
      </View>

      <View style={[styles({theme}).box, {height: height}]}>
        <MyText textColor={theme.colors.secondary} style={{height: 30}}>
          {text}
        </MyText>
        {unit && (
          <MyText style={styles({theme}).unit} fontFamily="NotoSans-Regular">
            {unit}
          </MyText>
        )}
        <MyText
          fontFamily="NotoSans-Bold"
          style={styles({theme}).val}
          size={26}>
          {value}
        </MyText>
      </View>
    </View>
  );
}

const styles = (theme: {theme?: MyTheme}) =>
  StyleSheet.create({
    box: {
      borderWidth: 2.22,
      borderColor: '#41759B',
      width: '100%',
      paddingVertical: 4,
      paddingHorizontal: 11,
    },
    unit: {alignSelf: 'flex-end', bottom: 10},
    val: {alignSelf: 'center', position: 'absolute', bottom: -5},
  });
