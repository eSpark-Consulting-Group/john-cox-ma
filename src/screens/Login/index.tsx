import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MyText from '../../components/MyText';
import {Logo} from '../../assets';

export default function Login() {
  return (
    <View>
      <MyText fontFamily={'AnonymousPro-Bold'} size={20}>
        LOGIN{' '}
      </MyText>
      <Logo />
    </View>
  );
}

const styles = StyleSheet.create({});
