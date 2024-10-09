import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type MainScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Main() {
  const {
    enginesData1,
    speed,
    enginesData2,
    resolvedService1,
    resolvedService2,
    setProvision,
    getSocketData,
  } = useSocket();
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<MainScreenProps['navigation']>();
  const [generatorRunning, setGeneratorRunning] = useState<'Yes' | 'No'>('Yes');
  const [confirmation, setConfirmation] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [prov, setProv] = useState<{timesp1: boolean; timesp2: boolean}>({
    timesp1: false,
    timesp2: false,
  });

  const sumOfBurn = useMemo(() => {
    return (
      Number(enginesData1[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData1[1]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData2[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData2[1]?.FuelManagement.total_fuel_burned || 0)
    );
  }, [
    enginesData1[0]?.FuelManagement.total_fuel_burned,
    enginesData1[1]?.FuelManagement.total_fuel_burned,
    enginesData2[0]?.FuelManagement.total_fuel_burned,
    enginesData2[1]?.FuelManagement.total_fuel_burned,
  ]);

  const remainingFuel = useMemo(() => {
    return (
      Number(enginesData1[0]?.FuelManagement.remaining_fuel || 0) +
      Number(enginesData1[1]?.FuelManagement.remaining_fuel || 0) +
      Number(enginesData2[0]?.FuelManagement.remaining_fuel || 0) +
      Number(enginesData2[1]?.FuelManagement.remaining_fuel || 0)
    );
  }, [
    enginesData1[0]?.FuelManagement.remaining_fuel,
    enginesData1[1]?.FuelManagement.remaining_fuel,
    enginesData2[0]?.FuelManagement.remaining_fuel,
    enginesData2[1]?.FuelManagement.remaining_fuel,
  ]);

  const speedEfficiency = useMemo(() => {
    const totalFuelBurned1 =
      Number(enginesData1[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData1[1]?.FuelManagement.total_fuel_burned || 0);
    const totalFuelBurned2 =
      Number(enginesData2[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData2[1]?.FuelManagement.total_fuel_burned || 0);

    const totalSpeed = Number(enginesData1[0]?.SensorData.speed || 0);

    const totalFuelBurned = totalFuelBurned1 + totalFuelBurned2;

    // Efficiency in knots per gallon
    return totalFuelBurned > 0 ? totalSpeed / totalFuelBurned : 0;
  }, [
    enginesData1[0]?.FuelManagement.total_fuel_burned,
    enginesData1[1]?.FuelManagement.total_fuel_burned,
    enginesData2[0]?.FuelManagement.total_fuel_burned,
    enginesData2[1]?.FuelManagement.total_fuel_burned,
    enginesData1[0]?.SensorData.speed,
    enginesData1[1]?.SensorData.speed,
    enginesData2[0]?.SensorData.speed,
    enginesData2[1]?.SensorData.speed,
  ]);

  const distanceToEmpty = useMemo(() => {
    return (
      Number(enginesData1[0]?.FuelManagement.distance_to_empty || 0) +
      Number(enginesData1[1]?.FuelManagement.distance_to_empty || 0) +
      Number(enginesData2[0]?.FuelManagement.distance_to_empty || 0) +
      Number(enginesData2[1]?.FuelManagement.distance_to_empty || 0)
    );
  }, [
    enginesData1[0]?.FuelManagement.distance_to_empty,
    enginesData1[1]?.FuelManagement.distance_to_empty,
    enginesData2[0]?.FuelManagement.distance_to_empty,
    enginesData2[1]?.FuelManagement.distance_to_empty,
  ]);

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
        navigation.navigate('Login');
        // const token = await AsyncStorage.getItem('token');
        // if (!token) {
        // } else {
        //   navigation.navigate('Setup');
        // }
      },
    },
  ];

  const fetchProvisionedDevices = async () => {
    if (resolvedService1)
      getSocketData(
        resolvedService1.host,
        resolvedService1.port,
        resolvedService1.name,
      );
    if (resolvedService2)
      getSocketData(
        resolvedService2.host,
        resolvedService2.port,
        resolvedService2.name,
      );
    // const currentProvision = await AsyncStorage.getItem('provisionedDevices');
    // console.log('curr prov: ', currentProvision);
    // const provisionedDevices = currentProvision
    //   ? JSON.parse(currentProvision)
    //   : {timesp1: false, timesp2: false};
    // setProv(provisionedDevices);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      if (showLoader) fetchProvisionedDevices();
    }, 7000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [showLoader]);

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
                width: '100%',
                justifyContent: 'center',
                gap: 20,
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
            <TouchableOpacity
              style={{alignSelf: 'flex-end', paddingRight: '4%'}}
              onPress={() => setShowLoader(true)}>
              <Ionicons name="reload" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            {resolvedService1 && (
              <View style={styles().GaugeRow}>
                {enginesData1.length ? (
                  enginesData1.map((item, index) => (
                    <MyGauge
                      key={item.id}
                      value={
                        item?.SensorData?.fuel
                          ? Number(item?.SensorData?.fuel)
                          : 0
                      }
                      name={`FMM1\n${item.position}`}
                    />
                  ))
                ) : showLoader ? (
                  <Loader size="large" />
                ) : (
                  <GapView length={10} />
                )}
              </View>
            )}
            <GapView length={20} />
            {resolvedService2 && (
              <View style={styles().GaugeRow}>
                {enginesData2.length ? (
                  enginesData2.map((item, index) => (
                    <MyGauge
                      key={item.id}
                      value={
                        item?.SensorData?.fuel
                          ? Number(item?.SensorData?.fuel)
                          : 0
                      }
                      name={`FMM2\n${item.position}`}
                    />
                  ))
                ) : showLoader ? (
                  <Loader size="large" />
                ) : (
                  <GapView length={10} />
                )}
              </View>
            )}
            <GapView length={20} />
            <View style={styles().container}>
              <View style={styles().row}>
                <MyBox
                  label="Efficiency"
                  text="Speed"
                  value={speedEfficiency.toFixed(2)}
                  unit="Knots"
                  width={'50%'}
                  gap={22}
                />
                <View style={styles().fuelBurn}>
                  <MyBox
                    text="Total Fuel Burn"
                    value={sumOfBurn}
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
                    value={remainingFuel}
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
                value={distanceToEmpty}
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
