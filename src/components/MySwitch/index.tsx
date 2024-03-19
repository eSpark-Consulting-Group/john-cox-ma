import React, {memo, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

import MyText from '../MyText';

import {MyTheme} from '../../types';

const MySwitch = ({label, value}: {label: string; value?: boolean}) => {
  const [isOn, setIsOn] = useState(value);
  const theme = useTheme() as MyTheme;

  const handlePress = () => {
    setIsOn(!isOn);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        {backgroundColor: isOn ? theme.colors.switch : 'transparent'},
      ]}>
      {!isOn && (
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
