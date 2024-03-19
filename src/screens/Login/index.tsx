import React from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  GapView,
  LabelInput,
  MyButton,
  MyCanvas,
  MyCard,
  MyFooter,
  MyHeader,
  MyText,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';

type LoginScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Login() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<LoginScreenProps['navigation']>();

  return (
    <MyCanvas>
      <KeyboardAvoidingView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyHeader />
        <GapView length={150} />
        <MyText
          text="Login"
          size={20}
          fontFamily="NotoSans-Bold"
          style={{alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20}}
        />
        <MyCard>
          <GapView length={10} />
          <LabelInput text="Username:" width={114} height={21} size={18} />
          <GapView length={20} />
          <LabelInput text="Password:" width={114} height={21} size={18} />
          <GapView length={30} />
          <MyButton
            label="Sign In"
            style={styles().signin}
            onPress={() => {
              console.log('setup pe jayein');
              navigation.navigate('Setup');
            }}
          />
          <GapView length={30} />
        </MyCard>
        <GapView length={120} />
        <MyButton
          label="Back"
          style={styles().button}
          gradient
          onPress={() => navigation.navigate('Main')}
        />
        <GapView length={160} />
        <MyFooter />
      </KeyboardAvoidingView>
    </MyCanvas>
  );
}

const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    linearGradient: {
      ...StyleSheet.absoluteFillObject,
      height: 155,
    },
    lowerGradient: {
      ...StyleSheet.absoluteFillObject,
      marginBottom: -20,
    },
    signin: {alignSelf: 'center'},
    button: {width: 130, alignSelf: 'center'},
  });
