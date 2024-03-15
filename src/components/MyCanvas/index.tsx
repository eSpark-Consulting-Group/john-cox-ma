import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

export default function MyCanvas({children}: {children: React.ReactNode}) {
  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assets/vectors/bg-png2x.png')}
      resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
