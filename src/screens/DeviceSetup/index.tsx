import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {Connected, Wifi} from '../../assets';

type DeviceSetupScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'DeviceSetup'
>;

export default function DeviceSetup() {
  const navigation = useNavigation<DeviceSetupScreenProps['navigation']>();
  const theme = useTheme() as MyTheme;
  const [step, setStep] = useState(0);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [device, setDevice] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const [connecting, setConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animationInterval, setAnimationInterval] = useState<NodeJS.Timeout>();
  const [count, setCount] = useState(0);

  const prefixes = ['TIMESP', 'ABCSP1', 'XYZSP1', 'MNOSP1'];
  const devices = [' ', '1', '2', '3', '4'];
  const networks = ['Network1', 'Network2', 'Network3', 'Network4'];

  useEffect(() => setCount(0), []);
  useEffect(() => console.log('step: ', step), [step]);
  useEffect(() => console.log('count: ', count), [count]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnimationIndex(prevIndex => (prevIndex + 1) % 4); // Change 4 to the number of animations you want to cycle through
      }, 500); // Adjust the interval duration as needed
      setAnimationInterval(interval);
    } else {
      clearInterval(animationInterval);
    }
    return () => clearInterval(animationInterval);
  }, [isLoading]);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setCount(count + 1);
        if (count % 2 != 0) {
          navigation.navigate('Main');
          setIsVisible(false);
          setStep(1);
        } else {
          setIsVisible(false);
          setStep(5);
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const startLoadingAnimation = () => {
    setIsLoading(true);
    // Set a timeout to stop the animation after a certain duration
    setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 3000); // Adjust the duration as needed
  };

  const renderConnectedTags = () => {
    const connectedTags = [];
    for (let i = 0; i < animationIndex; i++) {
      connectedTags.push(<Connected key={i} />);
    }
    return connectedTags;
  };

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
        setStep(4);
        setNetwork(item);
      }}>
      <MyText size={25}>{item}</MyText>
      {network == item && isLoading && (
        <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
          {renderConnectedTags()}
        </View>
      )}
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

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
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
              onPress={() => {
                setPrefix(selectedPrefix);
                setStep(1);
              }}
            />
          </>
        );
      case 1:
        return (
          <>
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
              onPress={() => {
                setDevice(selectedDevice);
                setStep(2);
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <MyText
              text="Enter Possession Proof"
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <View style={styles.inputContainer}>
              <MyInput height={45} size={16} />
              <MyText
                text={'Enter Pin for ' + prefix}
                size={26}
                style={styles.caption}
              />
            </View>
            <GapView length={100} />
            <MyButton
              label="Next"
              style={{paddingHorizontal: 45}}
              labelStyle={{fontSize: 18}}
              onPress={() => {
                setDevice(selectedDevice);
                setStep(3);
              }}
            />
            <GapView length={20} />
            <MyButton
              label="Back"
              labelStyle={{fontSize: 18}}
              onPress={() => setStep(1)}
              gradient
              style={{width: 150}}
            />
          </>
        );
      case 3:
        return (
          <>
            <MyText
              text="Available Networks"
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
              onPress={() => setStep(2)}
              gradient
              style={{width: 150}}
            />
          </>
        );
      case 4:
        return (
          <>
            <MyText
              text="Enter Password"
              size={24}
              fontFamily="NotoSans-Bold"
              style={styles.title}
            />
            <MyCard>
              <View style={styles.wifiRow}>
                <Wifi />
                <MyText size={24}>{network}</MyText>
              </View>
              <View style={{width: '95%', paddingTop: 15}}>
                <MyInput height={45} />
              </View>
              <GapView length={60} />
              <MyButton
                label="Connect"
                width={120}
                labelStyle={{fontSize: 20}}
                onPress={() => {
                  setConnecting(true);
                  startLoadingAnimation();
                  setStep(3);
                }}
              />
              <GapView length={20} />
            </MyCard>
          </>
        );
      case 5:
        return (
          <>
            <MyText
              text="Do you want another network?"
              size={26}
              style={styles.caption}
            />
            <GapView length={85} />
            <View
              style={{
                width: '43%',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <MyButton
                label="NO"
                labelStyle={{fontSize: 20}}
                onPress={() => {
                  navigation.navigate('Main');
                  setStep(1);
                }}
              />
              <MyButton
                label="YES"
                labelStyle={{fontSize: 20}}
                textColor={'red'}
                onPress={() => {
                  setStep(1);
                }}
              />
            </View>
          </>
        );

      // Add cases for other steps as needed
      default:
        return null;
    }
  }

  return (
    <MyCanvas>
      <Modal visible={isVisible} animationType="slide" transparent>
        <MyCanvas>
          <View style={[styles.modalContent]}>
            <MyText text="Connected" size={34} fontFamily="NotoSans-Bold" />
            <GapView length={100} />
            <MyCard>
              <View style={styles.wifiRow}>
                <Wifi />
                <MyText size={19} style={{width: '70%'}}>
                  {network}
                </MyText>
                <MyCheckbox value={true} width={32} disabled />
              </View>
            </MyCard>
            <GapView length={100} />
          </View>
        </MyCanvas>
      </Modal>

      <KeyboardAvoidingView style={styles.main} behavior="padding">
        <MyHeader />
        <GapView length={120} />
        {renderStep()}
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
  wifiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    gap: 20,
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
