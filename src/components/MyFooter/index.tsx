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
        size={12}
      />
      <FooterBadge />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 10,
    paddingTop: 15,
  },
});

export default memo(MyFooter);
