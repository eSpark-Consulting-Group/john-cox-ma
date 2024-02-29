import React, {memo} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

import {MyInputProps, MyTheme} from '../../types';

function MyInput({text, onChange, width, height}: MyInputProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={styles({width, height}).container}>
      <TextInput
        value={text!}
        onChangeText={(val): void => onChange?.(val)}
        style={[
          styles({}).InputStyle,
          {
            color: theme.colors.primary,
          },
        ]}
      />
      <LinearGradient
        colors={['#72e14d89', 'transparent']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1.2}}
        style={[styles({}).outerGradient]}>
        <LinearGradient
          colors={['#88B6D8', '#3caaf944']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}
          style={styles({}).borderGradient}>
          <LinearGradient
            colors={['#233d1bdd', theme.colors.background]}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            style={styles({width, height}).innerGradient}
          />
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

export default memo(MyInput);

const styles = ({width, height}: {width?: any; height?: any}) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      width: width ? width : '100%',
      height: height ? height : 22,
    },
    InputStyle: {
      alignSelf: 'center',
      width: '100%',
      height: height ? height : 20,
      fontFamily: 'AnonymousPro-Bold',
      fontSize: 12,
      zIndex: 20,
      paddingVertical: 0,
      paddingHorizontal: 10,
    },
    outerGradient: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    borderGradient: {width: '97%', height: 20, alignItems: 'center'},
    innerGradient: {
      width: width ? width - 9 : '100%',
      height: height ? height - 5 : 16,
      margin: 2,
    },
  });
