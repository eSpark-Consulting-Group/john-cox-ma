import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GapView,
  LabelInput,
  Loader,
  MyButton,
  MyCanvas,
  MyCard,
  MyFooter,
  MyHeader,
  MyText,
} from '../../components';
import {EngineData, Fonts, MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import LabelDropdown from '../../components/LabelDropdown';
import {api} from '../../api';
import {ApiResponse} from 'apisauce';

type FMMSetupScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;
type RouteType = {
  route: {
    params: {
      config: EngineData[];
      loggedinDomain: string;
      deviceName: 'timesp1' | 'timesp2';
    };
  };
};
export default function FMMSetup({route}: RouteType) {
  const {loggedinDomain, deviceName, config} = route.params;
  const prevConfig = config.map(item => {
    return {
      engine_id: item.FuelManagement.engine_id,
      enabled: item.enabled,
      position: item.position,
      volume_per_cycle: item.volume_per_cycle,
      name: item.name,
      engine_type: item.engine_type,
      fuel_type: item.fuel_type,
    };
  });
  const [allConfig, setAllConfig] = useState(prevConfig);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<FMMSetupScreenProps['navigation']>();
  const onValuesChange = (
    value: string,
    index: number,
    key: 'fuel_type' | 'engine_type' | 'volume_per_cycle',
  ) => {
    const conf = [...allConfig];
    conf[index] = {
      ...conf[index],
      [key]: value,
    };
    setAllConfig(conf);
  };
  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const doneHandler = async () => {
    console.log('Data being sent:', JSON.stringify(allConfig));
    const API = api(`http://${loggedinDomain}`);
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      API.setHeader('Authorization', `Bearer ${token}`);
      console.log('Token:', token);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000),
      );

      const apiPromise = API.post('/setConfigurations', {
        data: allConfig,
      });

      const response: ApiResponse<unknown, unknown> | any = await Promise.race([
        timeoutPromise,
        apiPromise,
      ]);

      if (response.status >= 200 && response.status < 300) {
        console.log('Success response:', response);
        logoutHandler();
      } else if (response.status === 401) {
        console.log('Unauthorized. Redirecting to login...');
        navigation.navigate('Login');
      } else {
        console.log('Failed response:', response.status, response.data);
      }
    } catch (error) {
      console.log('API call error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MyCanvas>
      <ScrollView
        contentContainerStyle={styles().screen}
        showsVerticalScrollIndicator={false}>
        <MyHeader />
        <GapView length={90} />
        <MyText
          text="Fuel Mgt Module Setup"
          size={18}
          fontFamily="NotoSans-Bold"
          style={{alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20}}
        />
        <MyCard>
          <MyText
            text="FMM #1"
            style={{alignSelf: 'flex-start'}}
            fontFamily="NotoSans-Bold"
          />
          {allConfig.map((item, index) => (
            <React.Fragment key={item.engine_id}>
              <MyText
                text={item.name}
                textColor={theme.colors.secondary}
                style={{alignSelf: 'flex-start'}}
                fontFamily="NotoSans-Bold"
              />
              <LabelInput
                text={'Volume per cycle'}
                width={150}
                height={30}
                placeholder="Enter here"
                inputValue={item.volume_per_cycle}
                onChange={val => onValuesChange(val, index, 'volume_per_cycle')}
              />
              <LabelDropdown
                text="Fuel Type"
                data={['Gasoline', 'Diesel', 'Biodiesel']}
                onSelect={val => onValuesChange(val, index, 'fuel_type')}
                value={item.fuel_type}
                zIndex={56}
              />
              <LabelDropdown
                text="Engine Type"
                data={['drive engine', 'generator']}
                onSelect={val => onValuesChange(val, index, 'engine_type')}
                value={item.engine_type}
                zIndex={54}
              />
            </React.Fragment>
          ))}
        </MyCard>

        <GapView length={15} />
        <GapView length={25} />
        <View style={{width: '30%'}}>
          {isLoading ? (
            <Loader size="small" />
          ) : (
            <MyButton
              label="Done"
              labelStyle={{fontSize: 20}}
              onPress={() => doneHandler()}
              // onPress={() => {}}
            />
          )}

          <GapView length={25} />
          <MyButton
            label="Back"
            gradient
            labelStyle={{fontSize: 20}}
            onPress={() => {
              navigation.navigate('Setup', {loggedinDomain, deviceName});
              console.log('Wapis jayein');
            }}
          />
        </View>
        <GapView length={70} />
        <MyFooter />
      </ScrollView>
    </MyCanvas>
  );
}

const styles = () =>
  StyleSheet.create({
    screen: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
