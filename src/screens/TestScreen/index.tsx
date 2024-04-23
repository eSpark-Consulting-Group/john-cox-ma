import React, {useState} from 'react';
import {GapView, MyButton, MyCanvas, MyInput, MyText} from '../../components';
import {ActivityIndicator, View} from 'react-native';
import {fetch} from 'react-native-ssl-pinning';

export default function Test() {
  const [url, setUrl] = useState<string>('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        certs: ['cacert'], // your certificates name (without extension), for example cert1.cer, cert2.cer
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

  return (
    <MyCanvas>
      <View style={{padding: 20, gap: 20}}>
        <GapView length={50} />
        <MyText>Test</MyText>
        <MyInput
          value={url}
          placeholder="Enter Url"
          onChangeText={val => setUrl(val)}
          width={310}
          height={40}
        />
        <MyButton label="Check" onPress={() => getData(url)} />
        {loading && <ActivityIndicator size={'large'} color={'#61afef'} />}
        <MyText style={{fontSize: 14}}>Response: {response}</MyText>
        <MyText>
          Error: <MyText style={{color: 'red'}}>{error}</MyText>
        </MyText>
      </View>
    </MyCanvas>
  );
}
