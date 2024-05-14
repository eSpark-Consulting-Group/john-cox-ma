import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
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

      font: 'NotoSans-Bold',
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
  const card2: CardItem[] = [
    {
      title: 'FMM #2',
      font: 'NotoSans-Bold',
    },
    {
      title: 'Engine3',
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
      title: 'Engine4',
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
    <MyCanvas>
      <ScrollView
        contentContainerStyle={styles().screen}
        showsVerticalScrollIndicator={false}>
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
            <>
              <MyText
                text={item.title}
                textColor={item.titleColor}
                style={{alignSelf: 'flex-start'}}
                fontFamily={item.font}
              />
              {item.labelInput &&
                item.labelInput.map((label, index) => (
                  <LabelInput
                    key={index}
                    text={label}
                    width={150}
                    height={30}
                    placeholder="Enter here"
                  />
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
            </>
          ))}
        </MyCard>
        <GapView length={15} />
        <View style={{zIndex: -1}}>
          <MyCard>
            {card2.map((item, index) => (
              <>
                <MyText
                  text={item.title}
                  textColor={item.titleColor}
                  style={{alignSelf: 'flex-start'}}
                  fontFamily={item.font}
                />
                {item.labelInput &&
                  item.labelInput.map((label, index) => (
                    <LabelInput
                      key={index}
                      text={label}
                      width={150}
                      height={30}
                      placeholder="Enter here"
                    />
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
              </>
            ))}
          </MyCard>
        </View>

        <GapView length={25} />
        <View style={{width: '30%'}}>
          <MyButton
            label="Done"
            labelStyle={{fontSize: 20}}
            onPress={() => {
              navigation.navigate('Main');
              console.log('Main pe jayein');
            }}
          />
          <GapView length={25} />
          <MyButton
            label="Back"
            gradient
            labelStyle={{fontSize: 20}}
            onPress={() => {
              navigation.navigate('Setup');
              console.log('Wapis jayein');
            }}
          />
        </View>
        <GapView length={70} />
        <MyFooter />
      </ScrollView>
    </MyCanvas>
  );
}

const styles = () =>
  StyleSheet.create({
    screen: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
