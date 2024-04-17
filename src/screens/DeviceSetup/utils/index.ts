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

export async function setDev1(res: string) {
  const res_JSON = JSON.parse(res);
  try {
    await AsyncStorage.setItem(res_JSON.mac_address, res);
    console.log('Cache updated with:', res);
  } catch (error) {
    console.error('Error setting cache:', error);
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
  //   updateFiles(device);
}

async function updateCacheDomain(device: ESPDevice) {
  const res = await device.sendData(
    'domain-name',
    JSON.stringify({type: 'domain_request'}),
  );
  await setDev1(res!);
}

// async function updateFiles(device:ESPDevice){
//     const res =
// }
async function handleDomainAssignment(device: ESPDevice, res1: any) {
  await checkCache(res1.mac_address);

  switch (res1.domain_name) {
    case '':
      console.log('Checking cache...');
      const cachedData = await checkCache(res1.mac_address);

      if (cachedData) {
        await checkAndAssignDomain(device, cachedData.domain_name);
      } else {
        await request_Permissions(res1.mac_address);

        await checkAndAssignDomain(device, 'timesp1');
      }

      break;

    case 'timesp1':
    case 'timesp2':
      console.log('domain received from device---', res1.domain_name);
      await checkAndAssignDomain(device, res1.domain_name);
      break;

    default:
      break;
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

export async function request_Permissions(mac_address: string) {
  const res =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  console.log('permission response: ', res);
  if (res.granted) {
    const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      res.directoryUri,
    );
    console.log('existed?', files[0].includes(`${mac_address}.txt`));
    checkFiles(res, files[0], mac_address);
  }
}

async function checkFiles(
  res: FileSystem.FileSystemRequestDirectoryPermissionsResult,
  fileA: string,
  mac_address: string,
) {
  try {
    if (res.granted) {
      if (!fileA.includes(`${mac_address}.txt`)) {
        const dirInfo = await FileSystem.StorageAccessFramework.createFileAsync(
          res.directoryUri,
          `${mac_address}.txt`,
          'text/plain',
        );
        console.log('created file', dirInfo);
        // const info = await
        const writeRes =
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            dirInfo,
            'blue',
            {encoding: 'utf8'},
          );
        console.log('what?', writeRes);
      }
      const readRes = await FileSystem.StorageAccessFramework.readAsStringAsync(
        fileA,
      );
      console.log('bta', readRes);
    }
  } catch (err) {
    console.log('error', err);
  }
}

// function App(): React.JSX.Element {
//     const requestPermissions = async () => {
//       const res =
//         await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//       console.log(res);
//       if (res.granted) {
//         const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
//           res.directoryUri,
//         );
//         console.log('existed?', files[0].includes('ViewA.txt'));
//         check(res, files[0]);
//         // RNApkInstaller.install(files[0]);
//       }
//     };

//     async function check(
//       res: FileSystem.FileSystemRequestDirectoryPermissionsResult,
//       viewA: string,
//     ) {
//       try {
//         if (res.granted) {
//           if (!viewA.includes('ViewA.txt')) {
//             const dirInfo =
//               await FileSystem.StorageAccessFramework.createFileAsync(
//                 res.directoryUri,
//                 'ViewA.txt',
//                 'text/plain',
//               );
//             console.log('created file', dirInfo);
//             const writeRes =
//               await FileSystem.StorageAccessFramework.writeAsStringAsync(
//                 dirInfo,
//                 'blue',
//                 {encoding: 'utf8'},
//               );
//             console.log('what?', writeRes);
//           }
//           const readRes =
//             await FileSystem.StorageAccessFramework.readAsStringAsync(viewA);
//           console.log('bta', readRes);
//         }
//       } catch (err) {
//         console.log('error', err);
//       }
//     }
