import React, {memo} from 'react';
import {DimensionValue, StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import MyText from '../MyText';

import {MyTheme} from '../../types';

interface MyBoxProps {
  label?: string;
  text?: string | number;
  unit?: string;
  value?: number | string;
  width?: DimensionValue;
  gap?: number;
  textSize?: number;
  valueSize?: number;
  unitSize?: number;
}

function MyBox({
  label,
  text,
  unit,
  value,
  width,
  gap,
  textSize,
  unitSize,
  valueSize,
}: MyBoxProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={{width: width ? width : '100%', paddingVertical: 4}}>
      <View>
        <MyText
          textColor={theme.colors.secondary}
          fontFamily="NotoSans-Bold"
          size={16}>
          {label}
        </MyText>
      </View>

      <View
        style={[
          styles.box,
          {gap: gap ? gap : 15, borderColor: theme.colors.box},
        ]}>
        <MyText
          textColor={theme.colors.secondary}
          size={textSize ? textSize : 20}>
          {text}
        </MyText>
        <View style={styles.valueContainer}>
          <MyText
            fontFamily="NotoSans-Bold"
            style={styles.value}
            size={valueSize ? valueSize : 28}>
            {value ? Number(Number(value).toFixed(2)) : 'NA'}
          </MyText>
          <MyText
            style={styles.unit}
            fontFamily="NotoSans-Regular"
            size={unitSize ? unitSize : 16}>
            {unit}
          </MyText>
        </View>
      </View>
    </View>
  );
}

export default memo(MyBox);

const styles = StyleSheet.create({
  box: {
    borderWidth: 2.22,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  unit: {
    top: 2,
    marginTop: -10,
    left: 5,
  },
  valueContainer: {flexDirection: 'row', alignSelf: 'center'},
  value: {
    alignSelf: 'center',
  },
});
