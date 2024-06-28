import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {GapView, MyCanvas, MyFooter, MyHeader} from '../../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../../../types/navigationParams';

type ProofScreenProps = NativeStackScreenProps<RootStackParamsList, 'Proof'>;

export default function Proof({route}: ProofScreenProps) {
  const {device} = route.params;
  return (
    <MyCanvas>
      <KeyboardAvoidingView style={styles.main} behavior="padding">
        <MyHeader />
        <GapView length={120} />
        <GapView length={120} />
        <MyFooter />
      </KeyboardAvoidingView>
    </MyCanvas>
  );
}

const styles = StyleSheet.create({
  main: {justifyContent: 'space-between', alignItems: 'center'},
});
