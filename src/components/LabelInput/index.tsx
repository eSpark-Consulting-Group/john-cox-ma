import {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import MyText from '../MyText';
import MyInput from '../MyInput';
import MyCheckbox from '../MyCheckbox';

import {LabelInputProps} from '../../types';

function LabelInput({
  text,
  size,
  checkbox,
  width,
  height,
  subText,
  password,
  value,
  onFocus,
}: LabelInputProps) {
  return (
    <View style={styles.main}>
      <View style={{width: '30%'}}>
        <MyText text={text} size={size} />
        {subText && <MyText text={subText} fontFamily="AnonymousPro-Italic" />}
      </View>
      <View style={styles.inner}>
        <MyInput
          width={width}
          height={height}
          password={password}
          onFocus={onFocus}
        />
        {checkbox && <MyCheckbox width={18} value={value} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
  },
});

export default memo(LabelInput);
