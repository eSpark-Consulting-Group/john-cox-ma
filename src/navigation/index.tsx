import React, {useEffect} from 'react';
import {ImageBackground, Platform, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamsList} from '../types/navigationParams';

import Login from '../screens/Login';
import Setup from '../screens/Setup';
import FMMSetup from '../screens/FMMSetup';
import Main from '../screens/Main';
import FuelTanks from '../screens/FuelTanks';
import Trips from '../screens/Trips';

import {DarkTheme} from '../theme';
import SplashScreen from 'react-native-splash-screen';

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export default function RootNav() {
  useEffect(() => {
    if (Platform.OS == 'android') SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer theme={DarkTheme}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Main"
          component={Main}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Setup"
          component={Setup}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="FMMSetup"
          component={FMMSetup}
          options={{
            headerShown: false,
          }}
        />

        <RootStack.Screen
          name="FuelTanks"
          component={FuelTanks}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="Trips"
          component={Trips}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
