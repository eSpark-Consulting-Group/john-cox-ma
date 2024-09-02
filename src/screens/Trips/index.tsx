import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {EngineData, MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {useSocket} from '../../components/SocketProvider';
import useUpdateEffect from '../../hooks/useUpdateEffect';

type TripsScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Trips() {
  const theme = useTheme() as MyTheme;
  const {enginesData1, speed, enginesData2} = useSocket();
  const navigation = useNavigation<TripsScreenProps['navigation']>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState<number>(1); // Stores the currently selected switch index
  const [tripStarted, setTripStarted] = useState(false); //xxx
  const [tripEnded, setTripEnded] = useState(false); //xxx
  const [tripName, setTripName] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [displayDistance, setDisplayDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState<string>('0.00');
  const [initialFuelData, setInitialFuelData] = useState([0, 0, 0, 0]);
  const [fuelUsed, setFuelUsed] = useState([0, 0, 0, 0]);
  const [tripData, setTripData] = useState<{
    name: string;
    startingTime: Date | null;
    distanceCovered: number;
    tripTime: string;
    fuelConsumption: any;
    tripEfficiency: number | undefined;
  }>({
    name: '',
    startingTime: null,
    distanceCovered: 0,
    tripTime: '0.00',
    fuelConsumption: [0, 0, 0, 0], // Assuming fuelConsumption is an array
    tripEfficiency: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef1 = useRef<NodeJS.Timeout | null>(null);

  const distanceRef = useRef(0);
  const handleSwitchPress = (index: number) => {
    setSelectedSwitch(index === selectedSwitch ? selectedSwitch : index); // Toggle selection
  };

  const efficiency = useMemo(() => {
    if (tripStarted) {
      console.log('updating Efficiency');
      console.log('distance:: ===', displayDistance);

      return (
        (fuelUsed[0] + fuelUsed[1] + fuelUsed[2] + fuelUsed[3]) /
        displayDistance
      );
    }
  }, [fuelUsed[0], fuelUsed[1], fuelUsed[2], fuelUsed[3], displayDistance]);

  useEffect(
    () => console.log('efficiency updated=====', efficiency),
    [efficiency],
  );
  useEffect(() => {
    return () => {
      if (intervalRef.current && intervalRef1.current) {
        clearInterval(intervalRef.current);
        clearInterval(intervalRef1.current);
      }
    };
  }, []);

  function handleSetTripData() {
    setTripData({
      name: tripName,
      startingTime: startTime,
      distanceCovered: displayDistance,
      tripTime: elapsedTime,
      fuelConsumption: fuelUsed,
      tripEfficiency: efficiency,
    });
    console.log('=========trip data=======');
  }

  useUpdateEffect(
    () => console.log('trip data==============', tripData),
    [tripData],
  );
  // useEffect(() => {
  //   console.log('trip ended ===', tripEnded);
  //   // handleSetTripData();
  //   console.log({
  //     name: tripName,
  //     startingTime: startTime,
  //     distanceCovered: displayDistance,
  //     tripTime: elapsedTime,
  //     fuelCOnsumption: fuelUsed,
  //   });
  // }, [tripEnded]);

  // useEffect(() => {
  //   console.log('========TIMELY trip data updating ===', tripEnded); //IGNORE THE TRIP ENDED FOR NOW
  //   console.log({
  //     name: tripName,
  //     startingTime: startTime,
  //     distanceCovered: displayDistance,
  //     tripTime: elapsedTime,
  //     fuelCOnsumption: fuelUsed,
  //   });
  // }, [tripName, startTime, displayDistance, elapsedTime, fuelUsed]);

  useUpdateEffect(() => {
    console.log('trip started ====', tripStarted);
    setTripEnded(!tripStarted);
  }, [tripStarted]);

  useEffect(() => {
    if (!intervalRef1.current && tripStarted) {
      //xxx
      intervalRef1.current = setInterval(() => {
        const newFuelBurn =
          enginesData1[0]?.FuelManagement.total_fuel_burned || 0;
        const fuelBurn = [initialFuelData[0] - newFuelBurn, 0, 0, 0];
        setFuelUsed(fuelBurn);
        console.log('old::: ', initialFuelData[0]);
        console.log(
          'new::: ',
          enginesData1[0]?.FuelManagement.total_fuel_burned,
        );

        console.log('Updated fuel burn:', fuelBurn);
      }, 4999);
    } else {
      setFuelUsed([0, 0, 0, 0]); // Reset fuel used when trip ends
    }

    return () => {
      if (intervalRef1.current) {
        clearInterval(intervalRef1.current);
        intervalRef1.current = null;
      }
    };
  }, [enginesData1, tripStarted]); //xxx

  function handleStartTrip(speed: number, enginesData1: EngineData[]) {
    if (intervalRef.current) {
      //log values
      handleSetTripData();
      //end trip
      setTripEnded(true);

      clearInterval(intervalRef.current);
      intervalRef.current = null;

      //clear values
      setNameInput('');
      setStartTime(null);
      distanceRef.current = 0;
      setDisplayDistance(0);
      setElapsedTime('0.00');
    } else {
      setTripName(nameInput);
      const now = new Date();
      setStartTime(now);

      const initialFuel = [
        enginesData1[0]?.FuelManagement.total_fuel_burned || 0,
        0,
        0,
        0,
      ];
      setInitialFuelData(initialFuel);

      intervalRef.current = setInterval(() => {
        setStartTime(prevStartTime => {
          const currentTime = new Date();
          const elapsedTimeInHours =
            (currentTime.getTime() - prevStartTime!.getTime()) / 3600000;

          distanceRef.current = Number(speed) * elapsedTimeInHours;
          setDisplayDistance(distanceRef.current);
          setElapsedTime(elapsedTimeInHours.toFixed(2));

          return prevStartTime;
        });
      }, 4999); // Update every second
    }
    setTripStarted(tripStarted => !tripStarted); //xxx
  }
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleTimeString(undefined, options);
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
                  <MyInput
                    placeholder="Enter Trip Name"
                    onChange={text => {
                      setNameInput(text);
                    }}
                    value={tripStarted && tripName}
                  />
                </View>
              </TripSection>
              <GapView length={5} />
              <RenderRow
                title="Trip Start"
                unit="Date"
                value={formatDate(startTime)}
                editable={false}
              />
              <RenderRow
                title=""
                unit="Time"
                value={formatTime(startTime)}
                editable={false}
              />
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <View style={styles.card2}>
                <View style={styles.innercard2}>
                  <MyText fontFamily="AnonymousPro-Regular">Engines</MyText>
                  <MyText size={16}>Fuel Used</MyText>
                </View>
                <View style={styles.boxes}>
                  {fuelUsed.map((fuel, index) => (
                    <RenderColumn
                      key={index}
                      // title={(index + 1).toString()}
                      // unit="Gals"
                      value={Number(fuel.toFixed(2))}
                      label={index + 1} // editable={false}
                    />
                  ))}
                  <RenderColumn
                    label={'Total'}
                    value={(
                      fuelUsed[0] +
                      fuelUsed[1] +
                      fuelUsed[2] +
                      fuelUsed[3]
                    ).toFixed(2)}
                  />
                </View>
              </View>
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <RenderRow
                title="Total Distance"
                unit="N.Mile"
                value={displayDistance.toFixed(2)}
              />
              <RenderRow
                title="Estimated Run Time"
                unit="hours/minute"
                value={elapsedTime}
              />
              <RenderRow
                title="Average Speed"
                value={tripStarted ? Number(speed).toFixed(3) : 0} //xxx
                unit="knots"
              />
              <RenderRow
                title="Efficiency"
                unit="Gal/N.Mile"
                value={efficiency ? efficiency.toFixed(2) : '00'}
              />
            </MyCard>
            <GapView length={30} />
            <View style={{flexDirection: 'row', gap: 20}}>
              <MyButton
                label={tripStarted ? 'End Trip' : 'Start Trip'} //xxx
                width={80}
                onPress={() => handleStartTrip(Number(speed), enginesData1)}
              />
              <MyButton
                label="Trip Reset"
                width={80}
                onPress={() => setShowConfirmation(true)}
              />
            </View>
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

function RenderRow({
  title,
  unit,
  value,
  editable = true,
}: {
  title: string;
  unit: string;
  value?: string | number;
  editable?: boolean;
}) {
  return (
    <View style={styles.sectionContainer}>
      <MyText style={{width: '50%'}}>{title}</MyText>
      <View style={{width: '50%', paddingHorizontal: 15}}>
        <MyInput value={value} editable={editable} />
        <MyText text={unit} fontFamily="NotoSans-Regular" />
      </View>
    </View>
  );
}

function RenderColumn({
  label,
  value,
}: {
  label: number | string;
  value: number | string;
}) {
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
        value={value || '00'}
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
