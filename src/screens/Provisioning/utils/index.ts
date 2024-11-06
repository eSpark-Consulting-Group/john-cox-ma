import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestMultiple,
  PERMISSIONS,
  checkMultiple,
} from 'react-native-permissions';
import * as FileSystem from 'expo-file-system';

export async function checkPermissions() {
  try {
    const status = await checkMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    console.log('check Granted permissions HERE:---------------------------');

    console.log(
      'Bluetooth Scan Permission:',
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN],
    );
    console.log(
      'Bluetooth Connect Permission:',
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT],
    );
    console.log(
      'Location Permission:',
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    );

    if (
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'granted' &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'granted' &&
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted'
    ) {
      console.log('All permissions granted. HERE');
      return true;
    } else {
      console.log('Some permissions are not granted. so requesting again HERE');
      const res = await requestPermissions();
      return res;
    }
  } catch (err) {
    console.error('check Error requesting permissions:', err);
    return false;
  }
}

async function requestPermissions() {
  try {
    const status = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);

    console.log('check Granted permissions:---------------------------');

    console.log(
      'Bluetooth Scan Permission:',
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN],
    );
    console.log(
      'Bluetooth Connect Permission:',
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT],
    );
    console.log(
      'Location Permission:',
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    );

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

export const scanWifiList = async (device: ESPDevice) => {
  try {
    const wifiList = await device?.scanWifiList();
    console.log('wifi List: ', wifiList);
    return wifiList;
  } catch (error) {
    console.error('Error scanning WiFi list:', error);
  }
};

async function checkCompleteCacheForDomain(domainName: string) {
  const keys = await AsyncStorage.getAllKeys();
  for (const key of keys) {
    const data = await AsyncStorage.getItem(key);
    console.log("cache:" , data, '--------------');
    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData.domain_name === domainName) {
        console.log(' ---- timesp1 already exists ---- ');
        return true;
      }
    }
  }
  console.log(' ---- timesp2 does not exist already ---- ');
  return false;
}
async function checkCompleteCacheForDomainRepitition(domainName: string) {
  const keys = await AsyncStorage.getAllKeys();
  let n = 0;
  for (const key of keys) {
    const data = await AsyncStorage.getItem(key);
    console.log("cache repetition:" , data, '--------------');
    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData.domain_name === domainName) {
        console.log(' ---- domain exists ---- ', n + 1);
        n += 1;
      }
    }
  }
  return n;
}

async function checkFileForDomainRepetition() {
  const permission = await requestDirectoryPermission();
  let timesp1Count = 0;
  let timesp2Count = 0;

  if (permission && permission.granted) {
    const path = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      permission.directoryUri,
    );

    if (path && path.length > 0) {
      console.log('Files found in directory:', path);

      // Iterate over each file in the directory
      for (const filePath of path) {
        // Read each file's content
        const fileContent =
          await FileSystem.StorageAccessFramework.readAsStringAsync(filePath);

        // Parse the file data and check for domain names
        const parsedData = JSON.parse(fileContent);

        if (parsedData.domain_name === 'timesp1') {
          timesp1Count += 1;
        } else if (parsedData.domain_name === 'timesp2') {
          timesp2Count += 1;
        }
      }
    } else {
      console.log('No files found in the directory.');
    }
  } else {
    console.log('Directory permissions not granted.');
  }

  console.log('timesp1 count:', timesp1Count);
  console.log('timesp2 count:', timesp2Count);

  return {timesp1Count, timesp2Count};
}

//res1 device se jo domain aur device details arhi wo heyn
async function handleDomainAssignment(device: ESPDevice, res1: any) {
  switch (res1.domain_name) {
    case '':
      console.log('Checking cache and files...');

      const cachedData = await checkCache(res1.mac_address);
      const timesp1Exists_Count = await checkCompleteCacheForDomainRepitition(
        'timesp1',
      );
      const timesp2Exists_Count = await checkCompleteCacheForDomainRepitition(
        'timesp2',
      );
      if (cachedData) {
        if (timesp1Exists_Count == 2) {
          await checkAndAssignDomain(device, 'timesp2');
          ('timesp1 repeated assignment');
        } else if (timesp2Exists_Count == 2) {
          await checkAndAssignDomain(device, 'timesp1');
          ('timesp2 repeated assignment');
        } else {
          console.log("cachedData.domainName: ", cachedData.domain_name);          
          await checkAndAssignDomain(device, cachedData.domain_name);
        }
        await updateFile(res1.mac_address, device);
      } else {
        const fileData = await checkFile(res1.mac_address);
        if (fileData) {
          const {timesp1Count, timesp2Count} =
            await checkFileForDomainRepetition();
          if (timesp1Count == 2) {
            await checkAndAssignDomain(device, 'timesp2');
            ('timesp1 repeated assignment');
          } else if (timesp2Count == 2) {
            await checkAndAssignDomain(device, 'timesp1');
            ('timesp2 repeated assignment');
          } else {
            await checkAndAssignDomain(device, cachedData.domain_name);
          }
          await updateFile(res1.mac_address, device);
        } else {
          // Check complete cache for "timesp1"
          const timesp1Exists = await checkCompleteCacheForDomain('timesp1');
          const domainToAssign = timesp1Exists ? 'timesp2' : 'timesp1';
          console.log(
            '🚀 ~ handleDomainAssignment ~ domainToAssign:',
            domainToAssign,
            device,
          );
          await checkAndAssignDomain(device, domainToAssign);
          await updateFile(res1.mac_address, device);
        }
      }
      break;
    case 'timesp1':
      console.log('timeesp1 aya ha ===================>>>>>>>>>>>>>>');

      break;
    case 'timesp2':
      console.log('domain received from device---', res1.domain_name);
      await checkAndAssignDomain(device, res1.domain_name);
      await updateFile(res1.mac_address, device);
      break;

    default:
      break;
  }
}

let cachedPermission: {
  directoryUri: string;
  granted: boolean;
} | null = null;

async function requestDirectoryPermission() {
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
async function checkDirectoryPermission(mac_address: string) {
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

//readOnly File
async function checkFile(mac_address: string) {
  const res = await checkDirectoryPermission(mac_address);
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
  const res = await checkDirectoryPermission(mac_address);
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
  try {
    const dirInfo = await FileSystem.StorageAccessFramework.createFileAsync(
      directoryUri,
      `${mac_address}.json`,
      'application/json',
    );
    console.log('Created file:', dirInfo); // Log the file info

    const response = await device.sendData(
      'domain-name',
      JSON.stringify({type: 'domain_request'}),
    );

    const writeRes = await FileSystem.StorageAccessFramework.writeAsStringAsync(
      dirInfo,
      response,
      {encoding: 'utf8'},
    );
    console.log('Write result:', writeRes); // Log the write result
  } catch (error) {
    console.error('Error creating/writing file:', error);
  }
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
