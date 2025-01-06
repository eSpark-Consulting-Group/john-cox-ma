import {StyleSheet} from 'react-native';
import {MyTheme} from '../../../types';

export const styles = (theme?: MyTheme) =>
  StyleSheet.create({
    screen: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    container: {alignItems: 'center', width: '90%'},
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fuelBurn: {paddingTop: 2, width: '50%'},
    range: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    box: {
      justifyContent: 'space-between',
      width: '100%',
      paddingTop: 25,
      gap: 20,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
    },
    GaugeRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
    },
    caption: {
      alignSelf: 'center',
      paddingVertical: 20,
      lineHeight: 30,
      width: '60%',
      textAlign: 'center',
      letterSpacing: 1,
    },
    subCaption: {alignSelf: 'center', textAlign: 'center', width: '75%'},
    warn: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      gap: 20,
    },
    main: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    reload: {alignSelf: 'flex-end', paddingRight: '4%'},
  });
