import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Feather} from '@expo/vector-icons';

import {useTheme} from '@react-navigation/native';
import {MyCheckboxProps, MyTheme} from '../../types';

const MyCheckbox = ({
  onChange,
  style,
  checkboxStyle,
  width,
}: MyCheckboxProps) => {
  const theme = useTheme() as MyTheme;
  const [checked, setChecked] = useState(false);

  const handlePress = () => {
    setChecked(!checked);
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={[styles.checkboxContainer, style, {width: width, height: width}]}>
      <View
        style={[
          styles.checkbox,
          checkboxStyle,
          checked && styles.checked,
          {
            backgroundColor: theme.dark ? '#70726F73' : '#f3f4f6',
            width: width,
            height: width,
          },
        ]}>
        {checked ? (
          <Feather name="check" size={width - 2} color={theme.colors.primary} />
        ) : (
          <Feather name="check" size={width - 2} color={'grey'} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  checkbox: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#136FA9',
  },
});

export default MyCheckbox;
