import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNSpeedometer from 'react-native-speedometer';

import MyText from '../MyText';

import {MyTheme} from '../../types';
import {Gauge} from '../../assets';

interface MyGaugeProps {
  value?: number;
  name: string;
}

function MyGauge({value = 0, name}: MyGaugeProps) {
  const theme = useTheme() as MyTheme;

  return (
    <View style={styles().main}>
      <View style={styles().container}>
        <View style={{position: 'absolute', top: -23, right: -18}}>
          <Gauge />
        </View>
        <MyText
          text={name}
          fontFamily="CrimsonText-Bold"
          size={18}
          style={styles().name}
        />
        <RNSpeedometer
          value={value}
          size={170}
          minValue={0}
          maxValue={300}
          labels={[
            {
              name: '',
            },
          ]}
          labelStyle={{
            color: 'transparent',
          }}
          innerCircleStyle={{backgroundColor: 'transparent'}}
          outerCircleStyle={{backgroundColor: 'transparent'}}
          halfCircleStyle={{
            backgroundColor: 'transparent',
          }}
          needleStyle={{backgroundColor: theme.colors.secondary}}
          wrapperStyle={{width: 170, height: 170}}
          wrapperBackground={'transparent'}
        />
      </View>
      <View style={styles(theme).textBox}>
        <MyText fontFamily="NotoSans-Bold" size={30}>
          {value.toFixed(3)}
        </MyText>
        <MyText fontFamily="NotoSans-Regular" size={18}>
          gal/hr
        </MyText>
      </View>
    </View>
  );
}
const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    main: {
      alignItems: 'center',
      paddingTop: 10,
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      position: 'absolute',
      bottom: 39,
      right: 35,
      width: 80,
    },
    textBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
      borderWidth: 2,
      borderColor: theme?.colors.box,
      paddingHorizontal: 1,
      paddingVertical: 5,
      width: 175,
    },
  });

export default memo(MyGauge);
