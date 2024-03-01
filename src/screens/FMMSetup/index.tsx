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

type FMMSetupScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function FMMSetup() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<FMMSetupScreenProps['navigation']>();

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <MyHeader />
      <MyText
        text="Fuel Mgt Module Setup"
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

      <GapView length={120} />
      <MyButton
        label="Back"
        style={styles({}).button}
        gradient
        onPress={() => {
          navigation.navigate('Setup');
          console.log('Wapis jayein');
        }}
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
    signin: {width: 79, alignSelf: 'center'},
    button: {width: 130, alignSelf: 'center'},
  });
