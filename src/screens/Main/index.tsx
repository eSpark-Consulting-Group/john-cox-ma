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
  MyCanvas,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';

type MainScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Main() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<MainScreenProps['navigation']>();

  const buttonsData = [
    {
      label: 'Main',
      labelStyle: {paddingVertical: 20, fontSize: 16},
      onPress: () => console.log('main'),
    },
    {
      label: 'Fuel Tanks',
      labelStyle: {fontSize: 16},
      onPress: () => navigation.navigate('FuelTanks'),
    },
    {
      label: 'Trips',
      labelStyle: {paddingVertical: 20, fontSize: 16},
      onPress: () => navigation.navigate('Trips'),
    },
    {
      label: 'Setup',
      labelStyle: {paddingVertical: 20, fontSize: 16},
      onPress: () => navigation.navigate('Login'),
    },
  ];

  return (
    <MyCanvas>
      <ScrollView
        contentContainerStyle={styles().screen}
        showsVerticalScrollIndicator={false}>
        <MyHeader />
        <GapView length={90} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MyGauge value={0} name="Engine1" />
          <MyGauge value={300} name="Engine2" />
        </View>
        <GapView length={20} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MyGauge value={150} name="Engine3" />
          <MyGauge value={250} name="Engine4" />
        </View>
        <GapView length={20} />
        <View style={styles().container}>
          <View style={styles().row}>
            <MyBox
              label="Efficiency"
              text="Speed"
              value={25.4}
              unit="Knots"
              width={'50%'}
              gap={22}
            />
            <View style={styles().fuelBurn}>
              <MyBox
                text="Total Fuel Burn"
                value={102.1}
                unit="gal/hr"
                width={'100%'}
                gap={1}
              />
            </View>
          </View>
          <MyBox text="Gallons per Nautical mile" value={4.17} width={'70%'} />
          <View style={styles().range}>
            <View style={{width: '50%'}}>
              <MyBox
                label="Range"
                text="Fuel Remaining"
                value={854}
                unit="gal"
              />
            </View>
            <View style={{width: '40%'}}>
              <View style={styles().box}>
                <MyText
                  text="Generator Running"
                  textColor={theme.colors.secondary}
                  size={18}
                />
                <MyButton gradient label="Yes" labelStyle={{fontSize: 20}} />
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
        <View style={styles().buttons}>
          {buttonsData.map((item, index) => (
            <MyButton
              key={index.toString()}
              gradient
              style={{width: '22%'}}
              label={item.label}
              labelStyle={item.labelStyle}
              onPress={item.onPress}
            />
          ))}
        </View>
        <GapView length={70} />
        <MyFooter />
      </ScrollView>
    </MyCanvas>
  );
}

const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    screen: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    container: {alignItems: 'center', width: '90%'},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fuelBurn: {paddingTop: 1, width: '50%'},
    range: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    box: {
      justifyContent: 'space-between',
      paddingTop: 25,
      gap: 20,
      width: '100%',
    },
    buttons: {
      flexDirection: 'row',
      width: '90%',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
  });
