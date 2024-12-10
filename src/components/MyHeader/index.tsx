import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import MyText from '../MyText';

import {MyTheme} from '../../types';
import {HeaderLogo, SplashIcon} from '../../assets';

function MyHeader() {
  const theme = useTheme() as MyTheme;

  return (
    <View style={[styles.container]}>
      <Image
        source={SplashIcon}
        style={{
          left: -(77 / 2) + 60,
          top: -(62 / 2) - 11 + 50,
          width: 77,
          height: 62,
        }}
      />
      <MyText
        fontFamily={'NotoSerif-Bold'}
        text="Fuel Management"
        textColor={theme.colors.secondary}
        style={{marginLeft: -(77 / 2) + 60 + 15, top: -(62 / 2) - 11 + 50 + 5}}
        size={24}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // paddingHorizontal: 10,
    // paddingTop: 20,
    top: 0,
    position: 'absolute',
  },
});

export default memo(MyHeader);
