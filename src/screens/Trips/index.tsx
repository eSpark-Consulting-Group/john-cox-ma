import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';

import {
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
import {MyTheme, TripData} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {useSocket} from '../../components/SocketProvider';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import {RootState} from '../../app/store';
import {endTrip, startTrip} from '../../app/tripSlice';
import {
  RenderModal,
  TripSection,
  RenderRow,
  RenderColumn,
} from './Trips_components';
import {formatDate, formatTime} from './utils';
import {styles} from './styles';

type TripsScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Trips() {
  const theme = useTheme() as MyTheme;
  const {enginesData1, speed, enginesData2} = useSocket();
  const navigation = useNavigation<TripsScreenProps['navigation']>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [tripStarted, setTripStarted] = useState(false); //xxx
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedSwitch, setSelectedSwitch] = useState<1 | 2 | 3>(1); // Stores the currently selected switch index

  const dispatch = useDispatch();
  const currentTrips = useSelector((state: RootState) => state.trip.Trips);
  const [trips, setTrips] = useState<TripData[]>(Object.values(currentTrips));

  const intervalRefs = useRef<Array<NodeJS.Timeout | null>>([null, null, null]); // main data set
  const intervalRefs1 = useRef<Array<NodeJS.Timeout | null>>([
    null,
    null,
    null,
  ]); //fuel Data keliye
  const latestEngineDataRef = useRef({enginesData1, enginesData2});
  const distanceRefs = useRef([0, 0, 0, 0]); // distance cal for each eng

  const handleSwitchPress = (index: 1 | 2 | 3) => {
    setSelectedSwitch(index);
  };

  // initial trip data store in redux
  function startingTripInStore(
    tripId: 1 | 2 | 3,
    name: string,
    startTime: Date,
    initialFuelData: number[],
  ) {
    console.log('starting trip in store');
    dispatch(startTrip({tripId, name, startTime, initialFuelData}));
  }

  function endingTripInStore(tripId: 1 | 2 | 3) {
    console.log('ending trip in store');
    dispatch(endTrip({tripId}));
  }

  function continueRunningTrip(currentTrip: TripData, speed: string | number) {
    if (currentTrip.tripStarted) {
      console.log('Trip is already running');
      intervalRefs.current[selectedSwitch - 1] = setInterval(() => {
        setTrips(prevTrips => {
          const updatedTrips = [...prevTrips];

          const currentTime = new Date();
          const elapsedTimeInHours =
            (currentTime.getTime() - currentTrip.startingTime!.getTime()) /
            60000; // time in minutes

          const truncatedElapsedTimeInHours =
            Math.floor(elapsedTimeInHours * 10) / 10;
          const newDistance = Number(speed) * truncatedElapsedTimeInHours;

          updatedTrips[selectedSwitch - 1] = {
            ...currentTrip,
            distanceCovered: newDistance,
            tripTime: truncatedElapsedTimeInHours.toString(),
          };

          return updatedTrips;
        });
      }, 999);
      return;
    } else {
      console.log('trip needs to be started');
    }
  }

  useEffect(
    () => continueRunningTrip(currentTrips[selectedSwitch], speed),
    [selectedSwitch],
  );

  useEffect(() => {
    console.log('From store====', currentTrips);
  }, [startTrip, currentTrips, selectedSwitch]);

  function handleStartTrip(id: 1 | 2 | 3, speed: number) {
    // Check if the trip is already running (stop and reset if so)
    if (currentTrips[id].tripStarted) {
      //storing to redux
      // store_data(id, trips);
      endingTripInStore(id);
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
    } else {
      // Start a new trip

      const now = new Date();

      const initialFuel = [
        enginesData1[0]?.FuelManagement.total_fuel_burned || 0,
        enginesData1[1]?.FuelManagement.total_fuel_burned || 0,
        enginesData2[0]?.FuelManagement.total_fuel_burned || 0,
        enginesData2[1]?.FuelManagement.total_fuel_burned || 0,
      ];

      startingTripInStore(id, nameInput, now, initialFuel);

      const updatedTrips = [...trips];
      updatedTrips[id - 1] = {
        ...updatedTrips[id - 1],
        name: nameInput,
        startingTime: now,
        distanceCovered: 0,
        tripTime: '0.00',
        fuelConsumption: [0, 0, 0, 0],
        initialFuel: initialFuel,
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
              60000; // time in minutes

            const truncatedElapsedTimeInHours =
              Math.floor(elapsedTimeInHours * 10) / 10;
            const newDistance = speed * truncatedElapsedTimeInHours;

            updatedTrips[id - 1] = {
              ...currentTrip,
              distanceCovered: newDistance,
              tripTime: truncatedElapsedTimeInHours.toString(),
            };
          }

          return updatedTrips;
        });
      }, 999); // Changed to 999 milliseconds (Every ~1 second)
    }

    setTripStarted(prevTripStarted => !prevTripStarted);
  }

  useEffect(
    () => console.log('selected Trip:: ', selectedSwitch),
    [selectedSwitch],
  );

  useEffect(() => {
    console.log('trips already existing :', trips);
  }, []);
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
    // console.log('asdas', speedEfficiency);

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
              const initialFuel = Number(currentTrip.initialFuel[index]);
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
      }, 999); // Update every 5 seconds
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
      initialFuel: [0, 0, 0, 0],
    };
  }

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

  // function store_data(id: 1 | 2 | 3, trips: any[]) {
  //   console.log('storing this trip: ', trips[id - 1]);

  //   dispatch(
  //     setTrip({
  //       tripId: id,
  //       data: {
  //         Trips: {
  //           ...currentTrips, // Spread existing trip data to maintain other trips
  //           [id]: {
  //             // tripName: trips[id - 1].name,
  //             startingTime: trips[id - 1].startingTime?.toISOString(),
  //             distanceCovered: trips[id - 1].distanceCovered,
  //             elapsedTime: trips[id - 1].tripTime,
  //             fuelConsumption: trips[id - 1].fuelConsumption,
  //             tripEfficiency: trips[id - 1].tripEfficiency,
  //           },
  //         },
  //       },
  //     }),
  //   );
  // }

  //observe data for all engines
  // useEffect(() => {
  //   console.log(
  //     '🚀 ~ useEffect ~ trips[selectedSwitch - 1].fuelConsumption:',
  //     trips[selectedSwitch - 1].fuelConsumption,
  //   );
  // }, [enginesData1, enginesData2]);

  // useEffect(() => {
  //   console.log('🚀 ~ Trips ~ trips:', trips);
  // }, [trips]);

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
