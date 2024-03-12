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
  MyGauge,
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
      }}>
      <MyHeader />
      <GapView length={90} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <MyGauge value={0} name="Engine1" />
        <MyGauge value={500} name="Engine2" />
      </View>
      <GapView length={20} />
      <View style={{alignItems: 'center', width: '90%'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MyBox
            label="Efficiency"
            text="Speed"
            value={25.4}
            unit="Knots"
            width={'50%'}
            gap={22}
          />
          <View style={{paddingTop: 1, width: '50%'}}>
            <MyBox
              text="Total Fuel Burn"
              value={102.1}
              unit="gal/hr"
              width={'100%'}
              gap={1}
            />
          </View>
          {/* </View> */}
        </View>
        <MyBox text="Gallons per Nautical mile" value={4.17} width={'70%'} />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '50%'}}>
            <MyBox label="Range" text="Fuel Remaining" value={854} unit="gal" />
          </View>
          <View style={{width: '40%'}}>
            <View
              style={{
                // height: 96,
                justifyContent: 'space-between',
                paddingTop: 25,
                gap: 20,
                width: '100%',
              }}>
              <MyText
                text="Generator Running"
                textColor={theme.colors.secondary}
                size={18}
              />
              <MyButton
                gradient
                label="Yes"
                // height={30}
                labelStyle={{fontSize: 20}}
              />
            </View>
          </View>
        </View>
        <MyBox
          text="Distance to Empty"
          value={205}
          unit="N.Mile"
          width={'70%'}
        />
      </View>

      <GapView length={20} />
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-between',
          height: '10%',
        }}>
        <MyButton
          gradient
          label="Main"
          style={{width: '22%'}}
          height={'100%'}
        />
        <MyButton
          gradient
          label="Fuel Tanks"
          style={{width: '22%'}}
          onPress={() => navigation.navigate('FuelTanks')}
        />
        <MyButton
          gradient
          label="Trips"
          style={{width: '22%'}}
          onPress={() => navigation.navigate('Trips')}
        />
        <MyButton
          gradient
          label="Setup"
          style={{width: '22%'}}
          onPress={() => navigation.navigate('Setup')}
        />
      </View>
      <GapView length={70} />
      <MyFooter />
    </ScrollView>
  );
}

const styles = (theme: {theme?: MyTheme}) => StyleSheet.create({});
