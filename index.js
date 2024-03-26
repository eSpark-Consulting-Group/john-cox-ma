/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Root from './src/navigation/index';
import Splash from './src/screens/Splash';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Splash);
