import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import { checkCache, checkCompleteCacheForDomain, checkCompleteCacheForDomainRepetition, checkFileForDomainRepetition, updateCacheDomain } from './cacheOperations';
import { checkFile, updateFile } from './fileSystemOperations';

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

async function checkAndAssignDomain(device: ESPDevice, domainName: string) {
  const res = await device?.sendData(
    'domain-name',
    JSON.stringify({
      type: 'domain_assignment',
      domain_name: domainName,
    }),
  );
  console.log(`Domain assigned as ${domainName}:`, res);
  await updateCacheDomain(device);
}

