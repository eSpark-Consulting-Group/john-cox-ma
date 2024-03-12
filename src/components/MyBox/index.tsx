import React from 'react';
import {DimensionValue, StyleSheet, View} from 'react-native';
import MyText from '../MyText';
import {useTheme} from '@react-navigation/native';
import {MyTheme} from '../../types';

interface MyBoxProps {
  label?: string;
  text?: string | number;
  unit?: string;
  value?: number;
  width?: DimensionValue;
  gap?: number;
}

export default function MyBox({
  label,
  text,
  unit,
  value,
  width,
  gap,
}: MyBoxProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={{width: width ? width : '100%', paddingVertical: 4}}>
      <View style={styles.labelContainer}>
        <MyText
          textColor={theme.colors.secondary}
          fontFamily="NotoSans-Bold"
          size={16}>
          {label}
        </MyText>
      </View>

      <View style={[styles.box, {gap: gap ? gap : 15}]}>
        <MyText
          textColor={theme.colors.secondary}
          style={styles.text}
          size={20}>
          {text}
        </MyText>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <MyText fontFamily="NotoSans-Bold" style={styles.value} size={28}>
            {value}
          </MyText>
          <MyText style={styles.unit} fontFamily="NotoSans-Regular" size={16}>
            {unit}
          </MyText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    // height: 17,
  },
  box: {
    borderWidth: 2.22,
    borderColor: '#41759B',
    width: '100%',
    paddingHorizontal: 20,
    // alignItems: 'center',
    paddingVertical: 5,
  },
  text: {
    // height: 30,
  },
  unit: {
    // alignSelf: 'flex-end',
    // left: 100,
    top: 2,
    marginTop: -10,
    left: 5,
  },
  value: {
    alignSelf: 'center',
    // position: 'absolute',
    // bottom: -2,
  },
});
