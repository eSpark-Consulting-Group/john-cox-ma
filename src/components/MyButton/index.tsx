import {memo} from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import {MyButtonProps, MyTheme} from '../../types';
import MyText from '../MyText';
import {LinearGradient} from 'expo-linear-gradient';

function MyButton({
  label,
  onPress,
  textColor,
  backgroundColor,
  style,
  labelStyle,
  fontFamily = 'CrimsonText-Bold',
  gradient,
}: MyButtonProps) {
  const theme = useTheme() as MyTheme;
  const buttonStyle: ViewStyle = {
    backgroundColor: backgroundColor || '#B9F29E',
    flexDirection: 'row',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 30,
    borderWidth: 1.01,
    borderColor: '#066DB8',
    ...style,
  };

  const buttonTextStyle: TextStyle = {
    textAlign: 'center',
    width: '100%',
    ...labelStyle,
  };

  if (gradient) {
    return (
      <View style={[styles.gradientButton, style]}>
        <LinearGradient
          colors={['#88B6D8', theme.colors.background]}
          start={[0, 1]}
          end={[0.9, 1]}
          style={{borderRadius: 10}}>
          <TouchableOpacity
            style={{
              width: '95%',
              height: 30,
              margin: 1,
              borderRadius: 10,
              justifyContent: 'center',
            }}
            onPress={onPress}>
            <LinearGradient
              colors={['#4d92e16f', '#090824']}
              style={[styles.gradient]}
              start={[0.5, -0.5]}
              end={[0.5, 1]}
            />
            <MyText
              style={[{paddingBottom: 4}, buttonTextStyle]}
              fontFamily={fontFamily}
              textColor={textColor || theme.colors.primary}
              size={15}>
              {label}
            </MyText>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[buttonStyle, style]}>
      <MyText
        style={buttonTextStyle}
        fontFamily={fontFamily}
        textColor={textColor || '#066DB8'}
        size={12}>
        {label}
      </MyText>
    </TouchableOpacity>
  );
}

export default memo(MyButton);

const styles = StyleSheet.create({
  gradientButton: {
    width: '101%',
    height: 30,
    marginBottom: 5,
  },
  gradient: {
    borderRadius: 10,
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});
