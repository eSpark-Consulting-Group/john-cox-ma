import React, {useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ESPWifiList} from '@espark-consultants/react-native-esp-idf-provisioning';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
} from '../../../components';
import {RootStackParamsList} from '../../../types/navigationParams';
import {Wifi, Connected} from '../../../assets';
import {MyTheme} from '../../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSocket} from '../../../components/SocketProvider';

type ScanNetworksScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'ScanNetworks'
>;

export default function ScanNetworks({route}: ScanNetworksScreenProps) {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<ScanNetworksScreenProps['navigation']>();
  const {device} = route.params;
  const {setProvision} = useSocket();

  const [error, setError] = useState<boolean>();
  const [authError, setAuthError] = useState<boolean>();
  const [networks, setNetworks] = useState<ESPWifiList[]>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [network, setNetwork] = useState<ESPWifiList>();
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);
  const [animationInterval, setAnimationInterval] = useState<NodeJS.Timeout>();

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
          navigation.navigate('Confirmation');
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

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
    scanWifiList;
  }, []);

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
        setStep(2);
        setNetwork(item);
        console.log('Selected Network: ', item.ssid);
      }}
      disabled={isLoading}>
      <Wifi />
      <MyText size={25}>{item.ssid}</MyText>
      {network?.ssid == item.ssid && isLoading && (
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
          await AsyncStorage.setItem(
            'provisionedDevices',
            JSON.stringify({timesp1: true, timesp2: false}),
          );
          setProvision({timesp1: true, timesp2: false});
          console.log('Provisioning Test: Pass');
          setIsVisible(true);
        } catch (provisionError) {
          console.error('Error during device provisioning:', provisionError);
          setAuthError(true);
        }
      } else {
        console.error('Network SSID is undefined');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during network provisioning:', error);
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
      case 1:
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
      case 2:
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
                  setStep(1);
                }}
              />
              <GapView length={40} />
            </MyCard>
            <GapView length={150} />
          </>
        );
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
        {renderStep()}
        <MyFooter />
      </KeyboardAvoidingView>
    </MyCanvas>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
  },
  wrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: '15%',
    width: '100%',
  },
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
