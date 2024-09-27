import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import BackgroundService from 'react-native-background-actions';

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
import {MyTheme, SocketJSON, TripData} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {useSocket} from '../../components/SocketProvider';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import {RootState} from '../../app/store';
import {
  RenderModal,
  TripSection,
  RenderRow,
  RenderColumn,
} from './Trips_components';
import {formatDate, formatTime} from './utils';
import {styles} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TripsScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Trips() {
  const theme = useTheme() as MyTheme;
  const {enginesData1, speed, enginesData2} = useSocket();
  const navigation = useNavigation<TripsScreenProps['navigation']>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedSwitch, setSelectedSwitch] = useState<1 | 2 | 3>(1); // Stores the currently selected switch index

  const dispatch = useDispatch();
  const currentTrips = useSelector((state: RootState) => state.trip.Trips);
  const [trips, setTrips] = useState<TripData[]>(Object.values(currentTrips));
  const [tripStarted, setTripStarted] = useState(false);
  const [totalDistanceCovered, setTotalDistanceCovered] = useState(0);
  const intervalRefs = useRef<Array<NodeJS.Timeout | null>>([null, null, null]); // main data set
  const intervalRefs1 = useRef<Array<NodeJS.Timeout | null>>([
    null,
    null,
    null,
  ]); //fuel Data keliye
  const latestEngineDataRef = useRef({enginesData1, enginesData2});

  const handleSwitchPress = (index: 1 | 2 | 3) => {
    setSelectedSwitch(index);
  };
  const continueTrip = async () => {
    const tripJSON = await AsyncStorage.getItem('tripData');
    if (tripJSON) {
      let CONSTANT_SPEED = 0;
      if (true) {
        console.log('=====WEB SOCKET START======');
        const ws = new WebSocket(`ws://timesp1.local/ws`);
        sockCon.current = ws;
        ws.onopen = () => {
          console.log('WebSocket connection opened for : ', 'timesp2.local');
        };

        ws.onmessage = e => {
          try {
            const jsonData: SocketJSON = JSON.parse(e.data);
            const enginesData = jsonData.Engines;
            if (!enginesData || enginesData.length === 0) {
              console.log('No engine data or empty array received');
              ws.close();
              return;
            }
            console.log({speed2: enginesData[0].SensorData.speed});
            CONSTANT_SPEED = enginesData[0].SensorData.speed;
          } catch (error) {
            console.log('Error during WebSocket message processing:', error);
            ws.close();
          }
        };

        ws.onerror = e => {
          console.log('WebSocket error:', e.message);
        };

        ws.onclose = e => {
          const {reason} = e;
          if (e.code === 1006) {
            console.log('idher');
          }
          console.log('WebSocket connection closed 2:', e.code, reason);
        };
      }
      const tripData = JSON.parse(tripJSON);
      let totalDistance = tripData.totalDistance;
      setTotalDistanceCovered(totalDistance);
      const tripStartRef = setInterval(async () => {
        const currDistance = calculateDistance(CONSTANT_SPEED);
        console.log(currDistance);
        setTotalDistanceCovered(prev => prev + currDistance);
        totalDistance += currDistance;
        await AsyncStorage.setItem('tripData', JSON.stringify({totalDistance}));
      }, 1000);
      await AsyncStorage.setItem('tripStartRef', JSON.stringify(tripStartRef));
      while (BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the interval if needed
      }
    }
  };
  useEffect(() => {
    (async () => {
      const tripStartRef = await AsyncStorage.getItem('tripStartRef');
      if (tripStartRef) {
        setTripStarted(true);
        await BackgroundService.stop();
        clearInterval(JSON.parse(tripStartRef));
        await AsyncStorage.setItem('closeConn', 'true');
        await BackgroundService.start(continueTrip, options);
      }
    })();
  }, []);

  useEffect(() => {
    console.log('From store====', currentTrips);
  }, [currentTrips, selectedSwitch]);
  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
      delay: 1000,
    },
  };

  const calculateDistance = (speed: number) => {
    return speed * (1 / 3600);
  };
  const sockCon = useRef<WebSocket>();
  const startTrip = async (id: 1 | 2 | 3, speed: number) => {
    let CONSTANT_SPEED = 0;
    await AsyncStorage.removeItem('closeConn');
    console.log('=====WEB SOCKET START======');
    const ws = new WebSocket(`ws://timesp1.local/ws`);
    sockCon.current = ws;
    ws.onopen = () => {
      console.log('WebSocket connection opened for : ', 'timesp1.local');
    };

    ws.onmessage = async e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        const enginesData = jsonData.Engines;
        if (!enginesData || enginesData.length === 0) {
          console.log('No engine data or empty array received');
          ws.close();
          return;
        }
        const closeConn = await AsyncStorage.getItem('closeConn');
        if (closeConn) {
          ws.close();
        }
        console.log({speed: enginesData[0].SensorData.speed});
        CONSTANT_SPEED = enginesData[0].SensorData.speed;
      } catch (error) {
        console.log('Error during WebSocket message processing:', error);
        ws.close();
      }
    };

    ws.onerror = e => {
      console.log('WebSocket error:', e.message);
    };

    ws.onclose = e => {
      const {reason} = e;
      if (e.code === 1006) {
        console.log('idher');
      }
      console.log('WebSocket connection closed:', e.code, reason);
    };
    setTripStarted(true);
    let totalDistance = 0;
    const tripStartRef = setInterval(async () => {
      const currDistance = calculateDistance(CONSTANT_SPEED);
      setTotalDistanceCovered(prev => prev + currDistance);
      totalDistance += currDistance;
      await AsyncStorage.setItem('tripData', JSON.stringify({totalDistance}));
    }, 1000);
    await AsyncStorage.setItem('tripStartRef', JSON.stringify(tripStartRef));
    while (BackgroundService.isRunning()) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the interval if needed
    }
  };

  const endTrip = async () => {
    await BackgroundService.stop();
    const tripStartRef = await AsyncStorage.getItem('tripStartRef');
    if (sockCon.current) {
      sockCon.current.close();
    }
    if (tripStartRef) {
      clearInterval(JSON.parse(tripStartRef));
      setTotalDistanceCovered(0);
      setTripStarted(false);
      await AsyncStorage.removeItem('isTripStarted');
      await AsyncStorage.removeItem('tripStartRef');
    }
  };
  const speedEfficiency = useMemo(() => {
    const totalFuelBurned1 =
      Number(trips[selectedSwitch - 1].fuelConsumption[0] || 0) +
      Number(trips[selectedSwitch - 1].fuelConsumption[1] || 0);
    const totalFuelBurned2 =
      Number(trips[selectedSwitch - 1].fuelConsumption[2] || 0) +
      Number(trips[selectedSwitch - 1].fuelConsumption[3] || 0);

    const totalFuelBurned = totalFuelBurned1 + totalFuelBurned2;

    // Efficiency in gallon per nautical mile
    return totalFuelBurned > 0
      ? totalFuelBurned / Number(totalDistanceCovered) //to be changed
      : 0;
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
  }, [enginesData1, enginesData2]);

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

  useEffect(() => {
    if (warningVisible) {
      const timer = setTimeout(() => {
        setWarningVisible(false);
        setResetVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [warningVisible]);

  // useEffect(() => {
  //   if (resetVisible) {
  //     const timer = setTimeout(() => {
  //       handleStartTrip(selectedSwitch, Number(speed));
  //       setResetVisible(false);
  //       setShowConfirmation(false);
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [resetVisible]);

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
                  Number(totalDistanceCovered).toFixed(5)
                  // trips[selectedSwitch - 1].tripStarted
                  //   ? Number(trips[selectedSwitch - 1].distanceCovered).toFixed(
                  //       2,
                  //     )
                  //   : '0.00'
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
                label={tripStarted ? 'End Trip' : 'Start Trip'}
                width={80}
                onPress={async () => {
                  if (!tripStarted) {
                    // handleStartTrip(selectedSwitch, Number(speed));
                    await BackgroundService.start(
                      () => startTrip(selectedSwitch, Number(speed)),
                      options,
                    );
                  } else {
                    endTrip();
                  }
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
