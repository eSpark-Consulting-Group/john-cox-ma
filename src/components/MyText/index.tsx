import React, {memo} from 'react';
import {Text, TextStyle, TextProps} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {MyTextProps} from '../../types';

function MyText({
  text,
  children,
  textColor,
  size,
  style,
  numberOfLines,
  fontFamily = 'AnonymousPro-Bold',
}: MyTextProps & TextProps) {
  const theme = useTheme();

  const textStyle: TextStyle = {
    color: textColor || theme.colors.text,
    fontSize: size || 18,
    fontFamily: fontFamily,
  };

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines}>
      {children || text}
    </Text>
  );
}

export default memo(MyText);
