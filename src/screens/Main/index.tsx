import React, {useEffect, useState} from 'react';
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
  Loader,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {useSocket} from '../../components/SocketProvider';
import NauticalMile from './NauticalMilte';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MainScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Main() {
  const {
    enginesData1,
    fuelManagementData,
    fuelManagementData2,
    speed,
    enginesData2,
  } = useSocket();
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<MainScreenProps['navigation']>();
  const [generatorRunning, setGeneratorRunning] = useState<'Yes' | 'No'>('Yes');
  const [confirmation, setConfirmation] = useState(false);
  const [prov, setProv] = useState<{timesp1: boolean; timesp2: boolean}>({
    timesp1: false,
    timesp2: false,
  });
  const toggleGeneratorRunning = () => {
    setGeneratorRunning(generatorRunning === 'Yes' ? 'No' : 'Yes');
  };

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
      onPress: async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login');
        } else {
          navigation.navigate('Setup');
        }
      },
    },
  ];
  //loader pe timer aur refresh lagana he
  const fetchProvisionedDevices = async () => {
    const currentProvision = await AsyncStorage.getItem('provisionedDevices');
    console.log(currentProvision);
    const provisionedDevices = currentProvision
      ? JSON.parse(currentProvision)
      : {timesp1: false, timesp2: false};
    setProv(provisionedDevices);
  };

  useEffect(() => {
    fetchProvisionedDevices();
  }, []);

  console.log(enginesData1);

  return (
    <MyCanvas>
      <ScrollView
        contentContainerStyle={[styles().screen, {flex: confirmation ? 1 : 0}]}
        showsVerticalScrollIndicator={false}>
        <MyHeader />

        {confirmation ? (
          <>
            <MyText
              text="Are you sure you want to Re-provision?"
              size={26}
              style={styles().caption}
            />
            <MyText
              text="This will let you go through the process again"
              textColor={theme.colors.secondary}
              style={styles().subCaption}
            />
            <GapView length={55} />
            <View
              style={{
                width: '43%',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <MyButton
                label="NO"
                labelStyle={{fontSize: 20}}
                onPress={() => {
                  setConfirmation(false);
                  navigation.navigate('Main');
                }}
              />
              <MyButton
                label="YES"
                labelStyle={{fontSize: 20}}
                textColor={'red'}
                onPress={() => {
                  setConfirmation(false);
                  navigation.navigate('ScanDevices');
                }}
              />
            </View>
            <GapView length={90} />
          </>
        ) : (
          <>
            <GapView length={90} />
            {prov.timesp1 && (
              <View style={styles().GaugeRow}>
                {enginesData1.length ? (
                  enginesData1.map((item, index) => (
                    <MyGauge
                      key={item.id}
                      value={item.fuel ? +item.fuel : 0}
                      name={`FMM1\n${item.position}`}
                    />
                  ))
                ) : (
                  <Loader size="large" />
                )}
              </View>
            )}
            <GapView length={20} />
            {prov.timesp2 && (
              <View style={styles().GaugeRow}>
                {enginesData2.length ? (
                  enginesData2.map((item, index) => (
                    <MyGauge
                      key={item.id}
                      value={item.fuel ? +item.fuel : 0}
                      name={`FMM1\n${item.position}`}
                    />
                  ))
                ) : (
                  <Loader size="large" />
                )}
              </View>
            )}
            <GapView length={20} />
            <View style={styles().container}>
              <View style={styles().row}>
                <MyBox
                  label="Efficiency"
                  text="Speed"
                  value={speed}
                  unit="Knots"
                  width={'50%'}
                  gap={22}
                />
                <View style={styles().fuelBurn}>
                  <MyBox
                    text="Total Fuel Burn"
                    value={(
                      fuelManagementData.total_fuel_burned +
                      fuelManagementData2.total_fuel_burned
                    ).toString()}
                    unit="gal/hr"
                    width={'100%'}
                    gap={1}
                  />
                </View>
              </View>
              <NauticalMile />
              <View style={styles().range}>
                <View style={{width: '50%'}}>
                  <MyBox
                    label="Range"
                    text="Fuel Remaining"
                    value={
                      fuelManagementData.remaining_fuel +
                      fuelManagementData2.remaining_fuel
                    }
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
                    <MyButton
                      gradient
                      label={generatorRunning}
                      onPress={toggleGeneratorRunning}
                      labelStyle={{fontSize: 20}}
                    />
                  </View>
                </View>
              </View>
              <MyBox
                text="Distance to Empty"
                value={(
                  fuelManagementData.distance_to_empty +
                  fuelManagementData2.distance_to_empty
                ).toString()}
                unit="N.Mile"
                width={'70%'}
              />
            </View>

            <GapView length={40} />
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
            <GapView length={40} />
            <MyButton
              label="Re-Provision"
              labelStyle={{fontSize: 18}}
              onPress={() => {
                setConfirmation(true);
                // navigation.navigate('ScanDevies');
                // console.log('Device Setup pe jayein');
              }}
            />
            <GapView length={70} />
          </>
        )}

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
    },
    GaugeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '100%',
    },
    caption: {
      alignSelf: 'center',
      paddingVertical: 20,
      lineHeight: 30,
      width: '60%',
      textAlign: 'center',
      letterSpacing: 1,
    },
    subCaption: {alignSelf: 'center', textAlign: 'center', width: '75%'},
  });
