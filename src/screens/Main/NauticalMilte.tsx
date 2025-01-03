import {useEffect, useRef, useState} from 'react';

import {MyBox} from '../../components';
import {useSocket} from '../../providers/SocketProvider';
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
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  const calculateConsumption = (speed: string | number, time: number) => {
    const consumptionLPerKm = (Number(speed) * time) / 60;
    return convertConsumption(consumptionLPerKm, volUnit!, distUnit!);
  };

  return (
    <MyBox
      text={`${volUnit} per ${distUnit}`}
      value={
        !isService1Resolved && !isService2Resolved
          ? NaN
          : calculateConsumption(speed, time)
      }
      width="70%"
    />
  );
};
export default NauticalMile;
