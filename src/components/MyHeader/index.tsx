import React, {memo} from 'react';
import {useTheme} from '@react-navigation/native';
import {MyTheme} from '../../types';
import {StyleSheet, View} from 'react-native';
import {HeaderLogo} from '../../assets';
import MyText from '../MyText';

function MyHeader() {
  const theme = useTheme() as MyTheme;
  return (
    <View style={styles.container}>
      <HeaderLogo style={{}} />
      <MyText
        fontFamily={'NotoSerif-Bold'}
        text="Fuel Management"
        textColor={theme.colors.secondary}
        size={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
});

export default memo(MyHeader);
