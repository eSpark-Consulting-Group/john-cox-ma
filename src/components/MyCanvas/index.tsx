import React, {memo} from 'react';
import {Dimensions, ImageBackground} from 'react-native';

const deviceHeight = Dimensions.get('window').height;

function MyCanvas({children}: {children: React.ReactNode}) {
  return (
    <ImageBackground
      style={{height: deviceHeight, flex: 1}}
      source={require('../../assets/vectors/bg-png2x.png')}
      resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

export default memo(MyCanvas);
