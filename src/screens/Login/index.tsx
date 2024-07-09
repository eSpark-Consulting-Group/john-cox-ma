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

type LoginScreenProps = NativeStackScreenProps<RootStackParamsList, 'Login'>;

export default function Login() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [creds, setCreds] = useState({
    username: 'ESP_409151',
    password: 'fc32a4',
  });
  const loginHandler = async () => {
    try {
      setError('');
      setIsLoading(true);
      const response = await api('https://timesp1.local').post(
        '/userLogin',
        creds,
      );
      if (response.status !== 200) {
        throw response.data;
      }
      const data = response.data as {token: string};
      if (data) {
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Setup');
      }
    } catch (error: any) {
      if (error?.message) {
        setError(error.message);
      } else {
        setError('Internal Server Error!');
      }
      console.log(`Error while login: ${JSON.stringify(error)}`);
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
