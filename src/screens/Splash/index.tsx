import {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';

import RootNav from '../../navigation';

export default function Splash() {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);
  return <RootNav />;
}
