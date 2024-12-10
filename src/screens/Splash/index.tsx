import React, {useEffect, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Image,
  StatusBar,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import RootNav from '../../navigation';
import {MyCanvas} from '../../components';
import {SplashIcon} from '../../assets';
import {screenHeight, screenWidth} from '../../constants';

export default function Splash() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Define animation values
  const logoScale = new Animated.Value(0); // Starting scale (0 = invisible)
  const logoTranslateX = new Animated.Value(0); // Initial X position
  const logoTranslateY = new Animated.Value(0); // Initial Y position
  const logoOpacity = new Animated.Value(1);

  useEffect(() => {
    RNBootSplash.hide();
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    console.log('-screenWidth / 1 + 20', StatusBar?.currentHeight);
  }, []);

  const animateLogo = () => {
    const targetTranslateX = -screenWidth / 2 + 60; // Move to the left edge
    const targetTranslateY =
      StatusBar?.currentHeight && StatusBar?.currentHeight > 24
        ? -screenHeight / 2 + 50 - Math.ceil(StatusBar?.currentHeight) / 2
        : -screenHeight / 2 + 50; // Move to the top edge

    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 2.25, // Scale to full size
        duration: 2000, // Zoom duration (2 seconds)
        easing: Easing.elastic(0.5), // Bouncy easing for zoom
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1, // Scale back to original size
        duration: 2000, // Zoom back duration (2 seconds)
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(logoTranslateX, {
          toValue: targetTranslateX, // Move to left (adjust value for desired position)
          duration: 3000, // Flying duration (3 seconds)
          easing: Easing.out(Easing.ease), // Smooth ease out for flying
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: targetTranslateY, // Move slightly up (adjust value for desired position)
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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
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
        <Animated.View
          style={{
            transform: [
              {scale: logoScale},
              {translateX: logoTranslateX},
              {translateY: logoTranslateY},
            ],
            opacity: logoOpacity,
          }}>
          <Image
            source={SplashIcon}
            style={{
              // left: -(77 / 2) + 18 + 30,
              width: 77,
              height: 62,
            }}
          />
        </Animated.View>
        {/* <Animated.Image
          source={SplashIcon}
          style={{
            transform: [
              {scale: logoScale},
              {translateX: logoTranslateX},
              {translateY: logoTranslateY},
            ],
            opacity: logoOpacity,
          }}
        /> */}
      </View>
    </MyCanvas>
  );
}

const styles = StyleSheet.create({
  main: {alignItems: 'center', justifyContent: 'center', flex: 1},
});
