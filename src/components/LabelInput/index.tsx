import {View} from 'react-native';
import {LabelInputProps} from '../../types';
import MyText from '../MyText';
import MyInput from '../MyInput';
import {memo} from 'react';
import {Checkbox} from '../../assets';
import MyCheckbox from '../MyCheckbox';

function LabelInput({
  text,
  size,
  checkbox,
  width,
  height,
  subText,
  password,
}: LabelInputProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <View style={{width: '30%'}}>
        <MyText text={text} size={size} />
        {subText && <MyText text={subText} fontFamily="AnonymousPro-Italic" />}
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 30,
          alignItems: 'center',
        }}>
        {/* todo: add checkbox component */}
        <MyInput width={width} height={height} password={password} />
        {checkbox && <MyCheckbox width={18} />}
      </View>
    </View>
  );
}

export default memo(LabelInput);
