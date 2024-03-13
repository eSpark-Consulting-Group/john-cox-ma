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
      <MyText text={label} size={16} />
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
});

export default MySwitch;
