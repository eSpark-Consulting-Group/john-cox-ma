import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';

import MyText from '../MyText';

const MySwitch = ({label, value}: {label: string; value?: boolean}) => {
  const [isOn, setIsOn] = useState(value);

  const handlePress = () => {
    setIsOn(!isOn);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, {backgroundColor: isOn ? 'yellow' : '#396781'}]}>
      <MyText text={label} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 24,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default MySwitch;
