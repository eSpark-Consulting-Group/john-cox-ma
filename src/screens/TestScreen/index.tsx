import React, {useEffect, useState} from 'react';
import {GapView, MyButton, MyCanvas, MyInput, MyText} from '../../components';
import {ActivityIndicator, View} from 'react-native';

export default function Test() {
  const [url, setUrl] = useState<string>('https://timesp1.local/userLogin');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getData = (url: string) => {
    console.log(url);
    setResponse('');
    setError('');
    setLoading(true);

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        username: 'ESP_409151',
        password: 'fc32a4',
      }),
    })
      .then(response => response.json())
      .then((data: any) => {
        console.log(data.token);
      })
      .catch(error => {
        console.error('Error:', error);
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
          onChange={val => setUrl(val)}
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
