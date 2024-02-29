import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {
  GapView,
  LabelInput,
  MyButton,
  MyCard,
  MyFooter,
  MyHeader,
} from '../../components';
import {MyTheme} from '../../types';

export default function Login() {
  const theme = useTheme() as MyTheme;
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <MyHeader />
      <MyCard>
        <GapView length={10} />
        <LabelInput text="Username:" width={114} height={21} size={16} />
        <GapView length={20} />
        <LabelInput text="Password:" width={114} height={21} size={16} />
        <GapView length={30} />
        <MyButton label="Sign In" style={styles({}).signin} />
        <GapView length={30} />
      </MyCard>
      <GapView length={30} />
      <MyButton label="Back" style={styles({}).button} gradient />
      <MyFooter />
    </ScrollView>
  );
}

const styles = (theme: {theme?: MyTheme}) =>
  StyleSheet.create({
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
    signin: {width: 79, alignSelf: 'center'},
    button: {width: 130, alignSelf: 'center'},
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
