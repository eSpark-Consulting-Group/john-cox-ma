import {createContext, useContext, useEffect, useState} from 'react';
import Zeroconf, {Service} from 'react-native-zeroconf';

type ServiceContextType = {
  resolvedService1: Service | null;
  resolvedService2: Service | null;
  serviceFound: {timesp1: boolean; timesp2: boolean};
};

const initialState: ServiceContextType = {
  resolvedService1: null,
  resolvedService2: null,
  serviceFound: {timesp1: false, timesp2: false},
};

const ServiceContext = createContext<ServiceContextType>(initialState);

export function useService(): ServiceContextType;
export function useService(serviceName: 'timesp1'): Service | null;
export function useService(serviceName: 'timesp2'): Service | null;
export function useService(
  serviceName?: 'timesp1' | 'timesp2',
): ServiceContextType | Service | null {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  if (serviceName === 'timesp1') return context.resolvedService1;
  if (serviceName === 'timesp2') return context.resolvedService2;
  return context;
}

const zeroconf = new Zeroconf();

const ServiceProvider = ({children}: {children: React.ReactNode}) => {
  const [resolvedService1, setResolvedService1] = useState<Service | null>(
    null,
  );
  const [resolvedService2, setResolvedService2] = useState<Service | null>(
    null,
  );
  const [serviceFound, setServiceFound] = useState<{
    timesp1: boolean;
    timesp2: boolean;
  }>({timesp1: false, timesp2: false});
  useEffect(() => {
    const onStart = () => {
      console.log('Zeroconf scan started.');
    };

    const onFound = (serviceName: string) => {
      console.log(
        'Service found:+++++++++++++++++++++++++++++++++++++',
        serviceName,
      );
      if (serviceName === 'timesp1') {
        setServiceFound(state => {
          return {...state, timesp1: true};
        });
      }
      if (serviceName === 'timesp2') {
        setServiceFound(state => {
          return {...state, timesp2: true};
        });
      }
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
      }
      if (
        service.name === 'timesp2' &&
        service.addresses.length > 0 &&
        !resolvedService2
      ) {
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

  useEffect(() => {
    console.log('Current resolvedService1:', resolvedService1);
    console.log('Current resolvedService2:', resolvedService2);
  }, [resolvedService1, resolvedService2]);

  return (
    <ServiceContext.Provider
      value={{resolvedService1, resolvedService2, serviceFound}}>
      {children}
    </ServiceContext.Provider>
  );
};
export default ServiceProvider;
