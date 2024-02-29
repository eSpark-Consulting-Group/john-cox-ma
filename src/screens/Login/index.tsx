import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {MyHeader, MyText} from '../../components';
import {MyTheme} from '../../types';
import MyFooter from '../../components/MyFooter';

export default function Login() {
  const theme = useTheme() as MyTheme;
  return (
    <ScrollView style={[styles.container]}>
      <MyHeader />
      <MyFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
    height: '41%',
  },
  lowerGradient: {
    ...StyleSheet.absoluteFillObject,
    marginBottom: -20,
  },
});

{
  /* to be corrected */
}
//  <LinearGradient
//  colors={['#024796c1', '#37ae3755', 'transparent', 'transparent']}
//  start={[0.0, -0.5]}
//  end={[0.4, 1.2]}
//  locations={[0.1, 0.5, 0.6, 1]}
//  style={styles.linearGradient}
// />
// <LinearGradient
//  colors={['#02479665', '#37ae3760', 'transparent']}
//  start={{x: 0.1, y: 1.1}}
//  end={{x: 0, y: 0.9}}
//  locations={[0.1, 0.3, 0.8]}
//  style={styles.lowerGradient}
// />
