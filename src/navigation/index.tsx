import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';

import {RootStackParamsList} from '../types/navigationParams';

import Login from '../screens/Login';
import Setup from '../screens/Setup';
import FMMSetup from '../screens/FMMSetup';
import Main from '../screens/Main';
import FuelTanks from '../screens/FuelTanks';
import Trips from '../screens/Trips';

import {DarkTheme} from '../theme';
import Test from '../screens/TestScreen';
import SocketProvider from '../components/SocketProvider';
import ScanDevices from '../screens/Provisioning/ScanDevices';
import Proof from '../screens/Provisioning/Proof';
import ScanNetworks from '../screens/Provisioning/ScanNetworks';
import Confirmation from '../screens/Provisioning/Confirmation';
import store from '../app/store';

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export default function RootNav() {
  useEffect(() => {}, []);

  return (
    <Provider store={store}>
      <SocketProvider>
        <NavigationContainer theme={DarkTheme}>
          <RootStack.Navigator initialRouteName="ScanDevices">
            <RootStack.Screen
              name="ScanDevices"
              component={ScanDevices}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="Proof"
              component={Proof}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="ScanNetworks"
              component={ScanNetworks}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="Confirmation"
              component={Confirmation}
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
    </Provider>
  );
}

const styles = StyleSheet.create({});
