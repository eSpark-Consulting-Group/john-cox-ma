import * as FileSystem from 'expo-file-system';
import {ESPDevice} from '@espark-consultants/react-native-esp-idf-provisioning';
import { checkDirectoryPermission } from './permissions';

//readOnly File
export async function checkFile(mac_address: string) {
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
export async function updateFile(
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
