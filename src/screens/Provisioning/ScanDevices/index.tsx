import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {
  ESPProvisionManager,
  ESPDevice,
  ESPTransport,
  ESPSecurity,
} from '@espark-consultants/react-native-esp-idf-provisioning';

import {
  GapView,
  Loader,
  MyButton,
  MyCanvas,
  MyCard,
  MyCheckbox,
  MyFooter,
  MyHeader,
  MyText,
} from '../../../components';
import {RootStackParamsList} from '../../../types/navigationParams';
import {MyTheme} from '../../../types';
import {checkPermissions} from '../utils';
import {useService} from '../../../components/ServiceProvider';

type ScanDevicesScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'ScanDevices'
>;

export default function ScanDevices() {
  const navigation = useNavigation<ScanDevicesScreenProps['navigation']>();
  const theme = useTheme() as MyTheme;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>();
  const [device, setDevice] = useState<ESPDevice>();
  const [devices, setDevices] = useState<ESPDevice[]>();
  const [granted, setGranted] = useState(false);
  const [log, setLog] = useState('Helllow');
  const {setServiceFound} = useService();

  const handleSetService = (
    serviceName: 'timesp1' | 'timesp2',
    value: boolean,
  ) => {
    setServiceFound(serviceName, value);
  };

  const requestPermissionsAndScan = async () => {
    try {
      const grantedPermissions = await checkPermissions();
      setGranted(grantedPermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      requestPermissionsAndScan();
      if (granted) {
        scanDevices();
        console.log('scanning devices again');
        // handleSetService('timesp1', false);
        // handleSetService('timesp2', false);
      }
    }, [granted]),
  );

  const scanDevices = async () => {
    try {
      setDevice(undefined);
      setError(false);
      setLoading(true); // Start loading

      if (granted) {
        const myDevices = await ESPProvisionManager.searchESPDevices(
          'TIMESP',
          ESPTransport.softap,
          ESPSecurity.unsecure,
        );
        console.log('🚀 ~ scanDevices ~ myDevices:', myDevices);

        if (myDevices.length === 0) {
          setError(true); // No devices found, show error
          setDevice(undefined); // Clear the selected device
        } else {
          setDevices(myDevices);
          setError(false); // Clear any previous errors
          console.log('Available Devices:', myDevices);
        }
      } else {
        console.log('some issue');
      }
    } catch (error) {
      // console.error('Error scanning devices:', error);
      setError(true);
      setDevices([]); // Clear devices on error
      setDevice(undefined); // Clear selected device
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const connectDevice = async (device?: any) => {
    try {
      console.log('Starting connection process...');
      console.log('Device:', device);
      console.log('Product key:', 'abcd1234');
      setLog('Connecting..!');

      const dev = new ESPDevice({
        name: 'TIMESP_AFDB9C',
        transport: ESPTransport.softap,
        security: 1,
      });
      console.log('ESPDevice:', dev);

      const connectedDev: any = await dev.connect('abcd1234');
      setLog('Connected device:');
      console.log('Connected device:' + connectedDev);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const renderDevice = ({item}: {item: ESPDevice}) => (
    <Pressable
      style={({pressed}) => [
        {
          borderWidth: pressed ? 1 : 0,
          borderColor: theme.colors.primary,
        },
        styles.item,
      ]}
      onPress={() => {
        setDevice(item);
      }}>
      <MyText size={25} text={item.name} />
      {device === item ? (
        <MyCheckbox width={30} disabled value={true} />
      ) : (
        <View style={styles.cb} />
      )}
    </Pressable>
  );

  return (
    <MyCanvas>
      <View style={styles.main}>
        <MyHeader />
        <View style={styles.wrapper}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <MyText
              text="Device Prefix:  "
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <MyText text={'TIMESP' + '_'} size={30} />
          </View>
          <View style={styles.reloadRow}>
            <MyText
              text="Select Device"
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <TouchableOpacity
              style={{paddingRight: '5%'}}
              onPress={scanDevices}>
              <Ionicons name="reload" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <MyCard>
            {loading && (
              <Loader
                size="large"
                style={{
                  top: 115,
                  position: 'absolute',
                }}
              />
            )}
            {error && (
              <MyText
                text={'Device not Found'}
                style={{top: 115, position: 'absolute'}}
                size={20}
              />
            )}
            <FlatList
              data={devices} //devices
              renderItem={renderDevice}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatlist}
              showsVerticalScrollIndicator={false}
            />
          </MyCard>
          <GapView length={40} />
          <MyButton
            label="Connect"
            style={{paddingHorizontal: 45}}
            labelStyle={{fontSize: 18}}
            onPress={() => {
              // if (device) {
              //   navigation.navigate('Proof', {device});
              // }
              connectDevice();
            }}
            textColor={theme.colors.proSecondary}
          />
          <MyButton
            label="Scan WiFi"
            style={{paddingHorizontal: 45}}
            labelStyle={{fontSize: 18}}
            onPress={() => {
              // if (device) {
              //   navigation.navigate('Proof', {device});
              // }
              connectDevice();
            }}
            textColor={theme.colors.proSecondary}
          />
          {/* <MyButton
            label="Skip Setup"
            style={{
              paddingHorizontal: 45,
              marginTop: 10,
            }}
            labelStyle={{fontSize: 18}}
            onPress={() => {
              navigation.navigate('Main');
            }}
            textColor={theme.colors.proSecondary}
          /> */}
          <View style={{backgroundColor: 'black', height: 100, width: 100}}>
            <MyText textColor="white" text={log} />
          </View>
        </View>
        <MyFooter />
      </View>
    </MyCanvas>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  wrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: '15%',
  },
  title: {alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20},
  reloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  item: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    flexDirection: 'row',
    gap: 15,
  },
  cb: {width: 30, height: 30},
  flatlist: {height: 240, width: '100%'},
});
