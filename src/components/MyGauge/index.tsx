import React from 'react';
import {View} from 'react-native';
import Speedometer, {Marks} from 'react-native-cool-speedometer';
import MyText from '../MyText';

interface Mark {
  value: number;
  position: number;
}

interface MyGaugeProps {
  value: number;
  max: number;
  marks: Mark[];
}

const MyGauge = ({value, max, marks}: MyGaugeProps) => {
  return <View style={{alignItems: 'center'}}></View>;
};

export default MyGauge;
