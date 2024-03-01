import React from 'react';
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  GapView,
  LabelInput,
  MyButton,
  MyCard,
  MyFooter,
  MyHeader,
  MyInput,
  MyText,
  MyDropdown,
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

        <LabelDropdown
          data={['US Gallons', 'Liters']}
          onSelect={() => {}}
          text="Volume"
          zIndex={50}
        />
        <GapView length={20} />
        <LabelDropdown
          data={['Kilometers', 'Statute Miles', 'Nautical Miles']}
          onSelect={() => {}}
          text="Distance"
          zIndex={48}
        />
        <GapView length={30} />
      </MyCard>
      <GapView length={30} />
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

interface LabelDropdownProps {
  text: string;
  size?: number;
  data: string[];
  zIndex?: number;
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: ViewStyle;
  height?: number;
}

function LabelDropdown({
  text,
  size,
  data,
  zIndex,
  onSelect,
  style,
  containerStyle,
  height,
}: LabelDropdownProps) {
  const theme = useTheme() as MyTheme;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <MyText text={text} size={size || 18} />
      <MyDropdown
        data={data}
        onSelect={onSelect}
        theme={theme}
        zIndex={zIndex}
        style={style}
        containerStyle={containerStyle}
        height={height}
      />
    </View>
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
    signin: {width: 130, alignSelf: 'center', zIndex: -1},
    button: {width: 130, alignSelf: 'center'},
  });
