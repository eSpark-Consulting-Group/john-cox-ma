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

type SetupScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Setup() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<SetupScreenProps['navigation']>();

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <MyHeader />
      <MyText
        text="Setup"
        size={18}
        fontFamily="NotoSans-Bold"
        style={{alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20}}
      />
      <MyCard>
        <GapView length={10} />
        <LabelInput text="Volume:" width={114} height={21} size={16} />
        <GapView length={20} />
        <LabelInput text="Distance:" width={114} height={21} size={16} />
        <GapView length={30} />
      </MyCard>
      <MyButton
        label="Fuel Mgt Module Setup"
        style={styles({}).signin}
        onPress={() => {
          navigation.navigate('FMMSetup');
          console.log('Fuel Mgt pe jayein');
        }}
      />
      <GapView length={120} />
      <MyButton
        label="Back"
        style={styles({}).button}
        onPress={() => {
          navigation.navigate('Login');
          console.log('Wapis jayein');
        }}
        gradient
      />
      <MyFooter />
    </ScrollView>
  );
}

const styles = (theme: {theme?: MyTheme}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    linearGradient: {
      ...StyleSheet.absoluteFillObject,
      height: '41%',
    },
    lowerGradient: {
      ...StyleSheet.absoluteFillObject,
      marginBottom: -20,
    },
    signin: {width: 130, alignSelf: 'center'},
    button: {width: 130, alignSelf: 'center'},
  });
