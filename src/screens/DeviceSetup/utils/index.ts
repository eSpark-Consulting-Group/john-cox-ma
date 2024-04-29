import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestMultiple,
  PERMISSIONS,
  checkMultiple,
} from 'react-native-permissions';
import * as FileSystem from 'expo-file-system';
import {err} from 'react-native-svg';

async function requestPermissions() {
  try {
    const status = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);

    console.log('Granted permissions:', status);

    if (
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'granted' &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'granted' &&
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted'
    ) {
      console.log('All permissions granted.');
      return true;
    } else {
      console.log('Some permissions are not granted.');
      return false;
    }
  } catch (err) {
    console.error('Error requesting permissions:', err);
    return false;
  }
}

export async function checkPermissions() {
  try {
    const status = await checkMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    console.log('check Granted permissions:', status);

    if (
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'granted' &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'granted' &&
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted'
    ) {
      console.log('check All permissions granted.');
      return true;
    } else {
      console.log('check Some permissions are not granted.');
      const res = await requestPermissions();
      return res;
    }
  } catch (err) {
    console.error('check Error requesting permissions:', err);
    return false;
  }
}

export const sendingData = async (device: ESPDevice) => {
  try {
    const res = await device?.sendData(
      'domain-name',
      JSON.stringify({type: 'domain_request'}),
    );
    console.log('Response:', res);
    if (res) {
      const res1 = JSON.parse(res);
      await handleDomainAssignment(device, res1);
      return res;
    }
  } catch (error) {
    console.error('Error sending data:', error);
    return 'error sending data';
  }
};

async function handleDomainAssignment(device: ESPDevice, res1: any) {
  switch (res1.domain_name) {
    case '':
      console.log('Checking cache and files...');
      const cachedData = await checkCache(res1.mac_address);
      if (cachedData) {
        await checkAndAssignDomain(device, cachedData.domain_name);
        await updateFile(res1.mac_address, device);
      } else {
        const fileData = await checkFile(res1.mac_address);
        if (fileData) {
          const data = JSON.parse(fileData);
          await checkAndAssignDomain(device, data.mac_address);
        } else {
          await checkAndAssignDomain(device, 'timesp1');
          await updateFile(res1.mac_address, device);
        }
      }
      break;
    case 'timesp1':
    case 'timesp2':
      console.log('domain received from device---', res1.domain_name);
      await checkAndAssignDomain(device, res1.domain_name);
      await updateFile(res1.mac_address, device);
      break;

    default:
      break;
  }
}

// permissions + path only
async function requstDirectoryPermission(mac_address: string) {
  const permission =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  console.log('Permission mili ? ', permission);
  if (permission.granted) {
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

//readOnly File
async function checkFile(mac_address: string) {
  const res = await requstDirectoryPermission(mac_address);
  if (res && res[0] && res[2]) {
    const filePath = res[0]?.toString();
    if (filePath?.includes(`${mac_address.replaceAll(':', '_')}`)) {
      const readRes = await FileSystem.StorageAccessFramework.readAsStringAsync(
        filePath!,
      );
      console.log('Data in the file: ', readRes);
      return readRes;
    }
  }
}

//update FIle
async function updateFile(mac_address: string, device: ESPDevice) {
  const res = await requstDirectoryPermission(mac_address);
  if (res && res[1] && res[2]) {
    const filePath = res[0]?.toString();
    if (filePath?.includes(`${mac_address.replaceAll(':', '_')}`)) {
      await FileSystem.StorageAccessFramework.deleteAsync(filePath!);
      await createAndWriteFile(res[1].toString(), mac_address, device);

      console.log('File updated --- ');
    } else {
      await createAndWriteFile(res[1].toString(), mac_address, device);
      console.log('File created --- ');
    }
    const readRes = await FileSystem.StorageAccessFramework.readAsStringAsync(
      filePath!,
    );
    console.log('File Now: ', readRes);
  }
}

async function createAndWriteFile(
  directoryUri: string,
  mac_address: string,
  device: ESPDevice,
) {
  const dirInfo = await FileSystem.StorageAccessFramework.createFileAsync(
    directoryUri,
    `${mac_address}.json`,
    'application/json',
  );
  console.log('created file', dirInfo);
  const response = await device.sendData(
    'domain-name',
    JSON.stringify({type: 'domain_request'}),
  );
  const writeRes = await FileSystem.StorageAccessFramework.writeAsStringAsync(
    dirInfo,
    response,
    {encoding: 'utf8'},
  );
}

export async function checkCache(mac_address: string) {
  try {
    const data = await AsyncStorage.getItem(mac_address);
    if (data) {
      const result = JSON.parse(data);
      console.log('Cached data:', result);
      return result;
    } else {
      console.log('No data found in cache.');
      return null;
    }
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}

async function checkAndAssignDomain(device: ESPDevice, domainName: string) {
  const res = await device?.sendData(
    'domain-name',
    JSON.stringify({
      type: 'domain_assignment',
      domain_name: domainName,
    }),
  );
  console.log(`Domain assigned as ${domainName}:`, res);
  updateCacheDomain(device);
}

async function setDev1(res: string) {
  const res_JSON = JSON.parse(res);
  try {
    await AsyncStorage.setItem(res_JSON.mac_address, res);
    console.log('Cache updated with:', res);
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

async function updateCacheDomain(device: ESPDevice) {
  const res = await device.sendData(
    'domain-name',
    JSON.stringify({type: 'domain_request'}),
  );
  await setDev1(res!);
}
