import {memo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import MyText from '../MyText';
import MyDropdown from '../MyDropdown';

import {Active, Inactive} from '../../assets';
import {LabelDropdownProps, MyTheme} from '../../types';

function LabelDropdown({
  text,
  size,
  data,
  zIndex,
  onSelect,
  style,
  containerStyle,
  height,
  status,
  isActive,
  dropdnHeight,
  egnineId,
  onPress,
  value,
}: LabelDropdownProps) {
  const theme = useTheme() as MyTheme;
  const activeHanlder = () => {
    if (onPress) {
      onPress(egnineId);
    }
  };
  return (
    <View style={styles.main}>
      <MyText text={text} size={size} />
      <View style={styles.inner}>
        {status && (
          <TouchableOpacity onPress={activeHanlder}>
            {isActive ? <Active /> : <Inactive />}
          </TouchableOpacity>
        )}
        <MyDropdown
          data={data}
          onSelect={onSelect}
          theme={theme}
          zIndex={zIndex}
          style={style}
          containerStyle={containerStyle}
          height={height}
          dropdnHeight={dropdnHeight}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
});

export default memo(LabelDropdown);
