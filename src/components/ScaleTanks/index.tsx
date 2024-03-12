import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

import MyText from '../MyText';
import GapView from '../GapView';

import {MyTheme} from '../../types';
import DisplayBox from '../DisplayBox';

interface FuelData {
  number: number;
  value: number;
  volume: number;
}

interface ScaleTanksProps {
  fuelData: FuelData[];
}

function ScaleTanks({fuelData}: ScaleTanksProps) {
  const theme = useTheme() as MyTheme;
  const marks = [
    'Full',
    '7/8',
    '3/4',
    '5/8',
    '1/2',
    '3/8',
    '1/4',
    '1/8',
    'Empty',
  ];

  function calcHeight(value: number): number {
    return value * 300;
  }

  return (
    <View style={{width: '100%', flexDirection: 'row'}}>
      <View style={{width: '20%'}}>
        <MyText
          text="Tank"
          size={18}
          textColor={theme.colors.secondary}
          style={{paddingBottom: 15}}
        />
        {marks.map((item, index) => (
          <MyText
            text={item}
            size={16}
            style={{paddingBottom: 17.5}}
            key={index}
          />
        ))}
        <MyText text="Fuel Volume" size={16} style={{paddingBottom: 10}} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
        }}>
        {fuelData.map((item, index) => (
          <View>
            <MyText
              text={item.number.toString()}
              size={18}
              textColor={theme.colors.secondary}
              style={{paddingBottom: 15, alignSelf: 'center'}}
            />
            <View
              style={{
                width: 45,
                height: 300,
                borderWidth: 1,
                borderColor: theme.colors.secondary,
              }}
              key={index}>
              <LinearGradient
                colors={['#131313', '#4e4e4e', '#131313']}
                start={[0, 1]}
                end={[1, 0]}
                style={{
                  ...StyleSheet.absoluteFillObject,
                }}
              />
              <View
                style={{
                  width: '100%',
                  height: calcHeight(item.value),
                  position: 'absolute',
                  bottom: 0,
                }}>
                <LinearGradient
                  colors={['#23FBFB', '#1d1818']}
                  start={[1, 0]}
                  end={[1, 1]}
                  style={{
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: theme.colors.secondary,
                    ...StyleSheet.absoluteFillObject,
                  }}
                />
              </View>
            </View>
            <View style={{alignItems: 'center', paddingVertical: 15}}>
              <DisplayBox
                value={item.volume.toString()}
                fontFamily={'CrimsonText-Bold'}
                textColor={theme.colors.primary}
                size={19}
                paddingHorizontal={10}
              />
              <MyText fontFamily="AnonymousPro-Regular" style={{marginTop: -6}}>
                gal
              </MyText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default ScaleTanks;
