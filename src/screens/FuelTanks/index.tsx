import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  DisplayBox,
  GapView,
  MyBox,
  MyButton,
  MyCanvas,
  MyCard,
  MyFooter,
  MyHeader,
  MyInput,
  MyText,
  ScaleTanks,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {fuelData} from '../../constants';
import {Active, Empty, Full, Inactive} from '../../assets';

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
  const [isTankFull, setTankFull] = useState(true);

  return (
    <MyCanvas>
      <ScrollView
        contentContainerStyle={styles().container}
        showsVerticalScrollIndicator={false}>
        <MyHeader />
        <GapView length={90} />
        <MyText
          text="Fuel Update Utility"
          size={22}
          fontFamily="NotoSans-Bold"
          style={styles().heading}
        />
        <MyCard>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <MyText text="Available Fuel" textColor={theme.colors.secondary} />
            <MyButton label="Update" labelStyle={{fontSize: 14}} />
          </View>
          <MyBox
            text={'Fuel'}
            value={850}
            unit="gal"
            width={'80%'}
            textSize={26}
            unitSize={20}
          />
          <View style={{flexDirection: 'row', width: '100%', marginTop: '-8%'}}>
            <MyBox
              text={'Date'}
              value={'05/01/23'}
              width={'50%'}
              textSize={26}
            />
            <MyBox
              text={'Time'}
              value={850}
              unit="PM"
              width={'50%'}
              textSize={26}
            />
          </View>
        </MyCard>
        <GapView length={20} />
        <MyText
          textColor={theme.colors.secondary}
          style={{alignSelf: 'flex-start', marginLeft: 18}}>
          Update Options
        </MyText>
        <GapView length={20} />
        <CollapsableCard title={'Option 1'}>
          <MyCard>
            <ScaleTanks fuelData={fuelData} />
          </MyCard>
        </CollapsableCard>
        <GapView length={20} />
        <CollapsableCard title={'Option 2'}>
          <MyCard>
            <MyText
              textColor={theme.colors.secondary}
              fontFamily="NotoSans-Bold"
              style={{alignSelf: 'flex-start'}}>
              Fuel Purchased
            </MyText>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: '55%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '45%', alignItems: 'center'}}>
                  <MyInput placeholder="Enter" height={26} />
                  <MyText text="Date" size={14} />
                </View>
                <View style={{width: '45%', alignItems: 'center'}}>
                  <MyInput placeholder="Enter" height={26} />
                  <MyText text="Gallons" size={14} />
                </View>
              </View>
              <MyButton width={80} label="Add" labelStyle={{fontSize: 16}} />
            </View>
          </MyCard>
        </CollapsableCard>
        <GapView length={20} />
        <CollapsableCard title={'Option 3'}>
          <MyCard>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <MyButton
                label="Tank Full"
                labelStyle={{fontSize: 16}}
                onPress={() => setTankFull(!isTankFull)}
              />
              {isTankFull ? <Full /> : <Empty />}
            </View>
          </MyCard>
        </CollapsableCard>

        <GapView length={80} />
        <MyButton
          label="Back"
          style={styles().button}
          gradient
          onPress={() => navigation.goBack()}
        />
        <GapView length={70} />
        <MyFooter />
      </ScrollView>
    </MyCanvas>
  );
}
interface CollapsableCardProps {
  title: string;
  children?: React.ReactNode;
}

function CollapsableCard({title, children}: CollapsableCardProps) {
  const theme = useTheme() as MyTheme;
  const [visible, setVisible] = useState(false);

  const handlePress = () => {
    setVisible(!visible);
    console.log('johashdjk');
  };
  return (
    <>
      <View
        style={{
          width: '90%',
          justifyContent: 'space-between',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: theme.colors.primary,
          paddingBottom: 5,
          marginBottom: 5,
        }}>
        <MyText size={20}>{title}</MyText>
        <Pressable onPress={handlePress}>
          <MyText size={25}>{visible ? '-' : '+'}</MyText>
        </Pressable>
      </View>

      {visible && children}
    </>
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
