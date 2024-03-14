import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  GapView,
  LabelInput,
  MyButton,
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
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      <GapView length={150} />
      <MyText
        text="Login"
        size={18}
        fontFamily="NotoSans-Bold"
        style={{alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20}}
      />
      <MyCard>
        <GapView length={10} />
        <LabelInput text="Username:" width={114} height={21} size={16} />
        <GapView length={20} />
        <LabelInput text="Password:" width={114} height={21} size={16} />
        <GapView length={30} />
        <MyButton
          label="Sign In"
          style={styles({}).signin}
          onPress={() => {
            console.log('setup pe jayein');
            navigation.navigate('Main');
          }}
        />
        <GapView length={30} />
      </MyCard>
      <GapView length={120} />
      <MyButton
        label="Back"
        style={styles({}).button}
        gradient
        onPress={() => console.log('go back')}
      />
      <GapView length={180} />
      <MyFooter />
    </ScrollView>
  );
}

const styles = (theme: {theme?: MyTheme}) =>
  StyleSheet.create({
    linearGradient: {
      ...StyleSheet.absoluteFillObject,
      height: '41%',
    },
    lowerGradient: {
      ...StyleSheet.absoluteFillObject,
      marginBottom: -20,
    },
    signin: {alignSelf: 'center'},
    button: {width: 130, alignSelf: 'center'},
  });

{
  /* to be corrected */
}
//  <LinearGradient
//  colors={['#024796c1', '#37ae3755', 'transparent', 'transparent']}
//  start={[0.0, -0.5]}
//  end={[0.4, 1.2]}
//  locations={[0.1, 0.5, 0.6, 1]}
//  style={styles.linearGradient}
// />
// <LinearGradient
//  colors={['#02479665', '#37ae3760', 'transparent']}
//  start={{x: 0.1, y: 1.1}}
//  end={{x: 0, y: 0.9}}
//  locations={[0.1, 0.3, 0.8]}
//  style={styles.lowerGradient}
// />
