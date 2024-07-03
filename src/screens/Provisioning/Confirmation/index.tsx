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

type ConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'Confirmation'
>;

export default function Confirmation() {
  const navigation = useNavigation<ConfirmationScreenProps['navigation']>();
  return (
    <MyCanvas>
      <MyText>dvhsdvbfhvb</MyText>
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
              width: '50%',
              justifyContent: 'space-between',
              flexDirection: 'row',
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
              onPress={() => {
                navigation.navigate('ScanDevices');
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
