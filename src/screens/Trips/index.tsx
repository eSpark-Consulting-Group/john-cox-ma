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
import {MyTheme, SocketJSON} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {
  RenderModal,
  TripSection,
  RenderRow,
  RenderColumn,
} from './Trips_components';
import {styles} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TripsScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Trips() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<TripsScreenProps['navigation']>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedSwitch, setSelectedSwitch] = useState<1 | 2 | 3>(1); // Stores the currently selected switch index

  const [tripStarted, setTripStarted] = useState(false);
  const [allTripData, setAllTripData] = useState({
    totalDistance: 0,
    estimatedTime: 0,
    speed: 0,
  });

  const [fuelBurned, setFuelBurned] = useState([0, 0, 0, 0]);
  const handleSwitchPress = (index: 1 | 2 | 3) => {
    setSelectedSwitch(index);
  };
  const continueTrip = async () => {
    const tripJSON = await AsyncStorage.getItem('tripData');
    const newConn = await AsyncStorage.getItem('newConn');
    if (tripJSON) {
      if (!newConn) {
        console.log('=====WEB SOCKET START======');
        const ws = new WebSocket(`ws://timesp1.local/ws`);
        sockCon.current = ws;
        ws.onopen = async () => {
          await AsyncStorage.setItem('newConn', 'true');
          console.log('WebSocket connection opened for : ', 'timesp1.local');
        };

        ws.onmessage = async e => {
          try {
            const tripStartRef = await AsyncStorage.getItem('tripStartRef');
            if (!tripStartRef) {
              ws.close();
              return;
            }
            const jsonData: SocketJSON = JSON.parse(e.data);
            const enginesData = jsonData.data.Engines;
            if (!enginesData || enginesData.length === 0) {
              console.log('No engine data or empty array received');
              ws.close();
              return;
            }
            const vairableSpeed = enginesData[0]?.SensorData?.speed;
            const allFuel = await AsyncStorage.getItem('initialRemainingFuel');
            if (allFuel) {
              const currentRemainingFuel = enginesData.map((e, i) => {
                const parsedFuel: number[] = JSON.parse(allFuel);
                const diff = parsedFuel[i] - e.FuelManagement.remaining_fuel;
                return diff;
              });
              const cachedData = {
                speed: vairableSpeed,
                fuelBurned: [...currentRemainingFuel, 0, 0],
              };
              await AsyncStorage.setItem(
                'cachedData',
                JSON.stringify(cachedData),
              );
            }
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
      }
      const tripData = JSON.parse(tripJSON);
      let totalDistance = tripData.totalDistance;
      let estimatedTime = tripData.estimatedTime;
      setAllTripData(prev => ({...prev, estimatedTime, totalDistance}));
      const tripStartRef = setInterval(async () => {
        const cachedData = await AsyncStorage.getItem('cachedData');
        const parsedData: {
          speed: number;
          fuelBurned: number[];
        } = JSON.parse(cachedData ? cachedData : '') || {
          speed: 0,
          fuelBurned: [0, 0, 0, 0],
        };
        const currDistance = calculateDistance(parsedData.speed);
        setAllTripData(prev => ({
          ...prev,
          estimatedTime: prev.estimatedTime + 1,
          totalDistance: prev.totalDistance + currDistance,
          speed: +parsedData.speed,
        }));
        totalDistance += currDistance;
        estimatedTime++;
        await AsyncStorage.setItem(
          'tripData',
          JSON.stringify({totalDistance, estimatedTime}),
        );
        setFuelBurned(parsedData.fuelBurned);
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
  const startTrip = async (id: 1 | 2 | 3) => {
    let variableSpeed = 0;
    let tripStarted = false;
    await AsyncStorage.removeItem('closeConn');
    await AsyncStorage.removeItem('newConn');
    console.log('=====WEB SOCKET START======');
    const ws = new WebSocket(`ws://timesp1.local/ws`);
    sockCon.current = ws;
    ws.onopen = () => {
      console.log('WebSocket connection opened for : ', 'timesp1.local');
    };

    ws.onmessage = async e => {
      try {
        const jsonData: SocketJSON = JSON.parse(e.data);
        const enginesData = jsonData.data.Engines;
        if (!enginesData || enginesData.length === 0) {
          console.log('No engine data or empty array received');
          ws.close();
          return;
        }
        const closeConn = await AsyncStorage.getItem('closeConn');
        if (closeConn) {
          ws.close();
        }
        variableSpeed = enginesData[0]?.SensorData?.speed;
        setAllTripData(prev => ({...prev, speed: variableSpeed}));
        if (!tripStarted) {
          const initialRemainingFuel = [
            enginesData[0]?.FuelManagement.remaining_fuel | 0,
            enginesData[1]?.FuelManagement.remaining_fuel | 0,
            0,
            0,
          ];
          await AsyncStorage.setItem(
            'initialRemainingFuel',
            JSON.stringify(initialRemainingFuel),
          );
          tripStarted = true;
          return;
        }
        const allFuel = await AsyncStorage.getItem('initialRemainingFuel');
        if (allFuel) {
          const currentRemainingFuel = enginesData.map((e, i) => {
            const parsedFuel: number[] = JSON.parse(allFuel);
            const diff = parsedFuel[i] - e.FuelManagement.remaining_fuel;
            return diff;
          });
          setFuelBurned([...currentRemainingFuel, 0, 0]);
        }
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
    let estimatedTime = 0;
    const tripStartRef = setInterval(async () => {
      const currDistance = calculateDistance(variableSpeed);
      setAllTripData(prev => ({
        ...prev,
        estimatedTime: prev.estimatedTime + 1,
        totalDistance: prev.totalDistance + currDistance,
      }));
      totalDistance += currDistance;
      estimatedTime++;
      await AsyncStorage.setItem(
        'tripData',
        JSON.stringify({totalDistance, estimatedTime}),
      );
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
      setAllTripData(prev => ({
        estimatedTime: 0,
        totalDistance: 0,
        speed: 0,
      }));
      setTripStarted(false);
      await AsyncStorage.removeItem('isTripStarted');
      await AsyncStorage.removeItem('tripStartRef');
      console.log('Ending trip....');
      setFuelBurned([0, 0, 0, 0]);
    }
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

  const calculateEfficience = () => {
    const result =
      fuelBurned.reduce((a, b) => a + b, 0) / allTripData.totalDistance;
    if (!Number.isNaN(result) && result !== Infinity) {
      return result.toFixed(2);
    }
    return '0.00';
  };

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
                    value={''}
                  />
                </View>
              </TripSection>
              <GapView length={5} />
              <RenderRow
                title="Trip Start"
                unit="Date"
                value={''}
                editable={false}
              />
              <RenderRow title="" unit="Time" value={''} editable={false} />
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <View style={styles.card2}>
                <View style={styles.innercard2}>
                  <MyText fontFamily="AnonymousPro-Regular">Engines</MyText>
                  <MyText size={16}>Fuel Used</MyText>
                </View>
                <View style={styles.boxes}>
                  {fuelBurned.map((fuel, index) => (
                    <RenderColumn
                      key={'fuel' + index}
                      value={Number(fuel).toFixed(2)}
                      label={index + 1}
                    />
                  ))}
                  <RenderColumn
                    label={'Total'}
                    value={fuelBurned.reduce((a, b) => a + b, 0).toFixed(2)}
                  />
                </View>
              </View>
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <RenderRow
                title="Total Distance"
                unit="N.Mile"
                value={Number(allTripData.totalDistance).toFixed(5)}
              />
              <RenderRow
                title="Estimated Run Time"
                unit="hours/minute"
                value={allTripData.estimatedTime.toString()}
              />
              <RenderRow
                title="Average Speed"
                value={Number(allTripData.speed).toFixed(3)} //xxx
                unit="knots"
              />
              <RenderRow
                title="Efficiency"
                unit="Gal/N.Mile"
                value={calculateEfficience()}
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
                      () => startTrip(selectedSwitch),
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
