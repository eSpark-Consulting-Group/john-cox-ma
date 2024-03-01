import React from 'react';
import Login from '../screens/Login';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DarkTheme} from '../theme';
import Setup from '../screens/Setup';
import FMMSetup from '../screens/FMMSetup';
import {RootStackParamsList} from '../types/navigationParams';

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export default function RootNav() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <RootStack.Navigator>
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
