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
import {Fonts, MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import LabelDropdown from '../../components/LabelDropdown';

type FMMSetupScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

interface CardItem {
  title: string;
  labelInput?: string[];
  titleColor?: string; // Assuming titleColor is a color string
  font: Fonts; // Assuming font is a font name string
  labelDropdown?: {
    label: string;
    options: string[];
    zIndex: number;
  }[];
}
export default function FMMSetup() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<FMMSetupScreenProps['navigation']>();
  const card1: CardItem[] = [
    {
      title: 'FMM #1',
      labelInput: ['IP Address'],
      font: 'NotoSans-BoldItalic',
    },
    {
      title: 'Wifi Setup',
      font: 'NotoSans-BoldItalic',
      labelInput: ['Access Point Name', 'Password'],
    },
    {
      title: 'Engine1',
      titleColor: theme.colors.secondary,
      font: 'NotoSans-Bold',
      labelInput: ['Volume per cycle'],
      labelDropdown: [
        {
          label: 'Fuel Type',
          options: ['Gasoline', 'Diesel', 'Biodiesel'],
          zIndex: 56,
        },
        {
          label: 'Engine Type',
          options: ['drive engine', 'generator'],
          zIndex: 54,
        },
      ],
    },
    {
      title: 'Engine2',
      titleColor: theme.colors.secondary,
      font: 'NotoSans-Bold',
      labelInput: ['Volume per cycle'],
      labelDropdown: [
        {
          label: 'Fuel Type',
          options: ['Gasoline', 'Diesel', 'Biodiesel'],
          zIndex: 52,
        },
        {
          label: 'Engine Type',
          options: ['drive engine', 'generator'],
          zIndex: 50,
        },
      ],
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles({}).screen}>
      <MyHeader />
      <GapView length={90} />
      <MyText
        text="Fuel Mgt Module Setup"
        size={18}
        fontFamily="NotoSans-Bold"
        style={{alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20}}
      />
      <MyCard>
        {card1.map((item, index) => (
          <View key={index}>
            <MyText
              text={item.title}
              textColor={item.titleColor}
              style={{alignSelf: 'flex-start'}}
              fontFamily={item.font}
            />
            {item.labelInput &&
              item.labelInput.map((label, index) => (
                <LabelInput key={index} text={label} width={140} />
              ))}
            {item.labelDropdown &&
              item.labelDropdown.map((dropdown, index) => (
                <LabelDropdown
                  key={index}
                  text={dropdown.label}
                  data={dropdown.options}
                  onSelect={() => {}}
                  zIndex={dropdown.zIndex}
                />
              ))}
          </View>
        ))}
      </MyCard>
      <GapView length={15} />
      <View style={{zIndex: -1}}>
        <MyCard>
          {card1.map((item, index) => (
            <View key={index}>
              <MyText
                text={item.title}
                textColor={item.titleColor}
                style={{alignSelf: 'flex-start'}}
                fontFamily={item.font}
              />
              {item.labelInput &&
                item.labelInput.map((label, index) => (
                  <LabelInput key={index} text={label} width={140} />
                ))}
              {item.labelDropdown &&
                item.labelDropdown.map((dropdown, index) => (
                  <LabelDropdown
                    key={index}
                    text={dropdown.label}
                    data={dropdown.options}
                    onSelect={() => {}}
                    zIndex={dropdown.zIndex}
                  />
                ))}
            </View>
          ))}
        </MyCard>
      </View>

      <GapView length={25} />
      <MyButton
        label="Back"
        style={styles({}).button}
        gradient
        onPress={() => {
          navigation.navigate('Setup');
          console.log('Wapis jayein');
        }}
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
    button: {width: 130, alignSelf: 'center', zIndex: -2},
  });
