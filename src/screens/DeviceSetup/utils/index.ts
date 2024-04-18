import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestMultiple,
  PERMISSIONS,
  checkMultiple,
} from 'react-native-permissions';
import * as FileSystem from 'expo-file-system';

export async function requestPermissions() {
  try {
    const status = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);

    console.log('Granted permissions:', status);

    if (
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] &&
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
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
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    console.log('check Granted permissions:', status);

    if (
      status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] &&
      status[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] &&
      status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
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
    }
  } catch (error) {
    console.error('Error sending data:', error);
  }
};

async function handleDomainAssignment(device: ESPDevice, res1: any) {
  await checkCache(res1.mac_address);

  switch (res1.domain_name) {
    case '':
      console.log('Checking cache and files...');
      const cachedData = await checkCache(res1.mac_address);
      const filedData = await request_Permissions(
        device,
        res1.mac_address,
        false,
        true,
      );

      if (cachedData) {
        await checkAndAssignDomain(device, cachedData.domain_name);
      } else if (filedData) {
        if (filedData) {
          await checkAndAssignDomainFromFiles(filedData, device);
        } else {
          console.log('No data found in Files.');
          return null;
        }
      } else {
        await checkAndAssignDomain(device, 'timesp1');
      }
      break;

    case 'timesp1':
    case 'timesp2':
      console.log('domain received from device---', res1.domain_name);
      await checkAndAssignDomain(device, res1.domain_name);
      await request_Permissions(device, res1.mac_address, true, false);
      break;

    default:
      break;
  }
}

export async function request_Permissions(
  device: ESPDevice,
  mac_address: string,
  update?: boolean,
  readOnly?: boolean,
) {
  const res =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  console.log('permission response: ', res);
  if (res.granted) {
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      res.directoryUri,
    );
    if (files && files.length > 0) {
      console.log('existed?', files[0].includes(`${mac_address}.txt`));
      const result = await checkFiles(
        res,
        files[0], // Ensure files[0] is valid before passing it to checkFiles
        mac_address,
        device,
        update,
        readOnly,
      );
      return result;
    } else {
      console.log('No files found in the directory.');
      return null; // Return null or handle the case where no files are found
    }
  }
}

async function checkFiles(
  res: FileSystem.FileSystemRequestDirectoryPermissionsResult,
  fileA: string,
  mac_address: string,
  device: ESPDevice,
  update?: boolean,
  readOnly?: boolean,
) {
  try {
    if (res.granted) {
      if ((!fileA.includes(`${mac_address}.txt`) || update) && !readOnly) {
        const dirInfo = await FileSystem.StorageAccessFramework.createFileAsync(
          res.directoryUri,
          `${mac_address}.txt`,
          'application/json',
        );
        console.log('created file', dirInfo);
        const response = await device.sendData(
          'domain-name',
          JSON.stringify({type: 'domain_request'}),
        );

        const writeRes =
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            dirInfo,
            response,
            {encoding: 'utf8'},
          );
        console.log('what?', writeRes);
      }
      const readRes = await FileSystem.StorageAccessFramework.readAsStringAsync(
        fileA,
      );
      console.log('what is in the file?', readRes);
      return readRes;
    }
  } catch (err) {
    console.log('error', err);
  }
}

async function checkAndAssignDomainFromFiles(data: string, device: ESPDevice) {
  const result = await JSON.parse(data);
  console.log('Filed data:', result);
  const res = await device?.sendData(
    'domain-name',
    JSON.stringify({
      type: 'domain_assignment',
      domain_name: result.domain_name,
    }),
  );
  console.log(`Domain assigned as ${result.domain_name}:`, res);
  await request_Permissions(device, result.mac_address, true);
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

export async function setDev1(res: string) {
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

//DUMP

// async function handleDomainAssignment(device: ESPDevice, res1: any) {
//   await checkCache(res1.mac_address);

//   switch (res1.domain_name) {
//     case '':
//       console.log('Checking cache and files...');
//       const cachedData = await checkCache(res1.mac_address);

//       if (cachedData) {
//         await checkAndAssignDomain(device, cachedData.domain_name);
//         await updateFileWithData(res1.mac_address, cachedData.domain_name);
//       } else {
//         const fileData = await getFileData(res1.mac_address);

//         if (fileData) {
//           await checkAndAssignDomain(device, fileData.domain_name);
//           await updateCacheWithData(fileData);
//         } else {
//           await checkAndAssignDomain(device, 'timesp1');
//           await updateCacheWithData({ mac_address: res1.mac_address, domain_name: 'timesp1' });
//         }
//       }
//       break;

//     default:
//       console.log('Domain received from device:', res1.domain_name);
//       await checkAndAssignDomain(device, res1.domain_name);
//       await updateCacheWithData({ mac_address: res1.mac_address, domain_name: res1.domain_name });
//       await updateFileWithData(res1.mac_address, res1.domain_name);
//       break;
//   }
// }
