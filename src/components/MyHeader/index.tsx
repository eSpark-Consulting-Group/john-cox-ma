import React, {memo} from 'react';
import {Image, StatusBar, StyleSheet, View} from 'react-native';
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
          top: StatusBar.currentHeight
            ? -(62 / 2) - StatusBar?.currentHeight / 2 + 50
            : -(62 / 2) - 10 / 2 + 50,
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
    alignItems: 'center',
    width: '100%',
    top: 0,
    position: 'absolute',
  },
});

export default memo(MyHeader);
