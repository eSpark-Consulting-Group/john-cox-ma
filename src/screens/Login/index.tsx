import React, {useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GapView,
  LabelDropdown,
  LabelInput,
  Loader,
  MyButton,
  MyCanvas,
  MyCard,
  MyFooter,
  MyHeader,
  MyText,
} from '../../components';
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {useSocket} from '../../components/SocketProvider';

type LoginScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Login() {
  const theme = useTheme() as MyTheme;
  const {resolvedService1, resolvedService2} = useSocket();
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<'timesp1' | 'timesp2'>(
    'timesp1',
  );
  const [creds, setCreds] = useState({
    username: 'ESP_24dcc3',
    password: '9c10b4',
  });

  const loginHandler = async () => {
    try {
      setError('');
      setIsLoading(true);
      const domain =
        selectedDevice === 'timesp1'
          ? `${resolvedService1?.addresses[0]}:${resolvedService1?.port}`
          : `${resolvedService2?.addresses[0]}:${resolvedService2?.port}`;

      console.log(`http://${domain}/userLogin`);

      const response = await axios.post(`http://${domain}/userLogin`, creds);
      const data = response.data as {token: string};
      await AsyncStorage.setItem('token', data.token);
      navigation.navigate('Setup', {
        loggedinDomain: domain,
        deviceName: selectedDevice,
      });
      console.log(response.data);
    } catch (error: any) {
      setError(error.message || 'Internal Server Error!');
      console.log(`Error while login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MyCanvas>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MyHeader />
          <GapView length={150} />
          <MyText
            text="Login"
            size={20}
            fontFamily="NotoSans-Bold"
            style={{
              alignSelf: 'flex-start',
              paddingLeft: 18,
              paddingBottom: 20,
            }}
          />
          <MyCard>
            <GapView length={10} />
            <LabelInput
              inputValue={creds.username}
              onChange={value => setCreds(prev => ({...prev, username: value}))}
              text="Username:"
              width={130}
              height={30}
              size={18}
            />
            <GapView length={20} />
            <LabelInput
              inputValue={creds.password}
              onChange={value => setCreds(prev => ({...prev, password: value}))}
              text="Password:"
              width={130}
              height={30}
              size={18}
              password
            />
            <GapView length={30} />
            <View>
              <LabelDropdown
                text={'Select Device'}
                value={selectedDevice}
                data={['timesp1', 'timesp2']}
                onSelect={e => {
                  setSelectedDevice(e as 'timesp1' | 'timesp2');
                }}
              />
            </View>
            {isLoading ? (
              <Loader size="small" />
            ) : (
              <MyButton
                label="Sign In"
                style={styles().signin}
                onPress={loginHandler}
              />
            )}
            <GapView length={30} />
            <MyText text={error} />
          </MyCard>
          <GapView length={120} />
          <MyButton
            label="Back"
            style={styles().button}
            gradient
            onPress={() => navigation.navigate('Main')}
          />
          <GapView length={160} />
          <MyFooter />
        </KeyboardAvoidingView>
      </ScrollView>
    </MyCanvas>
  );
}

const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    linearGradient: {
      ...StyleSheet.absoluteFillObject,
      height: 155,
    },
    lowerGradient: {
      ...StyleSheet.absoluteFillObject,
      marginBottom: -20,
    },
    signin: {alignSelf: 'center'},
    button: {width: 130, alignSelf: 'center'},
  });
