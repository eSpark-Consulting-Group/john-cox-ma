import React, {useEffect} from 'react';
import {
  BackHandler,
  ScrollView,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';

import {
  MyButton,
  MyFooter,
  MyHeader,
  MyText,
  MyBox,
  GapView,
  MyGauge,
  MyCanvas,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import NauticalMile from './NauticalMilte';
import {
  distanceUnit,
  distanceValue,
  volumeUnit,
  volumeValue,
} from '../FMMSetup/utils';
import {styles} from './styles';
import {useMainLogic} from './utils/useMainLogic';

export type MainScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'Main'
>;

export default function Main() {
  const theme = useTheme() as MyTheme;
  const {
    enginesData1,
    enginesData2,
    sumOfBurn,
    remainingFuel,
    distanceToEmpty,
    generatorRunning,
    toggleGeneratorRunning,
    confirmation,
    setConfirmation,
    fetchSocketData,
    units,
    engineUnits,
    speed,
    isService1Resolved,
    isService2Resolved,
    YesResponse,
    NoResponse,
    buttonsData,
  } = useMainLogic();
  const navigation = useNavigation<MainScreenProps['navigation']>();

  useEffect(() => {
    const onBackPress = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <MyCanvas>
      <ScrollView
        contentContainerStyle={[
          styles().screen,
          {
            flex: confirmation ? 1 : 0,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <MyHeader />
        {confirmation ? (
          <>
            <MyText
              text="Are you sure you want to Re-provision?"
              size={26}
              style={styles().caption}
            />
            <MyText
              text="This will let you go through the process again"
              textColor={theme.colors.secondary}
              style={styles().subCaption}
            />
            <GapView length={55} />
            <View style={styles(theme).warn}>
              <MyButton
                label="NO"
                labelStyle={{fontSize: 20}}
                onPress={NoResponse}
              />
              <MyButton
                label="YES"
                labelStyle={{fontSize: 20}}
                textColor={'red'}
                onPress={YesResponse}
              />
            </View>
            <GapView length={90} />
          </>
        ) : (
          <View style={styles().main}>
            <GapView length={90} />
            <TouchableOpacity style={styles().reload} onPress={fetchSocketData}>
              <Ionicons name="reload" size={35} color={theme.colors.primary} />
            </TouchableOpacity>
            {isService1Resolved && (
              <View style={styles().GaugeRow}>
                {enginesData1.length
                  ? enginesData1.map((item, index) => (
                      <MyGauge
                        key={item.name + item.position}
                        value={
                          item?.FuelManagement.current_fuel_consumption &&
                          item.enabled
                            ? volumeValue(
                                Number(
                                  item?.FuelManagement.current_fuel_consumption,
                                ),
                                volumeUnit(engineUnits?.timesp1?.volume!),
                              )
                            : NaN
                        }
                        name={item.position}
                        volUnit={volumeUnit(engineUnits?.timesp1?.volume!)}
                      />
                    ))
                  : [1, 2].map((item, index) => (
                      <MyGauge
                        key={item}
                        value={NaN}
                        name="Reload"
                        volUnit={volumeUnit(engineUnits?.timesp1?.volume!)}
                      />
                    ))}
              </View>
            )}
            <GapView length={20} />
            {isService2Resolved && (
              <View style={styles().GaugeRow}>
                {enginesData2.length
                  ? enginesData2.map((item, index) => (
                      <MyGauge
                        key={item.name + item.position}
                        value={
                          item?.FuelManagement.current_fuel_consumption &&
                          item.enabled
                            ? volumeValue(
                                Number(
                                  item?.FuelManagement.current_fuel_consumption,
                                ),
                                volumeUnit(engineUnits?.timesp2?.volume!),
                              )
                            : NaN
                        }
                        name={item.position}
                        volUnit={volumeUnit(engineUnits?.timesp2?.volume!)}
                      />
                    ))
                  : [1, 2].map((item, index) => (
                      <MyGauge
                        key={item}
                        value={NaN}
                        name="Reload"
                        volUnit={volumeUnit(engineUnits?.timesp2?.volume!)}
                      />
                    ))}
              </View>
            )}
            <GapView length={20} />
            <View style={styles().container}>
              <View style={styles().range}>
                <MyBox
                  label="Efficiency"
                  text="Speed"
                  value={
                    !isService1Resolved && !isService2Resolved
                      ? NaN
                      : Number(speed).toFixed(2)
                  }
                  unit="Knots"
                  width={'50%'}
                  gap={22}
                />
                <View style={styles().fuelBurn}>
                  <MyBox
                    text="Total Fuel Burn"
                    value={
                      !isService1Resolved && !isService2Resolved
                        ? NaN
                        : volumeValue(sumOfBurn, 'gal')
                    }
                    unit={volumeUnit('Gallons') + '/hr'}
                    width={'100%'}
                    gap={22}
                  />
                </View>
              </View>
              <NauticalMile
                volUnit={'Gallons'}
                distUnit={units?.distance ? units?.distance : 'Kilometers'}
              />
              <View style={styles().range}>
                <View style={{width: '50%'}}>
                  <MyBox
                    label="Range"
                    text="Fuel Remaining"
                    value={
                      !isService1Resolved && !isService2Resolved
                        ? NaN
                        : volumeValue(remainingFuel, 'gal')
                    }
                    unit={volumeUnit('Gallons')}
                  />
                </View>
                <View style={{width: '40%'}}>
                  <View style={styles().box}>
                    <MyText
                      text="Generator Running"
                      textColor={theme.colors.secondary}
                      size={18}
                    />
                    <MyButton
                      gradient
                      label={generatorRunning}
                      onPress={toggleGeneratorRunning}
                      labelStyle={{fontSize: 20}}
                    />
                  </View>
                </View>
              </View>
              <MyBox
                text="Distance to Empty"
                value={
                  !isService1Resolved && !isService2Resolved
                    ? NaN
                    : distanceValue(
                        distanceToEmpty,
                        distanceUnit(units?.distance!),
                      )
                }
                unit={distanceUnit(units?.distance!)}
                width={'70%'}
              />
            </View>
            <GapView length={40} />
            <View style={styles().buttons}>
              {buttonsData.map((item, index) => (
                <MyButton
                  key={index.toString()}
                  gradient
                  style={{width: '22%'}}
                  label={item.label}
                  labelStyle={item.labelStyle as TextStyle}
                  onPress={item.onPress}
                />
              ))}
            </View>
            <GapView length={40} />
            <MyButton
              label="Re-Provision"
              labelStyle={{fontSize: 18}}
              onPress={() => {
                if (isService1Resolved && isService2Resolved) {
                  return;
                }
                setConfirmation(true);
              }}
            />
            <GapView length={90} />
          </View>
        )}

        <MyFooter />
      </ScrollView>
    </MyCanvas>
  );
}
