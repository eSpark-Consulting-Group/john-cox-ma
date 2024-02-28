import React from 'react';
import {StyleSheet, View} from 'react-native';

import {MyText} from '../../components';
import {Logo} from '../../assets';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from '@react-navigation/native';
import {MyTheme} from '../../types';

export default function Login() {
  const theme = useTheme() as MyTheme;
  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={['#024796', '#37ae374e']}
        start={{x: 0.5, y: 0.5}}
        end={{x: 0.5, y: 0.9}}
        style={styles.linearGradient}
      />
      <View style={{paddingLeft: 25, paddingTop: 20, opacity: 0.2}}>
        {/* <MyText fontFamily={'AnonymousPro-Bold'}>jkfsdbfjkbds</MyText> */}
        <Logo />
      </View>
      {/* <LinearGradient
        colors={['#0247966e', '#37ae37']}
        style={styles.lowerGradient}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
    height: '30%',
  },
  lowerGradient: {
    ...StyleSheet.absoluteFillObject,
    height: '5%',
  },
});
