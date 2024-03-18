import React, {useState} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNSpeedometer from 'react-native-speedometer';

import MyText from '../MyText';

import {MyTheme} from '../../types';
import {Abcd} from '../../assets';

interface MyGaugeProps {
  value?: number;
  name: string;
}

function MyGauge({value = 0, name}: MyGaugeProps) {
  const theme = useTheme() as MyTheme;

  return (
    <View
      style={{
        alignItems: 'center',
        paddingTop: 10,
        marginRight: -5,
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{position: 'absolute', top: -23, right: -18}}>
          <Abcd />
        </View>
        <MyText
          text={name}
          fontFamily="CrimsonText-Bold"
          size={18}
          style={{position: 'absolute', bottom: 45, right: 47}}
        />
        <RNSpeedometer
          key={name}
          value={value}
          size={170}
          minValue={0}
          maxValue={300}
          labels={['']}
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 5,
          borderWidth: 2,
          borderColor: theme.colors.secondary,
          paddingHorizontal: 1,
          paddingVertical: 5,
          width: '80%',
        }}>
        <MyText fontFamily="NotoSans-Bold" size={30}>
          {value.toString()}
        </MyText>
        <MyText fontFamily="NotoSans-Regular" size={18}>
          gal/hr
        </MyText>
      </View>
    </View>
  );
}

export default MyGauge;
