import {
  ActivityIndicator,
  Button,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  View,
  AppState,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {fetch} from 'react-native-ssl-pinning';
import RNBootSplash from 'react-native-bootsplash';

export default function App() {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {appStateVisible} = useAppState();

  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  const getData = (url: string) => {
    console.log(url);
    setResponse('');
    setError('');
    setLoading(true);

    fetch(url, {
      method: 'GET',
      timeoutInterval: 10000, // milliseconds
      // your certificates array (needed only in android) ios will pick it automatically
      sslPinning: {
        certs: ['cacert_pem'], // your certificates name (without extension), for example cert1.cer, cert2.cer
      },
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        e_platform: 'mobile',
      },
    })
      .then(response => {
        console.log(`response received ${response}`);
        setResponse(JSON.stringify(response));
        setLoading(false);
      })
      .catch(err => {
        console.log(`error: ${err}`);
        setError(err);
        setLoading(false);
      });
  };

  const handleOpenWifiSettingsAndroid = () => {
    try {
      const intent = 'android.settings.WIFI_SETTINGS';
      Linking.sendIntent(intent);
      console.log('appstate', appStateVisible);
    } catch (error) {
      console.log('Error opening Wi-Fi settings:', error);
    }
  };

  return (
    <View style={{gap: 10}}>
      <Text style={{fontSize: 20}}>Enter Url</Text>
      <TextInput
        value={url}
        placeholder="Enter Url"
        onChangeText={val => setUrl(val)}
        style={{
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderColor: '#0000008c',
          borderRadius: 5,
          width: '80%',
        }}
      />
      <Button
        title="Press Me"
        onPress={() => {
          handleOpenWifiSettingsAndroid();
          console.log('chala ha?');
        }}
      />
      {loading && <ActivityIndicator size={'large'} color={'#61afef'} />}
      <Text style={{fontSize: 14}}>Response: {response}</Text>
      <Text>
        Error: <Text style={{color: 'red'}}>{error}</Text>
      </Text>
    </View>
  );
}

const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {appStateVisible};
};

const styles = StyleSheet.create({});
