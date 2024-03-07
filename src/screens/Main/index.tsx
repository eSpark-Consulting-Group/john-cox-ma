import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  MyButton,
  MyFooter,
  MyHeader,
  MyText,
  MyBox,
  GapView,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';

type MainScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Main() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<MainScreenProps['navigation']>();

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <MyHeader />
      <View style={{alignItems: 'center', width: '90%'}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
          <MyBox
            label="Efficiency"
            text="Speed"
            value={25.4}
            unit="Knots"
            width={'50%'}
            height={75}
          />
          <MyBox
            text="Total Fuel Burn"
            value={102.1}
            unit="gal/hr"
            width={'50%'}
            height={75}
          />
        </View>
        <MyBox
          text="Gallons per Nautical mile"
          value={41.7}
          width={'80%'}
          // width={186}
          height={76}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '50%'}}>
            <MyBox
              label="Range"
              text="Fuel Remaining"
              value={41.7}
              unit="gal"
              width={'100%'}
              height={76}
            />
          </View>
          <View style={{width: '40%'}}>
            <View
              style={{
                height: 96,
                justifyContent: 'space-between',
                paddingTop: 20,
                width: '100%',
              }}>
              <MyText
                text="Generator Running"
                textColor={theme.colors.secondary}
              />
              <MyButton gradient label="Yes" />
            </View>
          </View>
        </View>
        <MyBox
          text="Distance to Empty"
          value={205}
          width={'80%'}
          height={76}
          unit="N.Mile"
        />
      </View>

      <GapView length={20} />
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-between',
        }}>
        <MyButton gradient label="Main" style={{width: '22%'}} height={43} />
        <MyButton
          gradient
          label="Fuel Tanks"
          style={{width: '22%'}}
          height={43}
          onPress={() => navigation.navigate('FuelTanks')}
        />
        <MyButton
          gradient
          label="Trips"
          style={{width: '22%'}}
          height={43}
          onPress={() => navigation.navigate('Trips')}
        />
        <MyButton
          gradient
          label="Setup"
          style={{width: '22%'}}
          height={43}
          onPress={() => navigation.navigate('Setup')}
        />
      </View>
      <MyFooter />
    </ScrollView>
  );
}

const styles = (theme: {theme?: MyTheme}) => StyleSheet.create({});
