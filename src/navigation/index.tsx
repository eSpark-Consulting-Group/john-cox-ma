import React from 'react';
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

import {DarkTheme} from '../theme';
import {MyHeader} from '../components';

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export default function RootNav() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Login"
          component={Login}
          options={{
            header: props => <MyHeader />,
          }}
        />
        <RootStack.Screen
          name="Setup"
          component={Setup}
          options={{
            header: props => <MyHeader />,
          }}
        />
        <RootStack.Screen
          name="FMMSetup"
          component={FMMSetup}
          options={{
            header: props => <MyHeader />,
          }}
        />
        <RootStack.Screen
          name="Main"
          component={Main}
          options={{
            header: props => <MyHeader />,
          }}
        />
        <RootStack.Screen
          name="FuelTanks"
          component={FuelTanks}
          options={{
            header: props => <MyHeader />,
          }}
        />
        <RootStack.Screen
          name="Trips"
          component={Trips}
          options={{
            header: props => <MyHeader />,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
