import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {
  GapView,
  MyButton,
  MyCanvas,
  MyFooter,
  MyHeader,
  MyText,
} from '../../../components';
import {RootStackParamsList} from '../../../types/navigationParams';
import {useService} from '../../../components/ServiceProvider';
import {useEffect, useState} from 'react';

type ConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'Confirmation'
>;

export default function Confirmation() {
  const navigation = useNavigation<ConfirmationScreenProps['navigation']>();
  const [allServicesFound, setAllServicesFound] = useState(false);
  const {resolvedService1, resolvedService2, serviceFound} = useService();

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ serviceFound.timesp2:', serviceFound.timesp2);
    console.log('🚀 ~ useEffect ~ serviceFound.timesp1:', serviceFound.timesp1);
    if (serviceFound.timesp1 && serviceFound.timesp2) {
      setAllServicesFound(true);
    }
  }, [serviceFound]);

  return (
    <MyCanvas>
      <View style={styles.main}>
        <MyHeader />
        <View style={styles.wrapper}>
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
              labelStyle={{
                fontSize: 20,
                opacity: allServicesFound ? 0.5 : 1,
              }}
              textColor={'red'}
              onPress={() => {
                if (!allServicesFound) {
                  navigation.navigate('ScanDevices');
                }
              }}
            />
          </View>
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
