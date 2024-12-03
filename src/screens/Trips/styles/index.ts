import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    
    flexGrow: 1
  },
  titleContainer: {
    width: '90%',
  },
  title: {
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    gap: 2,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  inputContainer: {
    width: '50%',
    paddingHorizontal: 15,
    alignItems: 'center',
    gap: 5,
  },
  button: {width: 130, alignSelf: 'center'},
  confirmation: {
    width: '80%',
    alignItems: 'center',
    textAlign: 'center',
  },
  inner: {
    width: '70%',
    alignItems: 'center',
    gap: 20,
  },
  confirmationMessage: {textAlign: 'center', paddingBottom: 5, lineHeight: 30},
  buttonRow: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rowButtons: {fontSize: 18, paddingHorizontal: 10},
  card2: {flexDirection: 'row', width: '100%'},
  innercard2: {
    justifyContent: 'space-between',
    flexGrow: 1,
    height: 50,
  },
  boxes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
  },
});
