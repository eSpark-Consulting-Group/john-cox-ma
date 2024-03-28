import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  DisplayBox,
  GapView,
  MyButton,
  MyCanvas,
  MyCard,
  MyFooter,
  MyHeader,
  MyInput,
  MySwitch,
  MyText,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';

type TripsScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Trips() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<TripsScreenProps['navigation']>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState<number>(0); // Stores the currently selected switch index

  const handleSwitchPress = (index: number) => {
    setSelectedSwitch(index === selectedSwitch ? 0 : index); // Toggle selection or deselect
  };

  useEffect(() => {
    if (warningVisible) {
      const timer = setTimeout(() => {
        setWarningVisible(false);
        setResetVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [warningVisible]);
  useEffect(() => {
    if (resetVisible) {
      const timer = setTimeout(() => {
        setResetVisible(false);
        setShowConfirmation(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [resetVisible]);

  return (
    <MyCanvas>
      <RenderModal visible={warningVisible} type="warning" />
      <RenderModal visible={resetVisible} type="reset" />
      <ScrollView
        contentContainerStyle={[
          styles.screen,
          {flex: showConfirmation ? 1 : 0},
        ]}
        showsVerticalScrollIndicator={false}>
        <MyHeader />
        {showConfirmation ? (
          <View style={styles.confirmation}>
            <View style={styles.inner}>
              <MyText size={24} style={styles.confirmationMessage}>
                Are you sure you want to Reset Trip 1?
              </MyText>
              <MyText
                textColor={theme.colors.secondary}
                style={styles.confirmation}
                size={18}>
                Resetting will over-write prior date
              </MyText>
              <View style={styles.buttonRow}>
                <MyButton
                  label="NO"
                  labelStyle={styles.rowButtons}
                  onPress={() => setShowConfirmation(false)}
                />
                <MyButton
                  label="YES"
                  textColor="#B81106"
                  labelStyle={styles.rowButtons}
                  onPress={() => setWarningVisible(true)}
                />
              </View>
            </View>
            {!resetVisible && !warningVisible ? (
              <MyButton
                label="Back"
                style={[styles.button, {position: 'absolute', top: 350}]}
                onPress={() => {
                  setShowConfirmation(false);
                }}
                gradient
              />
            ) : null}
          </View>
        ) : (
          <>
            <GapView length={90} />
            <View style={styles.titleContainer}>
              <MyText
                text="Trip Fuel Usage"
                size={18}
                fontFamily="NotoSans-Bold"
                style={styles.title}
              />
            </View>
            <MyCard>
              <TripSection label="Trip Select">
                <View style={styles.switchContainer}>
                  <MySwitch
                    label="1"
                    isActive={selectedSwitch === 1}
                    onPress={() => handleSwitchPress(1)}
                  />
                  <MySwitch
                    label="2"
                    isActive={selectedSwitch === 2}
                    onPress={() => handleSwitchPress(2)}
                  />
                  <MySwitch
                    label="3"
                    isActive={selectedSwitch === 3}
                    onPress={() => handleSwitchPress(3)}
                  />
                </View>
              </TripSection>
              <GapView length={5} />
              <TripSection label="Trip Name">
                <View style={styles.inputContainer}>
                  <MyInput placeholder="Ente Trip Name" />
                </View>
              </TripSection>
              <GapView length={5} />
              <RenderRow title="Trip Start" unit="Date" />
              <RenderRow title="" unit="Time" />
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <View style={styles.card2}>
                <View style={styles.innercard2}>
                  <MyText fontFamily="AnonymousPro-Regular">Engines</MyText>
                  <MyText size={16}>Fuel Used</MyText>
                </View>
                <View style={styles.boxes}>
                  <RenderColumn label={1} value={455} />
                  <RenderColumn label={2} value={455} />
                  <RenderColumn label={3} value={455} />
                  <RenderColumn label={4} value={455} />
                  <RenderColumn label={'Total'} value={455} />
                </View>
              </View>
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <RenderRow title="Total Distance" unit="N.Mile" />
              <RenderRow title="Estimated Run Time" unit="hours/minute" />
              <RenderRow title="Average Speed" unit="knots" />
              <RenderRow title="Efficiency" unit="Gal/N.Mile" />
            </MyCard>
            <GapView length={30} />
            <MyButton
              label="Trip Reset"
              width={80}
              onPress={() => setShowConfirmation(true)}
            />
            <GapView length={25} />
            <MyButton
              label="Back"
              style={styles.button}
              onPress={() => {
                navigation.goBack();
                console.log('Wapis jayein');
              }}
              gradient
            />
            <GapView length={70} />
            <MyFooter />
          </>
        )}
      </ScrollView>
    </MyCanvas>
  );
}

interface RenderModalProps {
  visible: boolean;
  type: 'warning' | 'reset';
  onClose?: () => void;
}
function RenderModal({visible, type, onClose}: RenderModalProps) {
  const theme = useTheme() as MyTheme;

  const renderContent = () => {
    if (type === 'warning') {
      return (
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme.colors.background},
          ]}>
          <MyText size={24} textColor={'#B81106'}>
            Warning:
          </MyText>
          <MyText
            size={24}
            textColor={theme.colors.secondary}
            style={{textAlign: 'center'}}>
            Trip ! Data will be reset!
          </MyText>
        </View>
      );
    } else if (type === 'reset') {
      return (
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme.colors.background},
          ]}>
          <MyText
            size={36}
            textColor={theme.colors.primary}
            style={{textAlign: 'center', lineHeight: 38}}>
            Reset Successful!
          </MyText>
        </View>
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>{renderContent()}</View>
    </Modal>
  );
}

function RenderRow({title, unit}: {title: string; unit: string}) {
  return (
    <View style={styles.sectionContainer}>
      <MyText style={{width: '50%'}}>{title}</MyText>
      <View style={{width: '50%', paddingHorizontal: 15}}>
        <MyInput />
        <MyText text={unit} fontFamily="NotoSans-Regular" />
      </View>
    </View>
  );
}

function RenderColumn({label, value}: {label: number | string; value: number}) {
  const theme = useTheme() as MyTheme;
  return (
    <View style={styles.column}>
      <MyText
        text={label.toString()}
        fontFamily="AnonymousPro-Regular"
        style={{paddingBottom: 5}}
        size={15}
      />
      <DisplayBox
        value="455"
        textColor={theme.colors.primary}
        fontFamily="CrimsonText-Bold"
      />
      <MyText text={'gal'} />
    </View>
  );
}

function TripSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionContainer}>
      <MyText size={18}>{label}</MyText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    width: '90%',
  },
  title: {
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    gap: 2,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  inputContainer: {
    width: '50%',
    paddingHorizontal: 15,
    alignItems: 'center',
    gap: 5,
  },
  button: {width: 130, alignSelf: 'center'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    width: '100%',
    marginTop: 25,
    height: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 40,
  },
  wifiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    gap: 20,
    height: 40,
  },
  confirmation: {
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
  },
  inner: {
    width: '70%',
    alignItems: 'center',
    gap: 20,
  },
  confirmationMessage: {textAlign: 'center', paddingBottom: 5, lineHeight: 30},
  buttonRow: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rowButtons: {fontSize: 18, paddingHorizontal: 10},
  column: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card2: {flexDirection: 'row', width: '100%'},
  innercard2: {
    justifyContent: 'space-between',
    flexGrow: 1,
    height: 50,
  },
  boxes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
  },
});
