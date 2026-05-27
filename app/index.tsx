import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function SplashScreen() {
  const router = useRouter();

  const iconScale = useRef(new Animated.Value(0.25)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(28)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;
  const barScaleX = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  function navigate() {
    const { isAuthenticated } = useAuthStore.getState();
    router.replace(isAuthenticated ? '/(tabs)' : '/(auth)/login');
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(iconOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, stiffness: 160, damping: 10, mass: 0.8, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(380),
        Animated.parallel([
          Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(textY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(750),
        Animated.parallel([
          Animated.timing(barOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.spring(barScaleX, { toValue: 1, stiffness: 140, damping: 14, useNativeDriver: true }),
        ]),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(2100),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 420,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) navigate();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.View
        style={[styles.iconWrap, { opacity: iconOpacity, transform: [{ scale: iconScale }] }]}
      >
        <Image
          source={require('../assets/images/logo-icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[styles.textWrap, { opacity: textOpacity, transform: [{ translateY: textY }] }]}
      >
        <Image
          source={require('../assets/images/logo-text.png')}
          style={styles.logoText}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[styles.tealBar, { opacity: barOpacity, transform: [{ scaleX: barScaleX }] }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1629',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginBottom: 18,
  },
  icon: {
    width: 120,
    height: 138,
  },
  textWrap: {},
  logoText: {
    width: 172,
    height: 52,
  },
  tealBar: {
    width: 48,
    height: 3,
    backgroundColor: '#00E3C2',
    borderRadius: 2,
    marginTop: 22,
  },
});
