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
import {EngineData, MyTheme, TripData} from '../../types';
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
  const [tripStarted, setTripStarted] = useState(false); //xxx
  const [tripName, setTripName] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [displayDistance, setDisplayDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState<string>('0.00');
  const [fuelUsed, setFuelUsed] = useState([0, 0, 0, 0]);
  const [selectedSwitch, setSelectedSwitch] = useState<1 | 2 | 3>(1); // Stores the currently selected switch index

  const handleSwitchPress = (index: 1 | 2 | 3) => {
    setSelectedSwitch(index);
  };

  useEffect(
    () => console.log('selected Trip:: ', selectedSwitch),
    [selectedSwitch],
  );

  const [trips, setTrips] = useState<TripData[]>([
    {
      id: 1,
      name: '',
      tripStarted: false,
      tripEnded: false,
      startingTime: null, // set to null initially
      distanceCovered: 0,
      tripTime: '0.00',
      intitalFuel: [0, 0, 0, 0],
      fuelConsumption: [0, 0, 0, 0],
      tripEfficiency: 0,
    },
    {
      id: 2,
      name: '',
      tripStarted: false,
      tripEnded: false,
      startingTime: null, // set to null initially
      distanceCovered: 0,
      tripTime: '0.00',
      intitalFuel: [0, 0, 0, 0],
      fuelConsumption: [0, 0, 0, 0],
      tripEfficiency: 0,
    },
    {
      id: 3,
      name: '',
      tripStarted: false,
      tripEnded: false,
      startingTime: null, // set to null initially
      distanceCovered: 0,
      tripTime: '0.00',
      intitalFuel: [0, 0, 0, 0],
      fuelConsumption: [0, 0, 0, 0],
      tripEfficiency: 0,
    },
  ]);

  const intervalRefs = useRef<Array<NodeJS.Timeout | null>>([null, null, null]); // main data set
  const intervalRefs1 = useRef<Array<NodeJS.Timeout | null>>([
    null,
    null,
    null,
  ]); //fuel Data keliye
  const latestEngineDataRef = useRef({enginesData1, enginesData2});

  const distanceRefs = useRef([0, 0, 0, 0]); // distance cal for each eng

  //eff cal
  // const efficiency = useMemo(() => {
  //   if (trips[selectedSwitch - 1].tripStarted) {
  //     console.log('updating Efficiency');
  //     const totalfuel =
  //       trips[selectedSwitch - 1].fuelConsumption[0] +
  //       trips[selectedSwitch - 1].fuelConsumption[1] +
  //       trips[selectedSwitch - 1].fuelConsumption[2] +
  //       trips[selectedSwitch - 1].fuelConsumption[3];

  //     const eff = totalfuel / trips[selectedSwitch - 1].distanceCovered;
  //     console.log('eff', eff);

  //     return eff;
  //   }
  // }, [
  //   trips[selectedSwitch - 1].distanceCovered,
  //   trips[selectedSwitch - 1].fuelConsumption,
  //   selectedSwitch,
  // ]);

  const speedEfficiency = useMemo(() => {
    const totalFuelBurned1 =
      Number(enginesData1[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData1[1]?.FuelManagement.total_fuel_burned || 0);
    const totalFuelBurned2 =
      Number(enginesData2[0]?.FuelManagement.total_fuel_burned || 0) +
      Number(enginesData2[1]?.FuelManagement.total_fuel_burned || 0);

    const totalSpeed = Number(enginesData1[0]?.SensorData.speed || 0);
    const totalFuelBurned = totalFuelBurned1 + totalFuelBurned2;

    // Efficiency in knots per gallon
    return totalFuelBurned > 0 ? totalSpeed / totalFuelBurned : 0;
  }, [
    enginesData1[0]?.FuelManagement.total_fuel_burned,
    enginesData1[1]?.FuelManagement.total_fuel_burned,
    enginesData2[0]?.FuelManagement.total_fuel_burned,
    enginesData2[1]?.FuelManagement.total_fuel_burned,
    enginesData1[0]?.SensorData.speed,
  ]);

  useEffect(() => {
    const updatedTrips = [...trips];
    updatedTrips[selectedSwitch - 1] = {
      ...updatedTrips[selectedSwitch - 1],
      tripEfficiency: speedEfficiency,
    };
    console.log('asdas', speedEfficiency);

    setTrips(updatedTrips);
  }, [speedEfficiency]);

  useEffect(() => {
    return () => {
      // Clear intervals for the currently active trip
      if (intervalRefs.current[selectedSwitch - 1]) {
        clearInterval(intervalRefs.current[selectedSwitch - 1]!);
        intervalRefs.current[selectedSwitch - 1] = null;
      }

      if (intervalRefs1.current[selectedSwitch - 1]) {
        clearInterval(intervalRefs1.current[selectedSwitch - 1]!);
        intervalRefs1.current[selectedSwitch - 1] = null;
      }
    };
  }, []);

  //trip ended false krrhe
  useUpdateEffect(() => {
    console.log('trip started ====', trips[selectedSwitch - 1].tripStarted);
    const updatedTrips = [...trips];
    updatedTrips[selectedSwitch - 1] = {
      ...updatedTrips[selectedSwitch - 1],
      tripEnded: !trips[selectedSwitch - 1].tripStarted,
    };
    // setTripEnded(!tripStarted);
  }, [trips[selectedSwitch - 1].tripStarted, selectedSwitch]);

  //observe data for all engines
  useEffect(() => {
    console.log(
      '🚀 ~ useEffect ~ trips[selectedSwitch - 1].fuelConsumption:',
      trips[selectedSwitch - 1].fuelConsumption,
    );
  }, [enginesData1, enginesData2]);

  useEffect(() => {
    console.log('🚀 ~ Trips ~ trips:', trips);
  }, [trips]);

  // Update the ref whenever engine data changes
  useEffect(() => {
    if (trips[selectedSwitch - 1].tripStarted == true) {
      latestEngineDataRef.current = {enginesData1, enginesData2};
    }
  }, [enginesData1, enginesData2, tripStarted]);

  // Fuel consumption calculation effect
  useEffect(() => {
    if (
      intervalRefs1.current[selectedSwitch - 1] == null &&
      trips[selectedSwitch - 1].tripStarted == true
    ) {
      console.log(
        'Starting fuel consumption calculation for trip:',
        selectedSwitch,
      );

      intervalRefs1.current[selectedSwitch - 1] = setInterval(() => {
        const {enginesData1, enginesData2} = latestEngineDataRef.current;

        const newFuelBurn = [
          Number(enginesData1[0]?.FuelManagement.total_fuel_burned) || 0,
          Number(enginesData1[1]?.FuelManagement.total_fuel_burned) || 0,
          Number(enginesData2[0]?.FuelManagement.total_fuel_burned) || 0,
          Number(enginesData2[1]?.FuelManagement.total_fuel_burned) || 0,
        ];

        setTrips(prevTrips => {
          const updatedTrips = [...prevTrips];
          const currentTrip = updatedTrips[selectedSwitch - 1];

          const updatedFuelConsumption = newFuelBurn.map(
            (currentFuel, index) => {
              const initialFuel = Number(currentTrip.intitalFuel[index]);
              return currentFuel - initialFuel;
            },
          );

          updatedTrips[selectedSwitch - 1] = {
            ...currentTrip,
            fuelConsumption: updatedFuelConsumption,
          };

          console.log(
            'Updated fuel consumption:================',
            updatedFuelConsumption,
          );
          return updatedTrips;
        });
      }, 4999); // Update every 5 seconds
    } else {
      if (intervalRefs1.current[selectedSwitch - 1]) {
        clearInterval(intervalRefs1.current[selectedSwitch - 1]!);
        intervalRefs1.current[selectedSwitch - 1] = null;
      }
    }

    return () => {
      if (intervalRefs1.current[selectedSwitch - 1]) {
        clearInterval(intervalRefs1.current[selectedSwitch - 1]!);
        intervalRefs1.current[selectedSwitch - 1] = null;
      }
    };
  }, [selectedSwitch, trips[selectedSwitch - 1].tripStarted]); // Removed enginesData1 and enginesData2 from here

  // Utility function to reset a trip's state
  function resetTripState(id: 1 | 2 | 3): TripData {
    return {
      id, // Ensure the id is included
      name: '',
      startingTime: null,
      distanceCovered: 0,
      tripTime: '0.00',
      fuelConsumption: [0, 0, 0, 0],
      tripEfficiency: 0,
      tripStarted: false,
      tripEnded: true,
      intitalFuel: [0, 0, 0, 0],
    };
  }

  function handleStartTrip(id: 1 | 2 | 3, speed: number) {
    // Check if the trip is already running (stop and reset if so)
    if (intervalRefs.current[id - 1]) {
      // Clear interval to stop trip tracking
      clearInterval(intervalRefs.current[id - 1]!);
      intervalRefs.current[id - 1] = null;
      setNameInput('');

      // Reset trip state
      const updatedTrips = [...trips];
      updatedTrips[id - 1] = resetTripState(id);
      setTrips(updatedTrips);

      // Clear distance and time tracking
      distanceRefs.current[id - 1] = 0;
      setDisplayDistance(0);
      setElapsedTime('0.00');
    } else {
      // Start a new trip
      setTripName(nameInput);
      const now = new Date();
      const initialFuel = [
        enginesData1[0]?.FuelManagement.total_fuel_burned || 0,
        enginesData1[1]?.FuelManagement.total_fuel_burned || 0,
        enginesData2[0]?.FuelManagement.total_fuel_burned || 0,
        enginesData2[1]?.FuelManagement.total_fuel_burned || 0,
      ];

      const updatedTrips = [...trips];
      updatedTrips[id - 1] = {
        ...updatedTrips[id - 1],
        name: nameInput,
        startingTime: now,
        distanceCovered: 0,
        tripTime: '0.00',
        fuelConsumption: [0, 0, 0, 0],
        intitalFuel: initialFuel,
        tripEfficiency: 0,
        tripStarted: true,
        tripEnded: false,
      };
      setTrips(updatedTrips);

      // Start interval to track time and distance
      intervalRefs.current[id - 1] = setInterval(() => {
        setTrips(prevTrips => {
          const updatedTrips = [...prevTrips];
          const currentTrip = updatedTrips[id - 1];

          if (currentTrip.startingTime) {
            const currentTime = new Date();
            const elapsedTimeInHours =
              (currentTime.getTime() - currentTrip.startingTime.getTime()) /
              3600000;

            const newDistance = speed * elapsedTimeInHours;

            updatedTrips[id - 1] = {
              ...currentTrip,
              distanceCovered: newDistance,
              tripTime: elapsedTimeInHours.toFixed(2),
            };

            if (id === selectedSwitch) {
              setDisplayDistance(newDistance);
              setElapsedTime(elapsedTimeInHours.toFixed(2));
            }
          }

          return updatedTrips;
        });
      }, 5000); // Every 5 seconds
    }

    setTripStarted(prevTripStarted => !prevTripStarted);
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
        handleStartTrip(selectedSwitch, Number(speed));
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
                Are you sure you want to Reset Trip {selectedSwitch}?
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
                    placeholder="Enter Name"
                    onChange={text => {
                      setNameInput(text);
                    }}
                    // value={tripStarted && tripName}
                    value={
                      trips[selectedSwitch - 1].tripStarted &&
                      trips[selectedSwitch - 1].name
                    }
                  />
                </View>
              </TripSection>
              <GapView length={5} />
              <RenderRow
                title="Trip Start"
                unit="Date"
                value={
                  trips[selectedSwitch - 1].tripStarted &&
                  trips[selectedSwitch - 1].startingTime
                    ? formatDate(trips[selectedSwitch - 1].startingTime)
                    : ''
                }
                editable={false}
              />
              <RenderRow
                title=""
                unit="Time"
                value={
                  trips[selectedSwitch - 1].tripStarted &&
                  trips[selectedSwitch - 1].startingTime
                    ? formatTime(trips[selectedSwitch - 1].startingTime)
                    : ''
                }
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
                  {trips[selectedSwitch - 1].fuelConsumption.map(
                    (fuel, index) => (
                      <RenderColumn
                        key={'fuel' + index}
                        value={Number(fuel.toFixed(2))}
                        label={index + 1}
                      />
                    ),
                  )}
                  <RenderColumn
                    label={'Total'}
                    value={trips[selectedSwitch - 1].fuelConsumption
                      .reduce((a, b) => a + b, 0)
                      .toFixed(2)}
                  />
                </View>
              </View>
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <RenderRow
                title="Total Distance"
                unit="N.Mile"
                value={
                  trips[selectedSwitch - 1].tripStarted
                    ? Number(trips[selectedSwitch - 1].distanceCovered).toFixed(
                        2,
                      )
                    : '0.00'
                }
              />
              <RenderRow
                title="Estimated Run Time"
                unit="hours/minute"
                value={
                  trips[selectedSwitch - 1].tripStarted
                    ? trips[selectedSwitch - 1].tripTime
                    : '0.00'
                }
              />
              <RenderRow
                title="Average Speed"
                value={
                  trips[selectedSwitch - 1].tripStarted
                    ? Number(speed).toFixed(3)
                    : '0.00'
                } //xxx
                unit="knots"
              />
              <RenderRow
                title="Efficiency"
                unit="Gal/N.Mile"
                value={
                  trips[selectedSwitch - 1].tripStarted &&
                  trips[selectedSwitch - 1].tripEfficiency
                    ? Number(trips[selectedSwitch - 1].tripEfficiency).toFixed(
                        2,
                      )
                    : '0.00'
                }
              />
            </MyCard>
            <GapView length={30} />
            <View style={{flexDirection: 'row', gap: 20}}>
              <MyButton
                label={
                  trips[selectedSwitch - 1].tripStarted
                    ? 'End Trip'
                    : 'Start Trip'
                } //xxx
                width={80}
                onPress={() => {
                  handleStartTrip(selectedSwitch, Number(speed));
                  console.log('startinf trip for tab ::', selectedSwitch);
                }}
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
