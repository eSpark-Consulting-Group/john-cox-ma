import React, {useState} from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
import {MyTheme} from '../../types';
import {RootStackParamsList} from '../../types/navigationParams';
import {api} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type LoginScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Login() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [creds, setCreds] = useState({
    username: 'ESP_409151',
    password: 'fc3258',
  });

  const loginHandler = async () => {
    try {
      setError('');
      setIsLoading(true);

      const domains = ['timesp1.local', 'timesp2.local'];
      let success = false;

      for (const domain of domains) {
        try {
          const response = await axios.post(
            `https://${domain}/userLogin`,
            creds,
          );

          if (response.status === 200) {
            const data = response.data as {token: string};
            await AsyncStorage.setItem('token', data.token);
            navigation.navigate('Setup');
            success = true;
            break; // Exit the loop if login is successful
          }
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            console.log(`Axios error with ${domain}: ${error.message}`);
            console.log(`Error config: ${JSON.stringify(error.config)}`);
            if (error.response) {
              console.log(
                `Error response data: ${JSON.stringify(error.response.data)}`,
              );
              console.log(`Error response status: ${error.response.status}`);
              console.log(
                `Error response headers: ${JSON.stringify(
                  error.response.headers,
                )}`,
              );
            } else if (error.request) {
              console.log(`Error request: ${JSON.stringify(error.request)}`);
            }
          } else {
            console.log(`Non-Axios error with ${domain}: ${error.message}`);
          }
        }
      }

      if (!success) {
        throw new Error('Failed to log in to both devices.');
      }
    } catch (error: any) {
      setError(error.message || 'Internal Server Error!');
      console.log(`Error while login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MyCanvas>
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
          style={{alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20}}
        />
        <MyCard>
          <GapView length={10} />
          <LabelInput
            inputValue={creds.username}
            onChange={value => setCreds(prev => ({...prev, username: value}))}
            text="Username:"
            width={114}
            height={21}
            size={18}
          />
          <GapView length={20} />
          <LabelInput
            inputValue={creds.password}
            onChange={value => setCreds(prev => ({...prev, password: value}))}
            text="Password:"
            width={114}
            height={21}
            size={18}
          />
          <GapView length={30} />
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
