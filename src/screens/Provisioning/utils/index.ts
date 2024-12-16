import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestMultiple,
  PERMISSIONS,
  checkMultiple,
} from 'react-native-permissions';
import * as FileSystem from 'expo-file-system';
import {Platform} from 'react-native';

export async function checkPermissions() {
  try {
    const status = await checkMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    const bleStatus = await checkBlePermissions();
    console.log('check Granted permissions HERE:---------------------------');
    console.log(
      'Location Permission:',
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    );

    if (
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted' &&
      bleStatus
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
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    const bleStatus = await requestBlePermissions();
    console.log('check Granted permissions:---------------------------');

    console.log(
      'Location Permission:',
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    );

    if (
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted' &&
      bleStatus
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

async function checkBlePermissions() {
  if (Platform.OS == 'android' && Platform.Version < 31) {
    return true;
  }
  try {
    const status = await checkMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
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

    if (
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'granted' &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'granted'
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

async function requestBlePermissions() {
  if (Platform.OS == 'android' && Platform.Version < 31) {
    return true;
  }
  try {
    const status = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
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
    if (
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'granted' &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'granted'
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

export async function sendingData(device: ESPDevice) {
  if (!device) {
    console.error('Device object is null or undefined');
    return {res: null, domain: null, error: 'invalid device object'};
  }
  try {
    const res = await device.sendData(
      'domain-name',
      JSON.stringify({type: 'domain_request'}),
    );
    console.log('🚀 ~ sendingData ~ res:', res);
    if (res) {
      try {
        console.log('Raw response:', res);
        const res1 = JSON.parse(res);
        console.log('Parsed response:', res1);

        // Check if res1 is null or undefined
        if (res1 == null) {
          console.error('Parsed response is null or undefined');
          return {res: null, domain: null, error: 'error: null response'};
        }

        // Check if domain_name property exists, even if it's an empty string
        if ('domain_name' in res1) {
          const domain = await handleDomainAssignment(device, res1);
          console.log(
            '🚀 ~ sendingData ~ domain:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            domain,
          );
          return {res, domain, error: null};
        } else {
          console.error(
            'Invalid response format: missing domain_name property',
            res1,
          );
          return {res: null, domain: null, error: 'invalid response format'};
        }
      } catch (parseError) {
        console.error(
          'Error parsing response:',
          parseError,
          'Raw response:',
          res,
        );
        return {res: null, domain: null, error: 'invalid JSON response'};
      }
    } else {
      console.error('No response received from device');
      return {res: null, domain: null, error: 'no response from device'};
    }
  } catch (error) {
    console.error('Error sending data:', error);
    return {res: null, domain: null, error: 'sending data'};
  }
}

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
    console.log('cache:', data, '--------------');
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

interface CacheItem {
  domain_name?: string;
  [key: string]: any;
}

async function checkCompleteCacheForDomainRepetition(
  domainName: string,
): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();

    let domainMatchCount = 0;

    // Process items in batches to improve performance
    const batchSize = 10;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      const items = await AsyncStorage.multiGet(batch);

      for (const [, value] of items) {
        if (value) {
          try {
            const item: CacheItem = JSON.parse(value);
            if (item.domain_name === domainName) {
              domainMatchCount++;
              console.log('---- domain exists ----', domainMatchCount);
            }
          } catch (parseError) {
            console.warn(`Failed to parse item: ${parseError}`);
          }
        }
      }
    }

    return domainMatchCount;
  } catch (error) {
    console.error('Error checking domain repetition in cache:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}

async function checkFileForDomainRepetition() {
  try {
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
          // Check if the file has a .json extension
          if (filePath.toLowerCase().endsWith('.json')) {
            // Read each JSON file's content
            const fileContent =
              await FileSystem.StorageAccessFramework.readAsStringAsync(
                filePath,
              );
            console.log(
              '🚀 ~ checkFileForDomainRepetition ~ fileContent:',
              fileContent,
            );
            // Parse the file data and check for domain names
            const parsedData = JSON.parse(fileContent); //! is me masla ha !
            if (parsedData?.domain_name === 'timesp1') {
              timesp1Count += 1;
            } else if (parsedData?.domain_name === 'timesp2') {
              timesp2Count += 1;
            } else {
            }
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
  } catch (e) {
    console.log('🚀 ~ checkFileForDomainRepetition ~ e:', e);
    return {timesp1Count: 0, timesp2Count: 0};
  }
}

//res1 device se jo domain aur device details arhi wo heyn
async function handleDomainAssignment(device: ESPDevice, res1: any) {
  console.log('🚀 ~ handleDomainAssignment ~ res1:', res1);
  switch (res1.domain_name) {
    case '':
      console.log('Checking cache and files...');
      const cachedData = await checkCache(res1.mac_address);
      const timesp1Exists_Count = await checkCompleteCacheForDomainRepetition(
        'timesp1',
      );
      const timesp2Exists_Count = await checkCompleteCacheForDomainRepetition(
        'timesp2',
      );

      if (cachedData) {
        
        if (timesp1Exists_Count == 2) {
          await checkAndAssignDomain(device, 'timesp2');
          console.log('timesp1 repeated assignment');
        await updateFile(res1.mac_address, device);

          return 'timesp2';
        } else if (timesp2Exists_Count == 2) {
          await checkAndAssignDomain(device, 'timesp1');
        await updateFile(res1.mac_address, device);

          console.log('timesp2 repeated assignment');
          return 'timesp1';
        } else {
          console.log('cachedData.domainName: ', cachedData?.domain_name);
          await checkAndAssignDomain(device, cachedData?.domain_name);
          await updateFile(res1.mac_address, device);
          return cachedData?.domain_name;

        }
      } else {
        //! Checking in File System
        const fileData = await checkFile(res1.mac_address);
        console.log(
          '🚀 ~ handleDomainAssignment ~ res1.mac_address:',
          res1.mac_address,
        );
        if (fileData) {
          const {timesp1Count, timesp2Count} =
            await checkFileForDomainRepetition();
          console.log(
            '🚀 ~ handleDomainAssignment ~ timesp1Count:xxxxxxxxxxxxxxxxxxx',
            timesp1Count,
            timesp2Count,
            fileData,
          );
          await updateFile(res1.mac_address, device);
          if (timesp1Count == 2) {
            console.log('timesp1 repeated assignment');
            await checkAndAssignDomain(device, 'timesp2');
            return 'timesp2';
          } else if (timesp2Count == 2) {
            console.log('timesp2 repeated assignment');
            await checkAndAssignDomain(device, 'timesp1');
            return 'timesp1';
          } else {
            console.log('Both counts are 1');
            const parsedFileData = JSON.parse(fileData);
            await checkAndAssignDomain(
              device,
              parsedFileData?.domain_name as string,
            );
            return parsedFileData?.domain_name;
          }
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
          return domainToAssign;
        }
      }
    case 'timesp1':
      console.log('timeesp1 aya ha ===================>>>>>>>>>>>>>>');
      break;
    case 'timesp2':
      console.log('domain received from device---', res1.domain_name);
      await checkAndAssignDomain(device, res1.domain_name);
      await updateFile(res1.mac_address, device);
      return res1.domain_name;
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
      console.log('🚀 ~ checkFile ~ filePath:', filePath);
      const readRes = await FileSystem.StorageAccessFramework.readAsStringAsync(
        filePath!,
      );
      console.log('Data in the file: ', readRes);
      return readRes;
    }
  }
}

//update FIle
async function updateFile(
  mac_address: string,
  device: ESPDevice,
): Promise<void> {
  try {
    const res = await checkDirectoryPermission(mac_address);
    console.log('🚀 ~ res:-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', res);

    if (!res || !res[1] || !res[2]) {
      console.error('Directory permission not granted or invalid result');
      return;
    }

    const [existingFilePath, directoryUri, permissionGranted] = res;

    if (!directoryUri || !permissionGranted) {
      console.error('Invalid directory URI or permission not granted');
      return;
    }

    const normalizedMacAddress = mac_address.replaceAll(':', '_');
    const fileName = `${normalizedMacAddress}.json`;

    // Check if the file exists
    const fileExists =
      typeof existingFilePath === 'string' &&
      existingFilePath.includes(normalizedMacAddress);

    if (fileExists) {
      // File exists, update it
      await FileSystem.StorageAccessFramework.deleteAsync(existingFilePath);
      console.log('Existing file deleted');
    }

    // Create and write the new file
    await createAndWriteFile(directoryUri as string, mac_address, device);
    console.log(fileExists ? 'File updated' : 'File created');

    // Read the file content
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      directoryUri as string,
    );
    const newFilePath = files.find(file => file.includes(normalizedMacAddress));

    if (newFilePath) {
      const readRes = await FileSystem.StorageAccessFramework.readAsStringAsync(
        newFilePath,
      );
      console.log('File Now: ', readRes);
    } else {
      console.error('New file not found after creation/update');
    }
  } catch (error) {
    console.error('Error updating file:', error);
  }
}

async function createAndWriteFile(
  directoryUri: string,
  mac_address: string,
  device: ESPDevice,
) {
  try {
    const fileName = `${mac_address.replaceAll(':', '_')}.json`;
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      directoryUri,
      fileName,
      'application/json',
    );
    console.log('Created file:', fileUri);

    const response = await device.sendData(
      'domain-name',
      JSON.stringify({type: 'domain_request'}),
    );

    await FileSystem.StorageAccessFramework.writeAsStringAsync(
      fileUri,
      response,
      {encoding: FileSystem.EncodingType.UTF8},
    );
    console.log('Write completed');
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
