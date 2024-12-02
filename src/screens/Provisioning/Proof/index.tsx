import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';
import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import WifiManager from 'react-native-wifi-reborn';

import {
  GapView,
  MyButton,
  MyCanvas,
  MyFooter,
  MyHeader,
  MyInput,
  MyText,
} from '../../../components';
import {RootStackParamsList} from '../../../types/navigationParams';
import {sendingData} from '../utils';
import {useState} from 'react';
import {MyTheme} from '../../../types';

type ProofScreenProps = NativeStackScreenProps<RootStackParamsList, 'Proof'>;

export default function Proof({route}: ProofScreenProps) {
  const navigation = useNavigation<ProofScreenProps['navigation']>();

  const {device} = route.params;
  const [error, setError] = useState<boolean>();
  const [pop, setPop] = useState('');
  const theme = useTheme() as MyTheme;

  const connectDevice = async (device: any, pop: string) => {
    try {
      console.log('Starting connection process...');
      console.log('Device:', device);
      console.log('Product key:', pop);

      WifiManager.connectToProtectedSSID(device.name, '', false, false).then(
        async a => {
          console.log('Connected successfully!');
          const dev = new ESPDevice({
            ...device,
            security: 1,
          });
          console.log('ESPDevice:', dev);

          const connectedDev: any = await dev.connect(pop);
          console.log('Connected device:', connectedDev);

          if (connectedDev?.status === 'connected') {
            console.log('Device connected successfully:', connectedDev);

            try {
              const res = await sendingData(device);

              // Check for success or error in 'res'
              if (res && !res.toString().toLowerCase().includes('error')) {
                console.log('Data sent successfully:', res);
                navigation.navigate('ScanNetworks', {device});
              } else {
                console.log('Error in sending data:', res);
                setError(true);
                navigateWithDelay();
              }
            } catch (dataError) {
              console.log('Error during sending data:', dataError);
              setError(true);
              navigateWithDelay();
            }
          } else {
            console.log('Unable to connect');
            setError(true);
            navigateWithDelay();
          }
        },
        e => {
          console.log('Connection failed!', e);
          setError(true);
          navigateWithDelay();
        },
      );
    } catch (error) {
      console.log('Error:', error);
      setError(true);
      navigateWithDelay();
    }
  };

  const navigateWithDelay = () => {
    setTimeout(() => {
      navigation.navigate('ScanDevices');
    }, 3000); // Delay of 3 seconds
  };

  return (
    <MyCanvas>
      <KeyboardAvoidingView style={styles.main} behavior="padding">
        <MyHeader />
        <View style={styles.wrapper}>
          <MyText
            text="Enter Possession Proof"
            size={24}
            fontFamily="NotoSans-Bold"
            style={styles.title}
          />
          <GapView length={40} />
          <View style={styles.inputContainer}>
            <MyInput
              height={45}
              size={16}
              onChange={text => setPop(text)}
              password
            />
            <MyText
              text={'Enter Pin for ' + device.name}
              size={26}
              style={styles.caption}
            />
          </View>
          <GapView length={100} />
          <MyButton
            label="Next"
            style={{paddingHorizontal: 45}}
            labelStyle={{fontSize: 18}}
            onPress={() => connectDevice(device, pop)}
            textColor={theme.colors.proSecondary}
          />
          <GapView length={20} />
          <MyButton
            label="Back"
            labelStyle={{fontSize: 18}}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            gradient
            style={{width: 150}}
          />
          <GapView length={10} />
          <MyText>{error && 'Error connecting to device'}</MyText>
          <MyText>{error && 'Navigating Back to Scan devices'}</MyText>
          <GapView length={50} />
        </View>
        <MyFooter />
      </KeyboardAvoidingView>
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
    width: '100%',
    paddingBottom: '15%',
  },
  title: {alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20},
  reloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainer: {width: '85%', paddingTop: 10},
  caption: {
    alignSelf: 'center',
    paddingTop: 30,
    lineHeight: 30,
    width: '60%',
    textAlign: 'center',
  },
  flatlist: {height: 240, width: '100%'},
});
