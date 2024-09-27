import React, {useEffect, useState} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import RootNav from '../../navigation';
import {MyCanvas} from '../../components';
import {SplashIcon} from '../../assets';

export default function Splash() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Define animation values
  const logoScale = new Animated.Value(0); // Starting scale (0 = invisible)
  const logoTranslateX = new Animated.Value(0); // Initial X position
  const logoTranslateY = new Animated.Value(0); // Initial Y position
  const logoOpacity = new Animated.Value(1);

  useEffect(() => {
    RNBootSplash.hide();
  }, []);
  const animateLogo = () => {
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.25, // Scale to full size
        duration: 2000, // Zoom duration (2 seconds)
        easing: Easing.elastic(0.5), // Bouncy easing for zoom
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 0.35, // Scale back to original size
        duration: 2000, // Zoom back duration (2 seconds)
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(logoTranslateX, {
          toValue: -320, // Move to left (adjust value for desired position)
          duration: 3000, // Flying duration (3 seconds)
          easing: Easing.out(Easing.ease), // Smooth ease out for flying
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: -900, // Move slightly up (adjust value for desired position)
          duration: 3000, // Flying duration (3 seconds)
          easing: Easing.out(Easing.ease), // Smooth ease out for flying
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0.3, // Fade to transparent
          duration: 3000, // Fade duration (3 seconds)
          easing: Easing.out(Easing.ease), // Smooth ease out for fading
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Animation finished, navigate after a delay
      setTimeout(() => {
        setAppIsReady(true);
      }, 1000); // Delay navigation after animation (1 second)
    });
  };

  useEffect(() => {
    animateLogo();
    // todo: Cache data
    RNBootSplash.hide(); // Hide splash screen after animation
  }, []);

  return appIsReady ? (
    <RootNav />
  ) : (
    <MyCanvas>
      <View style={styles.main}>
        <Animated.Image
          source={SplashIcon}
          style={{
            transform: [
              {scale: logoScale},
              {translateX: logoTranslateX},
              {translateY: logoTranslateY},
            ],
            opacity: logoOpacity,
          }}
        />
      </View>
    </MyCanvas>
  );
}

const styles = StyleSheet.create({
  main: {alignItems: 'center', justifyContent: 'center', flex: 1},
});
