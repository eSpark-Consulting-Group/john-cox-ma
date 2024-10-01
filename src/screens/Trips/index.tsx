import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import {EngineData, MyTheme, SocketJSON} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {
  RenderModal,
  TripSection,
  RenderRow,
  RenderColumn,
} from './Trips_components';
import {styles} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSocket} from '../../components/SocketProvider';

type TripsScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Trips() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<TripsScreenProps['navigation']>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState<1 | 2 | 3>(1); // Stores the currently selected switch index
  const {resolvedService1, resolvedService2} = useSocket();

  const [tripStarted, setTripStarted] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [allTripData, setAllTripData] = useState({
    1: {
      name: '',
      totalDistance: 0,
      estimatedTime: 0,
      speed: 0,
      date: '',
      time: '',
    },
    2: {
      name: '',
      totalDistance: 0,
      estimatedTime: 0,
      speed: 0,
      date: '',
      time: '',
    },
    3: {
      name: '',
      totalDistance: 0,
      estimatedTime: 0,
      speed: 0,
      date: '',
      time: '',
    },
  });

  const [fuelBurned, setFuelBurned] = useState({
    1: [0, 0, 0, 0],
    2: [0, 0, 0, 0],
    3: [0, 0, 0, 0],
  });
  const handleSwitchPress = (index: 1 | 2 | 3) => {
    setSelectedSwitch(index);
  };
  const continueTrip = async (tripsState: any, tripRefs: any) => {
    const tripJSON = await AsyncStorage.getItem('tripData');
    const newConn = await AsyncStorage.getItem('newConn');
    console.log(tripsState);
    if (tripJSON) {
      if (!newConn) {
        console.log('TRIPS====== =====WEB SOCKET START======');
        const ws = new WebSocket(
          `ws://${resolvedService1?.addresses[0]}:${resolvedService1?.port}/ws`,
        );
        sockCon.current = ws;
        ws.onopen = async () => {
          await AsyncStorage.setItem('newConn', 'true');
          console.log(
            'TRIPS====== WebSocket connection opened for : ',
            `${resolvedService1?.addresses[0]}:${resolvedService1?.port}`,
          );
        };

        ws.onmessage = async e => {
          try {
            const tripStartRef = await AsyncStorage.getItem('tripStartRef');
            if (!tripStartRef) {
              ws.close();
              return;
            }
            const jsonData: SocketJSON = JSON.parse(e.data);
            const enginesData = jsonData.Engines;
            if (!enginesData || enginesData.length === 0) {
              console.log('TRIPS====== No engine data or empty array received');
              ws.close();
              return;
            }
            await AsyncStorage.setItem(
              'enginesData',
              JSON.stringify(enginesData),
            );
          } catch (error) {
            console.log(
              'TRIPS====== Error during WebSocket message processing:',
              error,
            );
            ws.close();
          }
        };

        ws.onerror = e => {
          console.log('TRIPS====== WebSocket error:', e.message);
        };

        ws.onclose = e => {
          const {reason} = e;
          if (e.code === 1006) {
            console.log('TRIPS====== idher');
          }
          console.log(
            'TRIPS====== WebSocket connection closed:',
            e.code,
            reason,
          );
        };
      }
      const tripData = JSON.parse(tripJSON);
      const remainingFuel = JSON.parse(
        (await AsyncStorage.getItem('initialRemainingFuel')) ||
          JSON.stringify({}),
      );
      if (tripsState?.[1]) {
        let totalDistance = tripData?.[1].totalDistance;
        let estimatedTime = tripData?.[1].estimatedTime;
        const date = tripData?.[1].date;
        const time = tripData?.[1].time;
        const name = tripData?.[1].name;
        setAllTripData(prev => ({
          ...prev,
          1: {...prev[1], estimatedTime, totalDistance, date, time, name},
        }));
        const tripStartRef = setInterval(async () => {
          const cachedData: EngineData[] = JSON.parse(
            (await AsyncStorage.getItem('enginesData')) || JSON.stringify([{}]),
          );
          const speed = cachedData[0]?.SensorData?.speed || 0;
          const currDistance = calculateDistance(speed);
          setAllTripData(prev => ({
            ...prev,
            1: {
              ...prev[1],
              estimatedTime: prev[1].estimatedTime + 1,
              totalDistance: prev[1].totalDistance + currDistance,
              speed: speed,
            },
          }));
          totalDistance += currDistance;
          estimatedTime++;
          const o = JSON.parse(
            (await AsyncStorage.getItem('tripData')) || JSON.stringify({}),
          );
          const n = {
            ...o,
            1: {totalDistance, estimatedTime, date, time, name},
          };
          await AsyncStorage.setItem('tripData', JSON.stringify(n));
          const currentRemainingFuel = cachedData.map((e, i) => {
            const parsedFuel: number[] = remainingFuel?.['1'] || [0, 0, 0, 0];
            const diff =
              parsedFuel[i] - (Number(e.FuelManagement.remaining_fuel) | 0);
            return diff;
          });
          setFuelBurned(prev => ({
            ...prev,
            '1': [...currentRemainingFuel, 0, 0],
          }));
        }, 1000);
        const allTripRefs = JSON.parse(
          (await AsyncStorage.getItem('tripStartRef')) || JSON.stringify({}),
        );
        const a = {
          ...allTripRefs,
          1: tripStartRef,
        };
        await AsyncStorage.setItem('tripStartRef', JSON.stringify(a));
      }
      if (tripsState?.[2]) {
        let totalDistance = tripData?.[2].totalDistance;
        let estimatedTime = tripData?.[2].estimatedTime;
        const date = tripData?.[2].date;
        const time = tripData?.[2].time;
        const name = tripData?.[2].name;
        setAllTripData(prev => ({
          ...prev,
          2: {...prev[2], estimatedTime, totalDistance, date, time, name},
        }));
        const tripStartRef = setInterval(async () => {
          const cachedData: EngineData[] = JSON.parse(
            (await AsyncStorage.getItem('enginesData')) || JSON.stringify([{}]),
          );
          const speed = cachedData[0]?.SensorData?.speed || 0;
          const currDistance = calculateDistance(speed);
          setAllTripData(prev => ({
            ...prev,
            2: {
              ...prev[2],
              estimatedTime: prev[2].estimatedTime + 1,
              totalDistance: prev[2].totalDistance + currDistance,
              speed: speed,
            },
          }));
          totalDistance += currDistance;
          estimatedTime++;
          const o = JSON.parse(
            (await AsyncStorage.getItem('tripData')) || JSON.stringify({}),
          );
          const n = {
            ...o,
            2: {totalDistance, estimatedTime, date, time, name},
          };
          await AsyncStorage.setItem('tripData', JSON.stringify(n));
          const currentRemainingFuel = cachedData.map((e, i) => {
            const parsedFuel: number[] = remainingFuel?.['2'] || [0, 0, 0, 0];
            const diff =
              parsedFuel[i] - (Number(e.FuelManagement.remaining_fuel) | 0);
            return diff;
          });
          setFuelBurned(prev => ({
            ...prev,
            '2': [...currentRemainingFuel, 0, 0],
          }));
        }, 1000);
        const allTripRefs = JSON.parse(
          (await AsyncStorage.getItem('tripStartRef')) || JSON.stringify({}),
        );
        const a = {
          ...allTripRefs,
          2: tripStartRef,
        };
        await AsyncStorage.setItem('tripStartRef', JSON.stringify(a));
      }
      if (tripsState?.[3]) {
        let totalDistance = tripData?.[3].totalDistance;
        let estimatedTime = tripData?.[3].estimatedTime;
        const date = tripData?.[3].date;
        const time = tripData?.[3].time;
        const name = tripData?.[3].name;
        setAllTripData(prev => ({
          ...prev,
          3: {...prev[3], estimatedTime, totalDistance, date, name},
        }));
        const tripStartRef = setInterval(async () => {
          const cachedData: EngineData[] = JSON.parse(
            (await AsyncStorage.getItem('enginesData')) || JSON.stringify([{}]),
          );
          const speed = cachedData[0]?.SensorData?.speed || 0;
          const currDistance = calculateDistance(speed);
          setAllTripData(prev => ({
            ...prev,
            3: {
              ...prev[3],
              estimatedTime: prev[3].estimatedTime + 1,
              totalDistance: prev[3].totalDistance + currDistance,
              speed: speed,
            },
          }));
          totalDistance += currDistance;
          estimatedTime++;
          const o = JSON.parse(
            (await AsyncStorage.getItem('tripData')) || JSON.stringify({}),
          );
          const n = {
            ...o,
            3: {totalDistance, estimatedTime, date, time, name},
          };
          await AsyncStorage.setItem('tripData', JSON.stringify(n));
          const currentRemainingFuel = cachedData.map((e, i) => {
            const parsedFuel: number[] = remainingFuel?.['3'] || [0, 0, 0, 0];
            const diff =
              parsedFuel[i] - (Number(e.FuelManagement.remaining_fuel) | 0);
            return diff;
          });
          setFuelBurned(prev => ({
            ...prev,
            '3': [...currentRemainingFuel, 0, 0],
          }));
        }, 1000);
        const allTripRefs = JSON.parse(
          (await AsyncStorage.getItem('tripStartRef')) || JSON.stringify({}),
        );
        const a = {
          ...allTripRefs,
          3: tripStartRef,
        };
        await AsyncStorage.setItem('tripStartRef', JSON.stringify(a));
      }
      while (BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the interval if needed
      }
    }
  };
  useEffect(() => {
    (async () => {
      const tripStartRef = await AsyncStorage.getItem('tripStartRef');
      if (tripStartRef) {
        const tripRefs = JSON.parse(tripStartRef);
        const tripsState = {
          1: false,
          2: false,
          3: false,
          ...tripRefs,
        };
        setTripStarted(tripsState);
        await BackgroundService.stop();
        if (tripsState?.[1]) {
          clearInterval(tripRefs?.[1]);
        }
        if (tripsState?.[2]) {
          clearInterval(tripRefs?.[2]);
        }
        if (tripsState?.[3]) {
          clearInterval(tripRefs?.[3]);
        }

        await AsyncStorage.setItem('closeConn', 'true');
        await BackgroundService.start(
          () => continueTrip(tripsState, tripRefs),
          options,
        );
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
    const enginesData: EngineData[] = JSON.parse(
      (await AsyncStorage.getItem('enginesData')) || JSON.stringify([]),
    );
    if (enginesData?.length) {
      const allInitialFuel = JSON.parse(
        (await AsyncStorage.getItem('initialRemainingFuel')) ||
          JSON.stringify({}),
      );
      console.log(' all initial ');

      const initialRemainingFuel = [
        Number(enginesData[0]?.FuelManagement.remaining_fuel) | 0,
        Number(enginesData[1]?.FuelManagement.remaining_fuel) | 0,
        0,
        0,
      ];
      await AsyncStorage.setItem(
        'initialRemainingFuel',
        JSON.stringify({
          ...allInitialFuel,
          [id]: initialRemainingFuel,
        }),
      );
      console.log('fuel >>>>>>> ', initialRemainingFuel);
    } else {
      await AsyncStorage.setItem('isStarted', id?.toString());
    }
    await AsyncStorage.removeItem('closeConn');
    await AsyncStorage.removeItem('newConn');
    const isTripStarted = await AsyncStorage.getItem('tripStartRef');
    if (!isTripStarted) {
      console.log('=====WEB SOCKET START======');
      const ws = new WebSocket(
        `ws://${resolvedService1?.addresses[0]}:${resolvedService1?.port}/ws`,
      );
      sockCon.current = ws;
      ws.onopen = () => {
        console.log(
          'TRIPS====== WebSocket connection opened for : ',
          'timesp1.local',
        );
      };

      ws.onmessage = async e => {
        try {
          const jsonData: SocketJSON = JSON.parse(e.data);
          const enginesData = jsonData.Engines;
          await AsyncStorage.setItem(
            'enginesData',
            JSON.stringify(enginesData),
          );
          if (!enginesData || enginesData.length === 0) {
            console.log('No engine data or empty array received');
            ws.close();
            return;
          }
          const closeConn = await AsyncStorage.getItem('closeConn');
          if (closeConn) {
            ws.close();
          }
          const isStarted = (await AsyncStorage.getItem('isStarted')) as
            | '1'
            | '2'
            | '3';
          if (isStarted) {
            console.log('Trip start hua', isStarted);
            const allInitialFuel = JSON.parse(
              (await AsyncStorage.getItem('initialRemainingFuel')) ||
                JSON.stringify({}),
            );
            const initialRemainingFuel = [
              enginesData[0]?.FuelManagement.remaining_fuel | 0,
              Number(enginesData[1]?.FuelManagement.remaining_fuel) | 0,
              0,
              0,
            ];
            console.log('fuel ===== ', initialRemainingFuel);

            await AsyncStorage.setItem(
              'initialRemainingFuel',
              JSON.stringify({
                ...allInitialFuel,
                [isStarted]: initialRemainingFuel,
              }),
            );
            await AsyncStorage.removeItem('isStarted');
            return;
          }
        } catch (error) {
          console.log(
            'TRIPS====== Error during WebSocket message processing:',
            error,
          );
          ws.close();
        }
      };

      ws.onerror = e => {
        console.log('TRIPS====== WebSocket error:', e.message);
      };

      ws.onclose = e => {
        const {reason} = e;
        if (e.code === 1006) {
          console.log('TRIPS====== idher');
        }
        console.log('TRIPS====== WebSocket connection closed:', e.code, reason);
      };
    }
    console.log('Trip chalegi...');
    const dateObj = new Date();
    const date = `${dateObj.getDate()}/${
      dateObj.getMonth() + 1
    }/${dateObj.getFullYear()}`;
    const time = `${dateObj.getHours()}:${dateObj.getMinutes()}`;
    setTripStarted(prev => ({...prev, [id]: true}));
    let totalDistance = 0;
    let estimatedTime = 0;
    const tripStartRef = setInterval(async () => {
      const enginesData: EngineData[] = JSON.parse(
        (await AsyncStorage.getItem('enginesData')) || JSON.stringify([{}]),
      );
      const variableSpeed = enginesData[0]?.SensorData?.speed || 0;
      const currDistance = calculateDistance(+variableSpeed);
      setAllTripData(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          estimatedTime: prev[id].estimatedTime + 1,
          totalDistance: prev[id].totalDistance + currDistance,
          speed: variableSpeed,
        },
      }));
      const allFuel = await AsyncStorage.getItem('initialRemainingFuel');
      if (allFuel) {
        const currentRemainingFuel = enginesData.map((e, i) => {
          const a = JSON.parse(allFuel);
          if (a?.[id]) {
            const parsedFuel: number[] = a[id];
            const diff =
              parsedFuel[i] - (Number(e.FuelManagement.remaining_fuel) | 0);
            return diff;
          }
          return 0;
        });
        console.log('current rem fuel >>>>> ', currentRemainingFuel);

        setFuelBurned(prev => ({
          ...prev,
          [id]: [...currentRemainingFuel, 0, 0],
        }));
      }
      totalDistance += currDistance;
      estimatedTime++;
      const tripData = JSON.parse(
        (await AsyncStorage.getItem('tripData')) || JSON.stringify({}),
      );
      const a = {
        ...tripData,
        [id]: {
          totalDistance,
          estimatedTime,
          date,
          time,
          name: allTripData[id].name,
        },
      };
      await AsyncStorage.setItem('tripData', JSON.stringify(a));
    }, 1000);

    setAllTripData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        date,
        time,
      },
    }));
    const tripRefs = JSON.parse(
      (await AsyncStorage.getItem('tripStartRef')) || JSON.stringify({}),
    );
    const a = {
      ...tripRefs,
      [id]: tripStartRef,
    };
    await AsyncStorage.setItem('tripStartRef', JSON.stringify(a));
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
      const trip = JSON.parse(tripStartRef);
      clearInterval(trip?.[1]);
      clearInterval(trip?.[2]);
      clearInterval(trip?.[3]);
      setAllTripData(prev => ({
        1: {
          name: '',
          estimatedTime: 0,
          totalDistance: 0,
          speed: 0,
          date: '',
          time: '',
        },
        '2': {
          name: '',
          estimatedTime: 0,
          totalDistance: 0,
          speed: 0,
          date: '',
          time: '',
        },
        '3': {
          name: '',
          estimatedTime: 0,
          totalDistance: 0,
          speed: 0,
          date: '',
          time: '',
        },
      }));
      setTripStarted({1: false, 2: false, 3: false});
      setFuelBurned({
        1: [0, 0, 0, 0],
        2: [0, 0, 0, 0],
        3: [0, 0, 0, 0],
      });
      await AsyncStorage.removeItem('tripStartRef');
      await AsyncStorage.removeItem('initialRemainingFuel');
      await AsyncStorage.removeItem('variableSpeed');
      await AsyncStorage.removeItem('cachedData');
      await AsyncStorage.removeItem('enginesData');
      console.log('TRIPS====== Ending trip....');
    }
  };

  const calculateEfficience = (id: 1 | 2 | 3) => {
    const result =
      fuelBurned[id].reduce((a, b) => a + b, 0) / allTripData[id].totalDistance;
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
                  {[1, 2, 3].map(val => (
                    <MySwitch
                      key={val}
                      label={val?.toString()}
                      isActive={selectedSwitch === val}
                      onPress={() => handleSwitchPress(val as 1 | 2 | 3)}
                    />
                  ))}
                </View>
              </TripSection>
              <GapView length={5} />
              <TripSection label="Trip Name">
                <View style={styles.inputContainer}>
                  <MyInput
                    placeholder="Enter Name"
                    onChange={text => {
                      setAllTripData(prev => ({
                        ...prev,
                        [selectedSwitch]: {...prev[selectedSwitch], name: text},
                      }));
                    }}
                    value={allTripData[selectedSwitch].name}
                  />
                </View>
              </TripSection>
              <GapView length={5} />
              <RenderRow
                title="Trip Start"
                unit="Date"
                value={allTripData[selectedSwitch].date}
                editable={false}
              />
              <RenderRow
                title=""
                unit="Time"
                value={allTripData[selectedSwitch].time}
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
                  {fuelBurned[selectedSwitch].map((fuel, index) => (
                    <RenderColumn
                      key={'fuel' + index}
                      value={Number(fuel).toFixed(0)}
                      label={index + 1}
                    />
                  ))}
                  <RenderColumn
                    label={'Total'}
                    value={fuelBurned[selectedSwitch]
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
                value={Number(
                  allTripData[selectedSwitch].totalDistance,
                ).toFixed(5)}
              />
              <RenderRow
                title="Estimated Run Time"
                unit="hours/minute"
                value={allTripData[selectedSwitch].estimatedTime?.toString()}
              />
              <RenderRow
                title="Average Speed"
                value={Number(allTripData[selectedSwitch].speed).toFixed(3)} //xxx
                unit="knots"
              />
              <RenderRow
                title="Efficiency"
                unit="Gal/N.Mile"
                value={calculateEfficience(selectedSwitch)}
              />
            </MyCard>
            <GapView length={30} />
            <View style={{flexDirection: 'row', gap: 20}}>
              <MyButton
                label={tripStarted[selectedSwitch] ? 'End Trip' : 'Start Trip'}
                width={80}
                onPress={async () => {
                  if (!tripStarted[selectedSwitch]) {
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
