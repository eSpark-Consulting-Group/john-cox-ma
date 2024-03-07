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
import {Engines, temp} from '../../constants';
import LabelDropdown from '../../components/LabelDropdown';

type SetupScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Setup() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<SetupScreenProps['navigation']>();

  return (
    <ScrollView contentContainerStyle={styles({}).screen}>
      <MyHeader />
      <GapView length={90} />
      <MyText
        text="Setup"
        size={18}
        fontFamily="NotoSans-Bold"
        style={styles({}).title}
      />
      <View style={{zIndex: 7}}>
        <MyCard>
          <GapView length={15} />
          {temp.map((item, index) => (
            <>
              <LabelDropdown
                key={index}
                text={item.text}
                data={item.options}
                onSelect={() => {}}
                zIndex={item.zindez}
              />
              <GapView length={index != 3 ? 20 : 15} />
            </>
          ))}
        </MyCard>
      </View>
      <GapView length={15} />
      <View style={{zIndex: 6}}>
        <MyCard>
          <GapView length={10} />
          <View style={styles({}).card2}>
            {['Engines', 'Active', 'Position'].map((item, index) => (
              <MyText
                key={index}
                text={item}
                fontFamily="NotoSans-BoldItalic"
              />
            ))}
          </View>
          {Engines.map((item, index) => (
            <>
              <LabelDropdown
                key={index}
                text={item.text}
                data={item.options}
                onSelect={() => {}}
                isActive={item.status}
                zIndex={item.zindez}
                status
              />
              <GapView length={index != 3 ? 20 : 15} />
            </>
          ))}
        </MyCard>
      </View>
      <GapView length={15} />

      <View style={{zIndex: 5}}>
        <MyCard>
          <GapView length={15} />
          <LabelDropdown
            data={[
              'Opt:1 No Gen. Present',
              'Opt:2 Genset fuel measured',
              'Opt:3 Genset fuel flow estimated',
            ]}
            text="Generator Config"
            onSelect={() => {}}
            zIndex={54}
            dropdnHeight={170}
          />
          <GapView length={5} />
          <View style={styles({}).fuelBurn}>
            <MyText
              text="Generator Fuel burn when in use "
              style={{width: '50%'}}
            />
            {/* todo: component confusion** */}
            <View
              style={{width: 114, height: 20, backgroundColor: '#70726F73'}} //temp
            />
          </View>
          <LabelDropdown
            data={['N2k SOG', 'N2k SOW', 'UI Device GPS']}
            text="Speed Source"
            onSelect={() => {}}
            zIndex={52}
          />
          <View style={{width: '100%'}}>
            <MyText
              text="Fuel Mgt Module Connection"
              fontFamily="NotoSans-BoldItalic"
            />
            <LabelInput
              text="IP Address"
              subText="FMM #1"
              checkbox
              width={100}
            />
            <GapView length={10} />
            <LabelInput
              text="IP Address"
              subText="FMM #2"
              checkbox
              width={100}
            />
            <GapView length={10} />
            <MyText text="Wifi Setup" fontFamily="NotoSans-BoldItalic" />
            <LabelInput text="Access Point Name" checkbox width={100} />
            <GapView length={10} />
            <LabelInput text="Password" checkbox width={100} password />
            <GapView length={10} />
          </View>
        </MyCard>
      </View>
      <GapView length={30} />
      <MyButton
        label="Fuel Mgt Module Setup"
        style={styles({}).signin}
        onPress={() => {
          navigation.navigate('FMMSetup');
          console.log('Fuel Mgt pe jayein');
        }}
      />
      <GapView length={25} />
      <MyButton
        label="Back"
        style={styles({}).button}
        onPress={() => {
          navigation.navigate('Login');
          console.log('Wapis jayein');
        }}
        gradient
      />
      <GapView length={70} />
      <MyFooter />
    </ScrollView>
  );
}

const styles = (theme: {theme?: MyTheme}) =>
  StyleSheet.create({
    screen: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20},
    card2: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    fuelBurn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    signin: {width: 130, alignSelf: 'center'},
    button: {width: 130, alignSelf: 'center'},
  });
