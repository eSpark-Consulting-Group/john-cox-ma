import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SocketProvider from '../providers/SocketProvider';
import {RootStackParamsList} from '../types/navigationParams';
import ScanDevices from '../screens/Provisioning/ScanDevices';
import Proof from '../screens/Provisioning/Proof';
import ScanNetworks from '../screens/Provisioning/ScanNetworks';
import Confirmation from '../screens/Provisioning/Confirmation';
import Main from '../screens/Main';
import Login from '../screens/Login';
import Setup from '../screens/Setup';
import FMMSetup from '../screens/FMMSetup';
import FuelTanks from '../screens/FuelTanks';

const RootStack = createNativeStackNavigator<RootStackParamsList>();
const WrappedStackNavigator = () => {
  return (
    <SocketProvider>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen
            name="ScanDevices"
            component={ScanDevices}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Proof"
            component={Proof}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="ScanNetworks"
            component={ScanNetworks}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Confirmation"
            component={Confirmation}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Main"
            component={Main}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Setup"
            component={Setup}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="FMMSetup"
            component={FMMSetup}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="FuelTanks"
            component={FuelTanks}
            options={{
              headerShown: false,
            }}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </SocketProvider>
  );
};
export default WrappedStackNavigator;
