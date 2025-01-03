import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { requestDirectoryPermission } from './permissions';

interface CacheItem {
  domain_name?: string;
  [key: string]: any;
}

export async function checkCompleteCacheForDomainRepetition(
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

export async function checkFileForDomainRepetition() {
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

export async function updateCacheDomain(device: ESPDevice) {
  const res = await device.sendData(
    'domain-name',
    JSON.stringify({type: 'domain_request'}),
  );
  await setDev1(res!);
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

export async function checkCompleteCacheForDomain(domainName: string) {
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