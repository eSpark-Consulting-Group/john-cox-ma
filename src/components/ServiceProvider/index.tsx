import {createContext, useContext, useEffect, useState} from 'react';
import Zeroconf, {Service} from 'react-native-zeroconf';

const initialState = {
  resolvedService1: {} as Service | null,
  resolvedService2: {} as Service | null,
};

const ServiceContext = createContext(initialState);
export const useService = () => useContext(ServiceContext);
const zeroconf = new Zeroconf();
const ServiceProvider = ({children}: {children: React.ReactNode}) => {
  const [resolvedService1, setResolvedService1] = useState<Service | null>(
    null,
  );
  const [resolvedService2, setResolvedService2] = useState<Service | null>(
    null,
  );
  useEffect(() => {
    const onStart = () => {
      console.log('Zeroconf scan started.');
    };

    const onFound = (serviceName: string) => {
      console.log('Service found:', serviceName);
    };

    const onResolved = (service: Service) => {
      console.log('Service resolved:', service);
      // Check if this is the service we are looking for
      if (
        service.name === 'timesp1' &&
        service.addresses.length > 0 &&
        !resolvedService1
      ) {
        setResolvedService1(service);
      } else if (service.name === 'timesp2' && service.addresses.length > 0) {
        console.log('setting resolvedService2:  ');
        setResolvedService2(service);
      }
    };

    const onError = (err: Error) => {
      console.error('Zeroconf error:', err.message);
    };

    zeroconf.on('start', onStart);
    zeroconf.on('found', onFound);
    zeroconf.on('resolved', onResolved);
    zeroconf.on('error', onError);

    // Start scanning
    zeroconf.scan('websocket', 'tcp', 'local.');

    // Cleanup function
    return () => {
      zeroconf.removeListener('start', onStart);
      zeroconf.removeListener('found', onFound);
      zeroconf.removeListener('resolved', onResolved);
      zeroconf.removeListener('error', onError);
      zeroconf.stop();
    };
  }, []);

  return (
    <ServiceContext.Provider value={{resolvedService1, resolvedService2}}>
      {children}
    </ServiceContext.Provider>
  );
};
export default ServiceProvider;
