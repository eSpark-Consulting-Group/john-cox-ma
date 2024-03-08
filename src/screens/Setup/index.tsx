import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
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
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {Engines, temp} from '../../constants';
import LabelDropdown from '../../components/LabelDropdown';
import {Connected, Wifi} from '../../assets';
import MyCheckbox from '../../components/MyCheckbox';

type SetupScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Setup() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<SetupScreenProps['navigation']>();
  const [wifiIndex, setWifiIndex] = useState(0);
  const [showNetworks, setShowNetworks] = useState(false);
  const [enterPassword, setEnterPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Modal visible={isVisible} animationType="slide" transparent>
        <View style={styles(theme).modalContainer}>
          <View style={styles(theme).modalContent}>
            <MyText text="Connected" size={34} fontFamily="NotoSans-Bold" />
            <GapView length={100} />
            <MyCard>
              <Pressable
                style={styles().wifiRow}
                onPress={() => setIsVisible(false)}>
                <Wifi />
                <MyText size={19} style={{width: '70%'}}>
                  Network{wifiIndex}
                </MyText>
                <MyCheckbox value={true} width={32} disabled />
              </Pressable>
            </MyCard>
            <GapView length={100} />
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={[styles().screen, {flex: showNetworks ? 1 : 0}]}>
        <MyHeader />

        {showNetworks ? (
          enterPassword ? (
            <>
              <MyText
                text="Enter Password"
                size={18}
                fontFamily="NotoSans-Bold"
                style={styles().title}
              />
              <MyCard>
                <View style={styles().wifiRow}>
                  <Wifi />
                  <MyText size={19}>Network{wifiIndex}</MyText>
                </View>
                <MyInput height={40} width={250} />
                <GapView length={60} />
                <MyButton
                  label="Connect"
                  width={120}
                  labelStyle={{fontSize: 20}}
                  onPress={() => {
                    setWifiIndex(wifiIndex);
                    setEnterPassword(false);
                    setIsVisible(true);
                  }}
                />
                <GapView length={20} />
              </MyCard>
            </>
          ) : (
            <>
              <MyText
                text="Avaialble Networks"
                size={18}
                fontFamily="NotoSans-Bold"
                style={styles().title}
              />
              <MyCard>
                {[1, 2, 3, 4].map((item, index) => (
                  <TouchableOpacity
                    key={index} // Add key prop here with unique value
                    style={styles().wifiRow}
                    onPress={() => {
                      setEnterPassword(true);
                      setWifiIndex(index + 1);
                    }}>
                    <Wifi />
                    <MyText size={19}>Network{item}</MyText>
                    {wifiIndex - 1 == index && <Connected />}
                  </TouchableOpacity>
                ))}
              </MyCard>
            </>
          )
        ) : (
          <>
            <GapView length={90} />
            <MyText
              text="Setup"
              size={18}
              fontFamily="NotoSans-Bold"
              style={styles().title}
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
                <View style={styles().card2}>
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
                <View style={styles().fuelBurn}>
                  <MyText
                    text="Generator Fuel burn when in use "
                    style={{width: '50%'}}
                  />
                  {/* todo: component confusion** */}
                  <View
                    style={{
                      width: 114,
                      height: 20,
                      backgroundColor: '#70726F73',
                    }} //temp
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
                  <LabelInput
                    text="Access Point Name"
                    checkbox
                    width={100}
                    onFocus={() => setShowNetworks(true)}
                  />
                  <GapView length={10} />
                  <LabelInput text="Password" checkbox width={100} password />
                  <GapView length={10} />
                </View>
              </MyCard>
            </View>
            <GapView length={30} />
            <MyButton
              label="Fuel Mgt Module Setup"
              style={styles().signin}
              onPress={() => {
                navigation.navigate('FMMSetup');
                console.log('Fuel Mgt pe jayein');
              }}
            />
            <GapView length={25} />

            <MyButton
              label="Back"
              style={styles().button}
              onPress={() => {
                navigation.goBack();
                console.log('Wapis jayein');
              }}
              gradient
            />
          </>
        )}

        <GapView length={70} />
        <MyFooter />
      </ScrollView>
    </>
  );
}

const styles = (theme?: MyTheme) =>
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalContent: {
      backgroundColor: theme?.colors.background,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    wifiRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 10,
      gap: 20,
      height: 40,
    },
  });
