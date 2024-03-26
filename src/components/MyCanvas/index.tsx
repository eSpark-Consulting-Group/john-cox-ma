import React, {memo} from 'react';
import {ImageBackground} from 'react-native';

function MyCanvas({children}: {children: React.ReactNode}) {
  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assets/vectors/bg-png2x.png')}
      resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

export default memo(MyCanvas);
