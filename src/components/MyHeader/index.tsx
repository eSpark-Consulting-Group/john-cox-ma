import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import MyText from '../MyText';

import {MyTheme} from '../../types';
import {HeaderLogo} from '../../assets';

function MyHeader() {
  const theme = useTheme() as MyTheme;
  return (
    <View style={[styles.container]}>
      <HeaderLogo style={{}} />
      <MyText
        fontFamily={'NotoSerif-Bold'}
        text="Fuel Management"
        textColor={theme.colors.secondary}
        size={24}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 15,
    top: 0,
    position: 'absolute',
  },
});

export default memo(MyHeader);
