import {View} from 'react-native';
import {LabelInputProps} from '../../types';
import MyText from '../MyText';
import MyInput from '../MyInput';
import {memo} from 'react';
import {Checkbox} from '../../assets';

function LabelInput({text, size, checkbox, width, height}: LabelInputProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <MyText text={text} size={size} />
      <MyInput width={width} height={height} />
      {checkbox && <Checkbox />}
    </View>
  );
}

export default memo(LabelInput);
