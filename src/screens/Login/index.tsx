import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MyText from '../../components/MyText';
import {Logo} from '../../assets';
import {MyTheme} from '../../types';
import {useTheme} from '@react-navigation/native';

export default function Login() {
  const theme = useTheme() as MyTheme;
  return (
    <View style={{backgroundColor: theme.colors.text}}>
      <Logo />
    </View>
  );
}

const styles = StyleSheet.create({});
