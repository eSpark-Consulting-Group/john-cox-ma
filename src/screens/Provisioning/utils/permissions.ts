import {Platform} from 'react-native';
import {
  requestMultiple,
  PERMISSIONS,
  checkMultiple,
} from 'react-native-permissions';
import * as FileSystem from 'expo-file-system';

const LOCATION_PERMISSION = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
const BLE_PERMISSIONS = [
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
];

export async function checkPermissions(): Promise<boolean> {
  try {
    const locationStatus = await checkMultiple([LOCATION_PERMISSION]);
    const bleStatus = await checkBlePermissions();

    if (locationStatus[LOCATION_PERMISSION] === 'granted' && bleStatus) {
      return true;
    } else {
      const res = await requestPermissions();
      return res;
    }
  } catch (err) {
    console.error('Error checking permissions:', err);
    return false;
  }
}

export async function requestPermissions(): Promise<boolean> {
  try {
    const locationStatus = await requestMultiple([LOCATION_PERMISSION]);
    const bleStatus = await requestBlePermissions();

    return locationStatus[LOCATION_PERMISSION] === 'granted' && bleStatus;
  } catch (err) {
    console.error('Error requesting permissions:', err);
    return false;
  }
}

async function checkBlePermissions(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version < 31) {
    return true;
  }

  try {
    const status = await checkMultiple(BLE_PERMISSIONS);
    return BLE_PERMISSIONS.every(
      permission => status[permission] === 'granted',
    );
  } catch (err) {
    console.error('Error checking BLE permissions:', err);
    return false;
  }
}

async function requestBlePermissions(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version < 31) {
    return true;
  }

  try {
    const status = await requestMultiple(BLE_PERMISSIONS);
    return BLE_PERMISSIONS.every(
      permission => status[permission] === 'granted',
    );
  } catch (err) {
    console.error('Error requesting BLE permissions:', err);
    return false;
  }
}

let cachedPermission: {
  directoryUri: string;
  granted: boolean;
} | null = null;

export async function requestDirectoryPermission() {
  if (!cachedPermission || !cachedPermission.granted) {
    const permission =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    console.log('Permission granted? ', permission);
    if (permission.granted) {
      cachedPermission = {
        directoryUri: permission.directoryUri,
        granted: permission.granted,
      };
    }
  }
  return cachedPermission;
}

// permissions + path only
export async function checkDirectoryPermission(mac_address: string) {
  const permission = await requestDirectoryPermission();
  if (permission && permission.granted) {
    const path = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      permission.directoryUri,
    );
    if (path && path.length > 0) {
      console.log('path array?', path);
      console.log(
        'What is the macAddress????? => ',
        mac_address.replace(':', '_'),
      );

      const result = path.find(item =>
        item.includes(`${mac_address.replaceAll(':', '_')}`),
      );
      console.log('found file in path?', result);

      if (result) {
        return [result, permission.directoryUri, permission.granted];
      } else {
        console.log('File not found in directory.');
        return [path[0], permission.directoryUri, permission.granted]; // Or handle the case differently
      }
    } else {
      console.log('Directory is empty.');
      return [path[0], permission.directoryUri, permission.granted]; // Or handle the case differently
    }
  }
}
