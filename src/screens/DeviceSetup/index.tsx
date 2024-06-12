import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';
import {
  ESPProvisionManager,
  ESPDevice,
  ESPTransport,
  ESPSecurity,
  ESPWifiList,
} from '@espark-consultants/react-native-esp-idf-provisioning';
import WifiManager from 'react-native-wifi-reborn';
import {Ionicons} from '@expo/vector-icons';

import {
  GapView,
  Loader,
  MyButton,
  MyCanvas,
  MyCard,
  MyCheckbox,
  MyFooter,
  MyHeader,
  MyInput,
  MyText,
} from '../../components';
import {MyTheme} from '../../types';
import {Connected, Wifi} from '../../assets';
import {RootStackParamsList} from '../../types/navigationParams';
import {checkPermissions, sendingData} from './utils';

type DeviceSetupScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'DeviceSetup'
>;

export default function DeviceSetup() {
  const navigation = useNavigation<DeviceSetupScreenProps['navigation']>();
  const theme = useTheme() as MyTheme;
  const [step, setStep] = useState(0);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<ESPDevice>();
  const [device, setDevice] = useState<ESPDevice>();
  const [network, setNetwork] = useState<ESPWifiList>();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animationInterval, setAnimationInterval] = useState<NodeJS.Timeout>();
  const [count, setCount] = useState(0);
  const [error, setError] = useState<boolean>();
  const [authError, setAuthError] = useState<boolean>();
  const [logs, setLogs] = useState('');

  const prefixes = ['TIMESP', 'ABCSP1', 'XYZSP1', 'MNOSP1'];

  const [devices, setDevices] = useState<ESPDevice[]>();
  const [pop, setPop] = useState('');
  const [password, setPassword] = useState('');
  const [networks, setNetworks] = useState<ESPWifiList[]>();
  const [granted, setGranted] = useState(false);

  // - Scan using prefix
  // - Allow user to select a device
  // - Take pop from user
  // - Scan wifi list from device
  // - Allow user to select a wifi and take password.. Then provision
  // - Data= json.stringifiy(Device.senddata)
  // - Connected screen

  useEffect(() => {
    (async () => {
      try {
        const grantedPermissions = await checkPermissions();
        setGranted(grantedPermissions);
        console.log('Permission granted: ', grantedPermissions ? 'yes' : 'no');

        setCount(0);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    })();
  }, [count]);

  useEffect(() => {
    console.log('step: ', step);
    setError(false);
  }, [step]);

  useEffect(() => console.log('count: ', count), [count]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnimationIndex(prevIndex => (prevIndex + 1) % 4); // Change 4 to the number of animations you want to cycle through
      }, 500); // Adjust the interval duration as needed
      setAnimationInterval(interval);
    } else {
      clearInterval(animationInterval);
    }
    return () => clearInterval(animationInterval);
  }, [isLoading]);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setCount(count + 1);
        if (count % 2 != 0) {
          navigation.navigate('Main');
          setIsVisible(false);
          setStep(1);
        } else {
          setIsVisible(false);
          setStep(5);
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const renderPrefix = ({item}: {item: string}) => (
    <Pressable
      style={({pressed}) => [
        {
          borderWidth: pressed ? 1 : 0,
          borderColor: theme.colors.primary,
        },
        styles.item,
      ]}
      onPress={() => setSelectedPrefix(item)}>
      <MyText size={25}>{item}</MyText>
      {selectedPrefix === item ? (
        <MyCheckbox width={30} disabled value={true} />
      ) : (
        <View style={styles.cb} />
      )}
    </Pressable>
  );

  const scanDevices = async () => {
    try {
      setLoading(true); // Start loading
      if (granted) {
        const myDevices = await ESPProvisionManager.searchESPDevices(
          selectedPrefix,
          ESPTransport.softap,
          ESPSecurity.unsecure,
        );
        setDevices(myDevices);
        console.log('Available Devices:', myDevices);
      } else {
        console.log('Some permissions are not granted.');
      }
    } catch (error) {
      console.error('Error scanning devices:', error);
      setError(true);
    } finally {
      setLoading(false); // Stop loading
      setError(false);
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
        setSelectedDevice(item);
      }}>
      <MyText size={25} text={item.name} />
      {selectedDevice === item ? (
        <MyCheckbox width={30} disabled value={true} />
      ) : (
        <View style={styles.cb} />
      )}
    </Pressable>
  );

  const connectDevice = async (device: any) => {
    try {
      setLogs('Starting connection process...');
      console.log('Device:', device);
      console.log('Product key:', 'abcd1234');

      WifiManager.connectToProtectedSSID(device.name, '', false, false).then(
        async a => {
          setLogs('Connected successfully!');
          const dev = new ESPDevice({
            ...device,
            security: 1,
          });
          console.log('ESPDevice:', dev);
          setLogs('ESPDevice ' + dev);

          const connectedDev: any = await dev.connect('abcd1234');
          setLogs('Connected device:' + connectedDev);

          if (connectedDev?.status == 'connected') {
            setLogs('Device connected successfully:' + connectedDev);
            const res = await sendingData(device);
            setLogs(res!);
            scanWifiList();
            console.log('Scanned Wi-Fi list.');
            setStep(3);
            console.log('Set step to 3.');
          } else {
            console.log('Unable to connect');
            setError(true);
            setLogs('Unable to connect');
          }
        },
        e => {
          console.log('Connection failed!', e);
          setLogs(e);
        },
      );
    } catch (error) {
      console.log('Error:', error);
      setLogs('Some Error');
    }
  };

  const scanWifiList = async () => {
    setLoading(true);
    try {
      const wifiList = await device?.scanWifiList();
      console.log('wifi List: ', wifiList);
      setNetworks(wifiList);
    } catch (error) {
      console.error('Error scanning WiFi list:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNetwork = ({item}: {item: ESPWifiList}) => (
    <Pressable
      style={({pressed}) => [
        styles.item,
        {
          borderWidth: pressed ? 1 : 0,
          borderColor: theme.colors.primary,
          paddingLeft: 10,
          justifyContent: 'flex-start',
        },
      ]}
      onPress={() => {
        setStep(4);
        setNetwork(item);
        console.log('Selected Network: ', item.ssid);
      }}
      disabled={isLoading}>
      <Wifi />
      <MyText size={25}>{item.ssid}</MyText>
      {network?.ssid === item.ssid && isLoading && (
        <View style={styles.network}>{renderConnectedTags()}</View>
      )}
    </Pressable>
  );

  const connectNetwork = async () => {
    setIsLoading(true);
    try {
      if (network?.ssid) {
        const ssid = network.ssid;
        const passphrase = password;

        try {
          await device?.provision(ssid, passphrase);
          console.log('Provisioning Test: Pass');
          setIsVisible(true);
        } catch (provisionError) {
          console.error('Error during device provisioning:', provisionError);
          setAuthError(true);
        }
      } else {
        console.error('Network SSID is undefined');
      }
    } catch (error) {
      console.error('Error during network provisioning:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderConnectedTags = () => {
    const connectedTags = [];
    for (let i = 0; i < animationIndex; i++) {
      connectedTags.push(<Connected key={i} />);
    }
    return connectedTags;
  };

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <GapView length={15} />
            <MyText
              text="Select Device Prefix"
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <MyCard>
              <FlatList
                data={prefixes}
                renderItem={renderPrefix}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatlist}
                showsVerticalScrollIndicator={false}
              />
            </MyCard>
            <GapView length={40} />
            <MyButton
              label="Select"
              style={{paddingHorizontal: 45}}
              labelStyle={{fontSize: 18}}
              onPress={() => {
                setPrefix(selectedPrefix);
                scanDevices();
                setStep(1);
              }}
              textColor={theme.colors.proSecondary}
            />
            <MyButton
              label="Skip Setup"
              style={{paddingHorizontal: 45, marginTop: 20}}
              labelStyle={{fontSize: 18}}
              onPress={() => {
                navigation.navigate('Main');
                setStep(1);
              }}
              textColor={theme.colors.proSecondary}
            />
            <GapView length={40} />
          </>
        );
      case 1:
        return (
          <>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <MyText
                text="Device Prefix:  "
                size={24}
                fontFamily="NotoSans-Bold"
                style={styles.title}
              />
              <MyText text={prefix + '_'} size={30} />
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
                <Ionicons
                  name="reload"
                  size={24}
                  color={theme.colors.primary}
                />
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
              label="Select"
              style={{paddingHorizontal: 45}}
              labelStyle={{fontSize: 18}}
              onPress={() => {
                if (!error) {
                  setDevice(selectedDevice);
                  setStep(2);
                }
              }}
              textColor={theme.colors.proSecondary}
            />

            <GapView length={50} />
          </>
        );
      case 2:
        return (
          <>
            <MyText
              text="Enter Possession Proof"
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <GapView length={40} />
            <View style={styles.inputContainer}>
              <MyInput height={45} size={16} onChange={text => setPop(text)} />
              <MyText
                text={'Enter Pin for ' + prefix}
                size={26}
                style={styles.caption}
              />
            </View>
            <GapView length={100} />
            <MyButton
              label="Next"
              style={{paddingHorizontal: 45}}
              labelStyle={{fontSize: 18}}
              onPress={() => connectDevice(device)}
              textColor={theme.colors.proSecondary}
            />
            <MyText size={15}>{logs}</MyText>
            <GapView length={5} />
            <MyButton
              label="Back"
              labelStyle={{fontSize: 18}}
              onPress={() => setStep(1)}
              gradient
              style={{width: 150}}
            />
            <GapView length={60} />
          </>
        );
      case 3:
        return (
          <>
            <View style={styles.reloadRow}>
              <MyText
                text="Available Networks"
                size={24}
                fontFamily="NotoSans-Bold"
                style={styles.title}
              />
              <TouchableOpacity
                style={{paddingRight: '5%'}}
                onPress={scanWifiList}>
                <Ionicons
                  name="reload"
                  size={24}
                  color={theme.colors.primary}
                />
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
                  text={'Error Scanning Networks'}
                  style={{top: 115, position: 'absolute'}}
                  size={20}
                />
              )}
              <FlatList
                data={networks}
                renderItem={renderNetwork}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatlist}
                showsVerticalScrollIndicator={false}
              />
            </MyCard>
            {
              <View style={{height: 20, width: '100%'}}>
                {authError && (
                  <MyText
                    text={'Authentication Failed'}
                    style={{top: 115, position: 'absolute'}}
                    size={20}
                  />
                )}
              </View>
            }
            <GapView length={20} />
            <MyButton
              label="Back"
              labelStyle={{fontSize: 18}}
              onPress={() => setStep(2)}
              gradient
              style={{width: 150}}
            />
            <GapView length={93} />
          </>
        );
      case 4:
        return (
          <>
            <MyText
              text="Enter Password"
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <MyCard>
              <View style={styles.wifiRow}>
                <Wifi />
                <MyText size={24}>{network?.ssid}</MyText>
              </View>
              <View style={{width: '95%', paddingTop: 15}}>
                <MyInput height={45} onChange={text => setPassword(text)} />
              </View>
              <GapView length={60} />
              <MyButton
                label="Connect"
                width={120}
                labelStyle={{fontSize: 20}}
                onPress={() => {
                  connectNetwork();
                  setStep(3);
                }}
              />
              <GapView length={20} />
            </MyCard>
            <GapView length={150} />
          </>
        );
      case 5:
        return (
          <>
            <GapView length={60} />
            <MyText
              text="Do you want another network?"
              size={26}
              style={styles.caption}
            />
            <GapView length={85} />
            <View
              style={{
                width: '50%',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <MyButton
                label="NO"
                labelStyle={{fontSize: 20}}
                onPress={() => {
                  // navigation.navigate('Main');
                  navigation.navigate('Test');
                  setStep(1);
                }}
              />
              <MyButton
                label="YES"
                labelStyle={{fontSize: 20}}
                textColor={'red'}
                onPress={() => {
                  setStep(1);
                }}
              />
            </View>
            <GapView length={220} />
          </>
        );

      default:
        return null;
    }
  }

  return (
    <MyCanvas>
      <Modal visible={isVisible} animationType="slide" transparent>
        <MyCanvas>
          <View style={[styles.modalContent]}>
            <MyText text="Connected" size={34} fontFamily="NotoSans-Bold" />
            <GapView length={100} />
            <MyCard>
              <View style={styles.wifiRow}>
                <Wifi />
                <MyText size={19} style={{width: '70%'}}>
                  {network?.ssid}
                </MyText>
                <MyCheckbox value={true} width={32} disabled />
              </View>
            </MyCard>
            <GapView length={100} />
          </View>
        </MyCanvas>
      </Modal>

      <KeyboardAvoidingView style={styles.main} behavior="padding">
        <MyHeader />
        <GapView length={120} />
        {renderStep()}
        <GapView length={120} />
        <MyFooter />
      </KeyboardAvoidingView>
    </MyCanvas>
  );
}

const styles = StyleSheet.create({
  main: {justifyContent: 'space-between', alignItems: 'center'},
  title: {alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20},
  reloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  network: {flexDirection: 'row', gap: 3, alignItems: 'center'},
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
  inputContainer: {width: '85%', paddingTop: 10},
  caption: {
    alignSelf: 'center',
    paddingTop: 30,
    lineHeight: 30,
    width: '60%',
    textAlign: 'center',
  },
  wifiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    gap: 20,
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
