import {useTheme} from '@react-navigation/native';
import React, {memo} from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import {MyTheme} from '../../types';

const Loader = ({
  size = 'large',
  color,
  style,
}: {
  size: 'large' | 'small';
  color?: string;
  style?: ViewStyle;
}) => {
  const theme = useTheme() as MyTheme;
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={color ? color : theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(Loader);
