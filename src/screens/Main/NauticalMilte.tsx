import {useEffect, useRef, useState} from 'react';

import {MyBox} from '../../components';
import {useSocket} from '../../components/SocketProvider';
import {DistanceUnit, VolumeUnit} from '../../types';
import {convertConsumption} from '../FMMSetup/utils';

interface NauticalMileProps {
  volUnit: VolumeUnit;
  distUnit: DistanceUnit;
}

const NauticalMile = ({volUnit, distUnit}: NauticalMileProps) => {
  const {
    getTimerValue,
    provision,
    speed,
    isService1Resolved,
    isService2Resolved,
  } = useSocket();
  const [time, setTime] = useState(0);

  const interval = useRef<NodeJS.Timeout>();
  const startTimer = () => {
    interval.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    setTime(getTimerValue());
  }, [provision.timesp1]);

  useEffect(() => {
    if (isService1Resolved || isService2Resolved) {
      startTimer();
    }
    if (!isService1Resolved && !isService2Resolved) {
      clearInterval(interval.current);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [isService1Resolved, isService2Resolved]);

  const calculateConsumption = (speed: string | number, time: number) => {
    // return (Number(speed) * time) / 60;
    const consumptionLPerKm = (Number(speed) * time) / 60;
    return convertConsumption(consumptionLPerKm, volUnit!, distUnit!);
  };

  return (
    <MyBox
      text={`${volUnit} per ${distUnit}`}
      value={calculateConsumption(speed, time)}
      width="70%"
    />
  );
};
export default NauticalMile;
