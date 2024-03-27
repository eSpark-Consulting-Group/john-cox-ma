import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../../types/navigationParams';
import {useNavigation, useTheme} from '@react-navigation/native';
import {
  GapView,
  MyButton,
  MyCanvas,
  MyCard,
  MyCheckbox,
  MyFooter,
  MyHeader,
  MyInput,
  MyText,
} from '../../components';
import {MyTheme} from '../../types';
import {Connected} from '../../assets';

type DeviceSetupScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'DeviceSetup'
>;

export default function DeviceSetup() {
  const navigation = useNavigation<DeviceSetupScreenProps['navigation']>();
  const theme = useTheme() as MyTheme;
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [device, setDevice] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const [enterPassword, setEnterPassword] = useState(false);
  const prefixes = ['TIMESP', 'ABCSP1', 'XYZSP1', 'MNOSP1'];
  const devices = [' ', '1', '2', '3', '4'];
  const networks = ['Network1', 'Network2', 'Network3', 'Network4'];

  const renderDevice = ({item}: {item: string}) => (
    <Pressable
      style={({pressed}) => [
        {
          borderWidth: pressed ? 1 : 0,
          borderColor: theme.colors.primary,
        },
        styles.item,
      ]}
      onPress={() => setSelectedDevice(item)}>
      <MyText size={25}>
        {prefix}_{item}
      </MyText>
      {selectedDevice === item ? (
        <MyCheckbox width={30} disabled value={true} />
      ) : (
        <View style={styles.cb} />
      )}
    </Pressable>
  );
  const renderNetwork = ({item}: {item: string}) => (
    <Pressable
      style={({pressed}) => [
        {
          borderWidth: pressed ? 1 : 0,
          borderColor: theme.colors.primary,
        },
        styles.item,
      ]}
      onPress={() => {
        setEnterPassword(true);
        setNetwork(item);
      }}>
      <MyText size={25}>{item}</MyText>
      {network == item && <Connected />}
    </Pressable>
  );

  const renderPrefix = ({item}: {item: string}) => (
    <Pressable
      style={({pressed}) => [
        {
          borderWidth: pressed ? 1 : 0,
          borderColor: theme.colors.primary,
        },
        styles.item,
      ]}
      onPress={() => setSelectedPrefix(item)}>
      <MyText size={25}>{item}</MyText>
      {selectedPrefix === item ? (
        <MyCheckbox width={30} disabled value={true} />
      ) : (
        <View style={styles.cb} />
      )}
    </Pressable>
  );

  return (
    <MyCanvas>
      <KeyboardAvoidingView style={styles.main} behavior="padding">
        <MyHeader />
        <GapView length={150} />
        <>
          <MyText
            text="Avaialble Networks"
            size={24}
            fontFamily="NotoSans-Bold"
            style={styles.title}
          />
          <MyCard>
            <FlatList
              data={networks}
              renderItem={renderNetwork}
              keyExtractor={(item, index) => index.toString()}
              style={{height: 240, width: '100%'}}
              showsVerticalScrollIndicator={false}
            />
          </MyCard>
          <GapView length={20} />
          <MyButton
            label="Back"
            labelStyle={{fontSize: 18}}
            onPress={() => setDevice(selectedDevice)}
            gradient
            style={{width: 150}}
          />
        </>
        {/* <>
          <MyText
            text="Enter Possession Proof"
            size={24}
            fontFamily="NotoSans-Bold"
            style={styles.title}
          />
          <View style={styles.inputContainer}>
            <MyInput height={45} size={16} />
            <MyText
              text={'Enter Pin for ' + 'TIMESP'}
              size={26}
              style={styles.caption}
            />
          </View>
          <GapView length={100} />
          <MyButton
            label="Next"
            style={{paddingHorizontal: 45}}
            labelStyle={{fontSize: 18}}
            onPress={() => setDevice(selectedDevice)}
          />
          <GapView length={20} />
          <MyButton
            label="Back"
            labelStyle={{fontSize: 18}}
            onPress={() => setDevice(selectedDevice)}
            gradient
            style={{width: 150}}
          />
        </> */}
        {/* <>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <MyText
              text="Device Prefix:  "
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <MyText text={prefix + '_'} size={30} />
          </View>
          <MyText
            text="Select Device"
            size={24}
            fontFamily="NotoSans-Bold"
            style={styles.title}
          />
          <MyCard>
            <FlatList
              data={devices}
              renderItem={renderDevice}
              keyExtractor={(item, index) => index.toString()}
              style={{height: 240, width: '100%'}}
              showsVerticalScrollIndicator={false}
            />
          </MyCard>
          <GapView length={120} />
          <MyButton
            label="Select"
            style={{paddingHorizontal: 45}}
            labelStyle={{fontSize: 18}}
            onPress={() => setDevice(selectedDevice)}
          />
        </> */}
        {/* <>
          <MyText
            text="Select Device Prefix"
            size={24}
            fontFamily="NotoSans-Bold"
            style={styles.title}
          />
          <MyCard>
            <FlatList
              data={prefixes}
              renderItem={renderPrefix}
              keyExtractor={(item, index) => index.toString()}
              style={{height: 240, width: '100%'}}
              showsVerticalScrollIndicator={false}
            />
          </MyCard>
          <GapView length={120} />
          <MyButton
            label="Select"
            style={{paddingHorizontal: 45}}
            labelStyle={{fontSize: 18}}
            onPress={() => setPrefix(selectedPrefix)}
          />
        </> */}
        <GapView length={120} />
        <MyFooter />
      </KeyboardAvoidingView>
    </MyCanvas>
  );
}

const styles = StyleSheet.create({
  main: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 20},
  item: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    flexDirection: 'row',
    gap: 15,
  },
  cb: {width: 20, height: 20},
  inputContainer: {width: '85%', paddingTop: 10},
  caption: {
    alignSelf: 'center',
    paddingTop: 20,
    lineHeight: 30,
    width: '60%',
    textAlign: 'center',
  },
});
