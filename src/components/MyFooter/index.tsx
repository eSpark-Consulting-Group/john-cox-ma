import React, {memo} from 'react';
import {useTheme} from '@react-navigation/native';
import {MyTheme} from '../../types';
import {StyleSheet, View} from 'react-native';
import MyText from '../MyText';
import {FooterBadge} from '../../assets';

function MyFooter() {
  const theme = useTheme() as MyTheme;
  return (
    <View style={styles.container}>
      <MyText
        fontFamily={'CrimsonText-Bold'}
        text="http://www.timbolier.com"
        textColor={theme.colors.secondary}
        size={16}
      />
      <FooterBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    bottom: 0,
    position: 'absolute',
  },
});

export default memo(MyFooter);
