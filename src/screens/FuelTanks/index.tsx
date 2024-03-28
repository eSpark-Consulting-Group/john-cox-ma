import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
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
import {Empty, Full} from '../../assets';

type FuelTanksScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'Login'
>;

export default function FuelTanks() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<FuelTanksScreenProps['navigation']>();
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
          <View style={styles().row}>
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
          <View style={styles().lowerBoxes}>
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
        <MyText textColor={theme.colors.secondary} style={styles().heading}>
          Update Options
        </MyText>
        <GapView length={10} />
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
            <View style={styles().row}>
              <View style={styles().inputs}>
                <View style={styles().inputBox}>
                  <MyInput placeholder="Enter" height={26} />
                  <MyText text="Date" size={14} />
                </View>
                <View style={styles().inputBox}>
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
            <View style={styles().inputs}>
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
      <View style={styles(theme).collapsable}>
        <MyText size={20}>{title}</MyText>
        <Pressable onPress={handlePress}>
          <MyText size={25}>{visible ? '-' : '+'}</MyText>
        </Pressable>
      </View>
      {visible && children}
    </>
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
      alignItems: 'center',
    },
    lowerBoxes: {flexDirection: 'row', width: '100%', marginTop: '-8%'},
    heading: {alignSelf: 'flex-start', marginLeft: 18, paddingBottom: 10},
    button: {width: 130, alignSelf: 'center'},
    total: {flexDirection: 'row', alignSelf: 'flex-start', gap: 10},
    inputs: {
      width: '55%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inputBox: {width: '45%', alignItems: 'center'},
    collapsable: {
      width: '90%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: theme?.colors.primary,
      paddingBottom: 5,
      marginBottom: 5,
    },
  });
