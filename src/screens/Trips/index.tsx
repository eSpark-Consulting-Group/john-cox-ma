import React, {useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, ToastAndroid, View} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
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
import {
  DistanceUnit,
  MyTheme,
  SocketJSON,
  TimeFormat,
  VolumeUnit,
} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {
  RenderModal,
  TripSection,
  RenderRow,
  RenderColumn,
} from './Trips_components';
import {styles} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import {useService} from '../../components/ServiceProvider';
import {
  convertConsumption,
  distanceUnit,
  distanceValue,
  formatTime,
  getUnits,
  volumeUnit,
  volumeValue,
} from '../FMMSetup/utils';

type TripsScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Trips() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<TripsScreenProps['navigation']>();
  const [warningVisible, setWarningVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState<1 | 2 | 3>(1); // Stores the currently selected switch index
  const {resolvedService1, resolvedService2} = useService();

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
      fuelBurned: [0, 0, 0, 0],
    },
    2: {
      name: '',
      totalDistance: 0,
      estimatedTime: 0,
      speed: 0,
      date: '',
      time: '',
      fuelBurned: [0, 0, 0, 0],
    },
    3: {
      name: '',
      totalDistance: 0,
      estimatedTime: 0,
      speed: 0,
      date: '',
      time: '',
      fuelBurned: [0, 0, 0, 0],
    },
  });
  const [units, setUnits] = useState<{
    distance: DistanceUnit;
    volume: VolumeUnit;
    time: TimeFormat;
  }>();
  const hasFocusedRef = useRef(false);
  const [nameError, setNameError] = useState(false);

  const handleSwitchPress = (index: 1 | 2 | 3) => {
    setSelectedSwitch(index);
  };

  const fetchUnits = async () => {
    const unitsData = await getUnits();
    console.log('Fetched Units Data:', unitsData);

    if (unitsData) {
      setUnits(unitsData);
    }
  };

  // Only run when the screen comes into focus, once
  useFocusEffect(
    React.useCallback(() => {
      if (hasFocusedRef.current) {
        return;
      }
      fetchUnits();
      hasFocusedRef.current = true;

      return () => {
        hasFocusedRef.current = false;
      };
    }, []),
  );

  useEffect(() => {
    console.log('asndklnaskd ==', allTripData[selectedSwitch].fuelBurned);
  }, [allTripData]);

  useEffect(() => {
    setNameError(false);
  }, [selectedSwitch]);

  const continueTrip = async (tripsState: any, tripRefs: any) => {
    const tripJSON = await AsyncStorage.getItem('tripData');
    const newConn = await AsyncStorage.getItem('newConn');
    if (tripJSON) {
      if (!newConn) {
        console.log('TRIPS====== =====WEB SOCKET START======');
        const ws = new WebSocket(
          `ws://${resolvedService1?.addresses[0]}:${resolvedService1?.port}/ws`,
        );
        sockCon.current.timesp1 = ws;
        if (resolvedService2?.addresses[0]) {
          const ws2 = new WebSocket(
            `ws://${resolvedService2?.addresses[0]}:${resolvedService2?.port}/ws`,
          );
          sockCon.current.timesp2 = ws2;
          ws.onopen = async () => {
            await AsyncStorage.setItem('newConn', 'true');
            console.log(
              'TRIPS====== WebSocket connection opened for : ',
              `${resolvedService1?.addresses[0]}:${resolvedService1?.port}`,
            );
          };
          ws2.onopen = async () => {
            console.log(
              'TRIPS====== WebSocket connection opened for : ',
              `timesp2.local`,
            );
          };
          ws2.onmessage = async e => {
            try {
              const tripStartRef = await AsyncStorage.getItem('tripStartRef');
              if (!tripStartRef) {
                ws2.close();
                return;
              }
              const jsonData: SocketJSON = JSON.parse(e.data);
              const enginesData = jsonData;
              if (!enginesData?.Engines || enginesData.Engines.length === 0) {
                console.log(
                  'TRIPS====== No engine data or empty array received',
                );
                ws2.close();
                return;
              }
              await AsyncStorage.setItem(
                'enginesData2',
                JSON.stringify(enginesData),
              );
            } catch (error) {
              console.log(
                'TRIPS====== Error during WebSocket message processing:',
                error,
              );
              ws2.close();
            }
          };
        }

        ws.onmessage = async e => {
          try {
            const tripStartRef = await AsyncStorage.getItem('tripStartRef');
            if (!tripStartRef) {
              ws.close();
              return;
            }
            const jsonData: SocketJSON = JSON.parse(e.data);
            const enginesData = jsonData;
            if (!enginesData?.Engines || enginesData.Engines.length === 0) {
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
      const initialFuelBurn = JSON.parse(
        (await AsyncStorage.getItem('initialFuelBurn')) || JSON.stringify({}),
      );
      const initialFuelBurn2 = JSON.parse(
        (await AsyncStorage.getItem('initialFuelBurn2')) || JSON.stringify({}),
      );
      console.log('intitninit: ', initialFuelBurn);

      const keys = Object.keys(tripsState);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as '1' | '2' | '3';
        if (tripsState?.[key]) {
          let totalDistance = tripData?.[key].totalDistance;
          let estimatedTime = tripData?.[key].estimatedTime;
          const date = tripData?.[key].date;
          const time = tripData?.[key].time;
          const name = tripData?.[key].name;
          setAllTripData(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              estimatedTime,
              totalDistance,
              date,
              time,
              name,
            },
          }));
          const tripStartRef = setInterval(async () => {
            const cachedData: SocketJSON = JSON.parse(
              (await AsyncStorage.getItem('enginesData')) || JSON.stringify([]),
            );
            const cachedData2: SocketJSON = JSON.parse(
              (await AsyncStorage.getItem('enginesData2')) ||
                JSON.stringify([]),
            );
            const speed = cachedData.speed || cachedData2.speed || 0;
            const currDistance = calculateDistance(Number(speed));
            totalDistance += currDistance;
            estimatedTime++;
            const o = JSON.parse(
              (await AsyncStorage.getItem('tripData')) || JSON.stringify({}),
            );
            console.log('inintinintinit: ', initialFuelBurn);

            const currentFuelBurn = cachedData.Engines.map((e, i) => {
              const parsedFuel: number[] = initialFuelBurn?.[key] || [
                0, 0, 0, 0,
              ];

              const diff =
                Number(e.FuelManagement.total_fuel_burned) - parsedFuel[i];

              return diff < 0 ? 0 : diff;
            });
            // console.log('cajksbjkas', cachedData2);
            console.log(
              'iinininini1111111111',
              initialFuelBurn,
              initialFuelBurn2,
            );

            const currentFuelBurn2 = cachedData2.Engines
              ? cachedData2.Engines.map((e, i) => {
                  const parsedFuel: number[] = initialFuelBurn2?.[key] || [
                    0, 0, 0, 0,
                  ];
                  console.log('parsed:', parsedFuel);

                  const diff =
                    Number(e.FuelManagement.total_fuel_burned) - parsedFuel[i];
                  return diff < 0 ? 0 : diff;
                })
              : [0, 0];

            console.log('22222222: ', currentFuelBurn2);

            const [a, b] = currentFuelBurn;

            setAllTripData(prev => ({
              ...prev,
              [key]: {
                ...prev[key],
                estimatedTime: prev[key].estimatedTime + 1,
                totalDistance: prev[key].totalDistance + currDistance,
                speed: speed,
                fuelBurned: [a, b, ...currentFuelBurn2],
              },
            }));
            const n = {
              ...o,
              [key]: {
                totalDistance,
                estimatedTime,
                date,
                time,
                name,
                fuelBurned: [a, b, ...currentFuelBurn2],
              },
            };
            await AsyncStorage.setItem('tripData', JSON.stringify(n));
          }, 1000);
          const allTripRefs = JSON.parse(
            (await AsyncStorage.getItem('tripStartRef')) || JSON.stringify({}),
          );
          const a = {
            ...allTripRefs,
            [key]: tripStartRef,
          };
          await AsyncStorage.setItem('tripStartRef', JSON.stringify(a));
        }
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

  useEffect(() => {
    if (warningVisible) {
      setTimeout(() => {
        setWarningVisible(false);
        setResetVisible(true);
      }, 2000);
    }
  }, [warningVisible]);

  useEffect(() => {
    if (resetVisible) {
      setTimeout(() => {
        setShowConfirmation(false);
        setResetVisible(false);
      }, 3000);
    }
  }, [resetVisible]);

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
  const sockCon = useRef<{
    timesp1: WebSocket | null;
    timesp2: WebSocket | null;
  }>({
    timesp1: null,
    timesp2: null,
  });
  const startTrip = async (id: 1 | 2 | 3) => {
    const enginesData: SocketJSON = JSON.parse(
      (await AsyncStorage.getItem('enginesData')) || JSON.stringify([]),
    );
    const enginesData2: SocketJSON = JSON.parse(
      (await AsyncStorage.getItem('enginesData2')) || JSON.stringify([]),
    );
    console.log({enginesData});

    if (enginesData?.Engines?.length) {
      const allInitialFuel = JSON.parse(
        (await AsyncStorage.getItem('initialFuelBurn')) || JSON.stringify({}),
      );
      const initialFuelBurn = [
        Number(enginesData.Engines[0]?.FuelManagement.total_fuel_burned) | 0,
        Number(enginesData.Engines[1]?.FuelManagement.total_fuel_burned) | 0,
      ];
      console.log('on start', initialFuelBurn);
      // console.log('ye dekhein: ', initialFuelBurn);

      await AsyncStorage.setItem(
        'initialFuelBurn',
        JSON.stringify({...allInitialFuel, [id]: initialFuelBurn}),
      );
    } else {
      await AsyncStorage.setItem('isStarted', id?.toString()); //?
    }
    if (enginesData2?.Engines?.length) {
      const allInitialFuel = JSON.parse(
        (await AsyncStorage.getItem('initialFuelBurn2')) || JSON.stringify({}),
      );
      const initialFuelBurn2 = [
        Number(enginesData2.Engines[0]?.FuelManagement.total_fuel_burned) | 0,
        Number(enginesData2.Engines[1]?.FuelManagement.total_fuel_burned) | 0,
      ];

      await AsyncStorage.setItem(
        'initialFuelBurn2',
        JSON.stringify({...allInitialFuel, [id]: initialFuelBurn2}),
      );
      console.log('ye dekhein: ', initialFuelBurn2);
    } else {
      await AsyncStorage.setItem('isStarted2', id?.toString()); //?
    }

    await AsyncStorage.removeItem('closeConn');
    const isTripStarted = await AsyncStorage.getItem('tripStartRef');
    if (!isTripStarted) {
      await AsyncStorage.removeItem('newConn');
      console.log('=====WEB SOCKET START======');
      const ws = new WebSocket(
        `ws://${resolvedService1?.addresses[0]}:${resolvedService1?.port}/ws`,
      );
      sockCon.current.timesp1 = ws;
      if (resolvedService2?.addresses[0]) {
        const ws2 = new WebSocket(
          `ws://${resolvedService2?.addresses[0]}:${resolvedService2?.port}/ws`,
        );
        sockCon.current.timesp2 = ws2;
        ws2.onopen = () => {
          console.log(
            'TRIPS====== WebSocket connection opened for :  timesp2.local',
          );
        };

        ws2.onmessage = async e => {
          try {
            const jsonData: SocketJSON = JSON.parse(e.data);
            const enginesData = jsonData;
            await AsyncStorage.setItem(
              'enginesData2',
              JSON.stringify(enginesData),
            );
            if (!enginesData?.Engines || enginesData.Engines.length === 0) {
              console.log('No engine data or empty array received');
              ws2.close();
              return;
            }
            const closeConn = await AsyncStorage.getItem('closeConn');
            if (closeConn) {
              ws2.close();
            }
            const isStarted2 = (await AsyncStorage.getItem('isStarted2')) as
              | '1'
              | '2'
              | '3';
            if (isStarted2) {
              console.log('Eninge 2 start hua =======', isStarted2);

              const initialFuelBurn = JSON.parse(
                (await AsyncStorage.getItem('initialFuelBurn2')) ||
                  JSON.stringify({}),
              );
              console.log('timesp2 keliye: ', initialFuelBurn);

              const currentFuelBurn = [
                Number(
                  enginesData.Engines[0]?.FuelManagement.total_fuel_burned,
                ) | 0,
                Number(
                  enginesData.Engines[1]?.FuelManagement.total_fuel_burned,
                ) | 0,
              ];
              console.log('abhi pata chl jayega: ', currentFuelBurn);

              await AsyncStorage.setItem(
                'initialFuelBurn2',
                JSON.stringify({
                  ...initialFuelBurn,
                  [isStarted2]: currentFuelBurn,
                }),
              );

              await AsyncStorage.removeItem('isStarted2');
              return;
            }
          } catch (error) {
            console.log(
              'TRIPS====== Error during WebSocket message processing:',
              error,
            );
            ws2.close();
          }
        };
      }
      ws.onopen = () => {
        console.log(
          'TRIPS====== WebSocket connection opened for : ',
          'timesp1.local',
        );
      };

      ws.onmessage = async e => {
        try {
          const jsonData: SocketJSON = JSON.parse(e.data);
          const enginesData = jsonData;
          if (!enginesData?.Engines || enginesData.Engines.length === 0) {
            console.log('No engine data or empty array received');
            ws.close();
            return;
          }
          await AsyncStorage.setItem(
            'enginesData',
            JSON.stringify(enginesData),
          );
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

            const initialFuelBurn = JSON.parse(
              (await AsyncStorage.getItem('initialFuelBurn')) ||
                JSON.stringify({}),
            );

            const currentFuelBurn = [
              Number(enginesData.Engines[0]?.FuelManagement.total_fuel_burned) |
                0,
              Number(enginesData.Engines[1]?.FuelManagement.total_fuel_burned) |
                0,
            ];
            await AsyncStorage.setItem(
              'initialFuelBurn',
              JSON.stringify({
                ...initialFuelBurn,
                [isStarted]: currentFuelBurn,
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
    const dateObj = new Date();
    const date = `${dateObj.getDate()}/${
      dateObj.getMonth() + 1
    }/${dateObj.getFullYear()}`;
    const time = `${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(
      2,
      '0',
    )}`;
    setTripStarted(prev => ({...prev, [id]: true}));
    let totalDistance = 0;
    let estimatedTime = 0;
    const tripStartRef = setInterval(async () => {
      const enginesData: SocketJSON = JSON.parse(
        (await AsyncStorage.getItem('enginesData')) || JSON.stringify([]),
      );
      const enginesData2: SocketJSON = JSON.parse(
        (await AsyncStorage.getItem('enginesData2')) || JSON.stringify([]),
      );
      const variableSpeed = enginesData.speed || enginesData2.speed || 0;
      const currDistance = calculateDistance(+variableSpeed);

      const initialFuelBurn = await AsyncStorage.getItem('initialFuelBurn');
      const initialFuelBurn2 = await AsyncStorage.getItem('initialFuelBurn2');
      let currentFuelBurn: number[] = [];
      if (initialFuelBurn) {
        currentFuelBurn = enginesData.Engines.map((e, i) => {
          const a = JSON.parse(initialFuelBurn);
          if (a?.[id]) {
            const parsedFuel: number[] = a[id];
            const diff =
              Number(e.FuelManagement.total_fuel_burned)! - parsedFuel[i];
            return diff < 0 ? 0 : diff;
          }
          return 0;
        });
        currentFuelBurn = [...currentFuelBurn, 0, 0];
      }
      if (initialFuelBurn2) {
        const f = enginesData2.Engines.map((e, i) => {
          const a = JSON.parse(initialFuelBurn2);
          if (a?.[id]) {
            const parsedFuel: number[] = a[id];
            const diff =
              Number(e.FuelManagement.total_fuel_burned)! - parsedFuel[i];
            return diff < 0 ? 0 : diff;
          }
          return 0;
        });
        const [a, b] = currentFuelBurn;
        currentFuelBurn = [a, b, ...f];
      }

      console.log('currrrr: ', currentFuelBurn);

      setAllTripData(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          estimatedTime: prev[id].estimatedTime + 1,
          totalDistance: prev[id].totalDistance + currDistance,
          speed: variableSpeed,
          fuelBurned: currentFuelBurn,
        },
      }));
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
          fuelBurned: currentFuelBurn,
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
    console.log(a, '<<<<<<<<<');
    await AsyncStorage.setItem('tripStartRef', JSON.stringify(a));
    while (BackgroundService.isRunning()) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the interval if needed
    }
  };

  const endTrip = async (id: 1 | 2 | 3, reset?: boolean) => {
    const tripStartRef = await AsyncStorage.getItem('tripStartRef');
    if (tripStartRef) {
      if (reset) {
        setWarningVisible(true);
      }
      const trip = JSON.parse(tripStartRef);
      console.log({trip});

      if (trip?.[id]) {
        clearInterval(trip?.[id]);
        setAllTripData(prev => ({
          ...prev,
          [id]: {
            name: reset ? allTripData[selectedSwitch].name : '',
            estimatedTime: 0,
            totalDistance: 0,
            speed: 0,
            date: '',
            time: '',
            fuelBurned: [0, 0, 0, 0],
          },
        }));
        setTripStarted(prev => ({...prev, [id]: false}));
        const newTripRef = {...trip};
        delete newTripRef[id];
        await AsyncStorage.setItem('tripStartRef', JSON.stringify(newTripRef));
      }
      console.log({trip});

      if (Object.keys(trip).length === 1) {
        await BackgroundService.stop();
        if (sockCon.current.timesp1) {
          sockCon.current.timesp1.close();
        }
        if (sockCon.current.timesp2) {
          sockCon.current.timesp2.close();
        }
        await AsyncStorage.removeItem('tripStartRef');
        await AsyncStorage.removeItem('initialFuelBurn');
        await AsyncStorage.removeItem('variableSpeed');
        await AsyncStorage.removeItem('enginesData');
        await AsyncStorage.removeItem('enginesData2');
        await AsyncStorage.removeItem('initialFuelBurn2');
      }
      if (reset) {
        console.log('resetted data!');
        return;
      }
      try {
        const tripData: {
          [key: string]: {
            fuelBurned: number[];
            totalDistance: number;
          };
        } = JSON.parse(
          (await AsyncStorage.getItem('tripData')) || JSON.stringify({}),
        );

        const calculateEfficiency = () => {
          console.log('effffffffff', tripData[id].fuelBurned);

          const result =
            tripData[id].fuelBurned.reduce((a, b) => a + b, 0) /
            tripData[id].totalDistance;
          if (!Number.isNaN(result) && result !== Infinity) {
            return result!.toFixed(2);
          }
          return '0.00';
        };

        // saving trip data to filesystem
        const allTripsLogs = {
          [Date.now()]: {
            ...tripData[id],
            fuelEfficiency: calculateEfficiency(),
          },
        };
        let directoryUri = (await AsyncStorage.getItem('directoryUri')) || '';
        if (Platform.OS === 'android') {
          if (!directoryUri) {
            const permissions =
              await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
              directoryUri = permissions.directoryUri;
              await AsyncStorage.setItem(
                'directoryUri',
                permissions.directoryUri,
              );
            }
          }
          const fileName = 'trips.json';
          const files =
            await FileSystem.StorageAccessFramework.readDirectoryAsync(
              directoryUri,
            );
          const existingFileUri = files.find(file => file.includes(fileName));
          let existingData = {};
          if (existingFileUri) {
            const fileContent = await FileSystem.readAsStringAsync(
              existingFileUri,
            );
            try {
              existingData = JSON.parse(fileContent);
            } catch (error) {
              console.error('Error parsing existing JSON:', error);
            }
          }
          const updatedData = {...existingData, ...allTripsLogs};
          if (existingFileUri) {
            await FileSystem.writeAsStringAsync(
              existingFileUri,
              JSON.stringify(updatedData),
              {
                encoding: FileSystem.EncodingType.UTF8,
              },
            );
            console.log(
              'File successfully updated with merged data:',
              existingFileUri,
            );
          } else {
            const newFileUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                directoryUri,
                fileName,
                'application/json',
              );
            await FileSystem.writeAsStringAsync(
              newFileUri,
              JSON.stringify(updatedData),
              {
                encoding: FileSystem.EncodingType.UTF8,
              },
            );
            console.log('File created and saved successfully:', newFileUri);
          }
        }
        console.log('TRIPS====== Ending trip....');
      } catch (e) {
        console.log(e, '>>>>>>');
      }
    } else {
      console.log('cannot reset');
      ToastAndroid.show('Trip is not started', ToastAndroid.SHORT);
    }
  };

  const calculateEfficiency = (id: 1 | 2 | 3): string => {
    const tripData = allTripData[id];

    const totalFuelBurned = tripData.fuelBurned.reduce((a, b) => a + b, 0);
    const result = totalFuelBurned / tripData.totalDistance;

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
          {
            flexGrow: 1,
            flex: showConfirmation ? 1 : 0,
            justifyContent: showConfirmation ? 'center' : 'space-between',
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <MyHeader />
        {showConfirmation ? (
          <View style={[styles.confirmation, {padding: 20}]}>
            <View style={styles.inner}>
              <MyText size={24} style={styles.confirmationMessage}>
                Are you sure you want to Reset Trip {selectedSwitch}?
              </MyText>
              <MyText
                textColor={theme.colors.secondary}
                style={styles.confirmation}
                size={18}>
                Resetting will over-write prior data
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
                  onPress={() => endTrip(selectedSwitch, true)}
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
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
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
                    editable={allTripData[selectedSwitch].date ? false : true}
                    placeholder={
                      nameError ? 'Enter name to start trip' : 'Enter Name'
                    }
                    onChange={text => {
                      setAllTripData(prev => ({
                        ...prev,
                        [selectedSwitch]: {...prev[selectedSwitch], name: text},
                      }));
                    }}
                    value={allTripData[selectedSwitch].name}
                    color={nameError ? 'red' : theme.colors.primary}
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
                value={formatTime(
                  allTripData[selectedSwitch].time,
                  units?.time!,
                )}
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
                  {allTripData[selectedSwitch].fuelBurned.map((fuel, index) => (
                    <RenderColumn
                      key={'fuel' + index}
                      value={volumeValue(
                        Number(fuel),
                        volumeUnit(units?.volume!),
                      )!.toFixed(0)}
                      label={index + 1}
                      volUnit={units?.volume!}
                    />
                  ))}
                  <RenderColumn
                    label={'Total'}
                    value={volumeValue(
                      allTripData[selectedSwitch].fuelBurned.reduce(
                        (a, b) => a + b,
                        0,
                      ),
                      volumeUnit(units?.volume!),
                    )!.toFixed(2)}
                    volUnit={units?.volume!}
                  />
                </View>
              </View>
            </MyCard>
            <GapView length={20} />
            <MyCard>
              <RenderRow
                title="Total Distance"
                editable={false}
                unit={distanceUnit(units?.distance!)}
                value={distanceValue(
                  Number(allTripData[selectedSwitch].totalDistance),
                  distanceUnit(units?.distance!),
                )!.toFixed(5)}
              />
              <RenderRow
                title="Estimated Run Time"
                unit="hours/minute"
                editable={false}
                value={allTripData[selectedSwitch].estimatedTime?.toString()}
              />
              <RenderRow
                title="Average Speed"
                value={Number(allTripData[selectedSwitch].speed)!.toFixed(3)} //xxx
                unit="knots"
                editable={false}
              />
              <RenderRow
                editable={false}
                title="Efficiency"
                unit={
                  volumeUnit(units?.volume!) +
                  '/' +
                  distanceUnit(units?.distance!)
                }
                value={Number(
                  convertConsumption(
                    parseFloat(calculateEfficiency(selectedSwitch)), // Use parseFloat for safety
                    units?.volume!,
                    units?.distance!,
                  ),
                )}
                makeitstring={true}
              />
            </MyCard>
            <GapView length={30} />
            <View style={{flexDirection: 'row', gap: 20}}>
              <MyButton
                label={tripStarted[selectedSwitch] ? 'End Trip' : 'Start Trip'}
                width={80}
                onPress={async () => {
                  if (!tripStarted[selectedSwitch]) {
                    if (allTripData[selectedSwitch].name) {
                      await BackgroundService.start(
                        () => startTrip(selectedSwitch),
                        options,
                      );
                      setNameError(false);
                    } else {
                      setNameError(true);
                    }
                  } else {
                    endTrip(selectedSwitch);
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
            <GapView length={80} />
          </View>
        )}
        <MyFooter />
      </ScrollView>
    </MyCanvas>
  );
}
