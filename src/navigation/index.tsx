import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamsList} from '../types/navigationParams';

import Trips from '../screens/Trips';

import {DarkTheme} from '../theme';
import WrappedStackNavigator from './WrappedStackNavigator';
import ServiceProvider from '../providers/ServiceProvider';
import { OrientationLocker, PORTRAIT} from "react-native-orientation-locker"

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export default function RootNav() {

  return (
    <>
    <OrientationLocker orientation={PORTRAIT} />
    <ServiceProvider>
      <NavigationContainer theme={DarkTheme}>
        <RootStack.Navigator initialRouteName="ScanDevices">
          <RootStack.Screen
            name="WithContext"
            component={WrappedStackNavigator}
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
    </ServiceProvider>
    </>
  );
}
