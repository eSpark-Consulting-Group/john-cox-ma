import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';

import {
  GapView,
  Loader,
  MyButton,
  MyCanvas,
  MyFooter,
  MyHeader,
  MyText,
} from '../../../components';
import {RootStackParamsList} from '../../../types/navigationParams';
import {useService} from '../../../components/ServiceProvider';
import {useEffect, useState} from 'react';
import React from 'react';
import {MyTheme} from '../../../types';

type ConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'Confirmation'
>;

export default function Confirmation() {
  const theme = useTheme() as MyTheme;
  const navigation = useNavigation<ConfirmationScreenProps['navigation']>();
  const {resolvedService1, resolvedService2, serviceFound} = useService();
  const [loading, setLoading] = useState(true);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    // Show loader for 10 seconds initially
    const timeout = setTimeout(() => {
      setLoading(false); // Hide loader after 10 seconds
    }, 10000);
    if (serviceFound.timesp1 && serviceFound.timesp2) {
      console.log('both devices connected');
      setDisable(true);
      return; // Do nothing if condition is met
    }

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  const handleYesPress = () => {
    if (disable) {
      console.log('disabled yes');
      return;
    }
    console.log('yes pressed');
    navigation.navigate('ScanDevices'); // Navigate if condition is not met
  };

  return (
    <MyCanvas>
      <View style={styles.main}>
        <MyHeader />
        <View style={styles.wrapper}>
          {loading ? (
            // Show loader initially
            <Loader size="large" />
          ) : (
            <>
              <MyText
                text="Do you want another network?"
                size={26}
                style={styles.caption}
              />
              <GapView length={85} />
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <MyButton
                  label="NO"
                  labelStyle={{fontSize: 20}}
                  onPress={() => {
                    navigation.navigate('Main');
                  }}
                />
                <MyButton
                  label="YES"
                  labelStyle={{fontSize: 20}}
                  textColor={'red'}
                  onPress={handleYesPress} // Handle YES press
                  backgroundColor={disable ? 'grey' : theme.colors.pale}
                />
              </View>
            </>
          )}
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
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: '15%',
    width: '50%',
  },
  caption: {
    alignSelf: 'center',
    paddingTop: 30,
    lineHeight: 30,
    width: '60%',
    textAlign: 'center',
  },
});
