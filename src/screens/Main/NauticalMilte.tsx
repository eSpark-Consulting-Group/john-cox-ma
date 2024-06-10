import {useEffect, useRef, useState} from 'react';
import {MyBox} from '../../components';
import {useSocket} from '../../components/SocketProvider';

const NauticalMile = () => {
  const {getTimerValue, provision, speed} = useSocket();
  const [time, setTime] = useState(0);
  // console.log((+speed * time) / 60, new Date());
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

  return (
    <MyBox
      text="Gallons per Nautical mile"
      value={(+speed * time) / 60}
      width={'70%'}
    />
  );
};
export default NauticalMile;
