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
  MySwitch,
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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <MyBox
          label="Efficiency"
          text="Speed"
          value={25.4}
          unit="Knots"
          width={128}
          height={75}
        />
        <MyBox
          text="Total Fuel Burn"
          value={102.1}
          unit="gal/hr"
          width={128}
          height={75}
        />
      </View>
      <MyBox
        text="Gallons per Nautical mile"
        value={41.7}
        width={186}
        height={76}
      />
      <View style={{flexDirection: 'row', gap: 20}}>
        <MyBox
          label="Range"
          text="Fuel Remaining"
          value={41.7}
          unit="gal"
          width={121}
          height={76}
        />
        <View
          style={{
            height: 96,
            justifyContent: 'space-between',
            paddingTop: 20,
            width: 100,
          }}>
          <MyText text="Generator Running" textColor={theme.colors.secondary} />
          <MyButton gradient label="Yes" />
        </View>
      </View>
      <MyBox
        text="Distance to Empty"
        value={205}
        width={186}
        height={76}
        unit="N.Mile"
      />
      <MySwitch label="1" />
      <MyFooter />
    </ScrollView>
  );
}

const styles = (theme: {theme?: MyTheme}) => StyleSheet.create({});
