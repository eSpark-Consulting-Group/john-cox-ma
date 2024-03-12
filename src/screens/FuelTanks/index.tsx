import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  DisplayBox,
  GapView,
  MyButton,
  MyCard,
  MyFooter,
  MyHeader,
  MyText,
  ScaleTanks,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {fuelData} from '../../constants';

type FuelTanksScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'Login'
>;

export default function FuelTanks() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<FuelTanksScreenProps['navigation']>();
  const engines = ['Engine1', 'Engine2', 'Engine3', 'Engine4'];
  const supplyData = ['22℃', '22℃', '22℃', '22℃'];
  const returnData = ['31℃', '32.6℃', '30.9℃', '30.9℃'];

  return (
    <ScrollView contentContainerStyle={styles().container}>
      <MyHeader />
      <GapView length={90} />
      <MyText
        text="Fuel Management"
        size={22}
        fontFamily="NotoSans-Bold"
        style={styles().heading}
      />
      <MyCard>
        <ScaleTanks fuelData={fuelData} />
        <View style={styles().total}>
          <MyText size={16}>Total Fuel:</MyText>
          <DisplayBox
            value={'1820'}
            fontFamily="CrimsonText-Bold"
            textColor={theme.colors.primary}
            size={25}
            paddingVertical={2}
            paddingHorizontal={20}
          />
          <MyText>gal</MyText>
        </View>
      </MyCard>
      <GapView length={20} />
      <MyCard>
        <MyText
          text="Fuel Temperature"
          size={22}
          fontFamily="NotoSans-BoldItalic"
          style={{alignSelf: 'flex-start'}}
        />
        <View style={styles().row}>
          <ColumnData title="Engines" data={engines} isEngine />
          <ColumnData title="Supply" data={supplyData} />
          <ColumnData title="Return" data={returnData} />
        </View>
      </MyCard>
      <GapView length={120} />
      <MyButton
        label="Back"
        style={styles().button}
        gradient
        onPress={() => navigation.goBack()}
      />
      <MyFooter />
    </ScrollView>
  );
}

function ColumnData({
  title,
  data,
  isEngine,
}: {
  title: string;
  data: string[];
  isEngine?: boolean;
}) {
  const theme = useTheme() as MyTheme;
  return (
    <View
      style={[styles().column, {alignItems: isEngine ? 'stretch' : 'center'}]}>
      <MyText
        text={title}
        fontFamily="NotoSans-Bold"
        style={{marginBottom: 15}}
        textColor={theme.colors.secondary}
        size={16}
      />
      {isEngine ? (
        <View>
          {data.map((item, index) => (
            <MyText
              text={item}
              key={index}
              style={{paddingBottom: 20, paddingTop: 8}}
              size={16}
            />
          ))}
        </View>
      ) : (
        <View style={{width: '80%'}}>
          {data.map((item, index) => (
            <DisplayBox
              size={16}
              value={item}
              key={index}
              fontFamily="NotoSans-Bold"
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    column: {
      width: '33.333333%',
    },
    heading: {alignSelf: 'flex-start', marginLeft: 18, paddingBottom: 10},
    button: {width: 130, alignSelf: 'center'},
    total: {flexDirection: 'row', alignSelf: 'flex-start', gap: 10},
  });
