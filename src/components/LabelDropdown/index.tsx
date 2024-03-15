import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
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
}: LabelDropdownProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={styles.main}>
      <MyText text={text} size={size} />
      <View style={styles.inner}>
        {status ? isActive ? <Active /> : <Inactive /> : null}
        <MyDropdown
          data={data}
          onSelect={onSelect}
          theme={theme}
          zIndex={zIndex}
          style={style}
          containerStyle={containerStyle}
          height={height}
          dropdnHeight={dropdnHeight}
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
