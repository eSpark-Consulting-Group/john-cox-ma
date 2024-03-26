import React, {memo, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

import MyText from '../MyText';

import {MyTheme} from '../../types';

const MySwitch = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}) => {
  const theme = useTheme() as MyTheme;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {backgroundColor: isActive ? theme.colors.switch : 'transparent'},
      ]}>
      {!isActive && (
        <LinearGradient
          colors={[theme.colors.secondary, theme.colors.background]}
          style={[styles.gradient]}
          start={[0, 0.2]}
          end={[1, 1.2]}
        />
      )}
      <MyText text={label} size={18} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  gradient: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});

export default memo(MySwitch);
