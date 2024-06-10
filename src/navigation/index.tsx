import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamsList} from '../types/navigationParams';

import Login from '../screens/Login';
import Setup from '../screens/Setup';
import FMMSetup from '../screens/FMMSetup';
import Main from '../screens/Main';
import FuelTanks from '../screens/FuelTanks';
import Trips from '../screens/Trips';
import DeviceSetup from '../screens/DeviceSetup';

import {DarkTheme} from '../theme';
import Test from '../screens/TestScreen';
import SocketProvider from '../components/SocketProvider';

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export default function RootNav() {
  // const [initialRoute, setInitialRoute] = useState('DeviceSetup');
  useEffect(() => {}, []);
  return (
    <SocketProvider>
      <NavigationContainer theme={DarkTheme}>
        <RootStack.Navigator initialRouteName="DeviceSetup">
          <RootStack.Screen
            name="DeviceSetup"
            component={DeviceSetup}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Test"
            component={Test}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Main"
            component={Main}
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
            name="Setup"
            component={Setup}
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
    </SocketProvider>
  );
}

const styles = StyleSheet.create({});
