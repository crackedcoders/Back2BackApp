import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

export const DoorScreen = () => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [doorOpened, setDoorOpened] = useState(false);
  
  // Animation values
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successTranslateY = useRef(new Animated.Value(10)).current;

  const handleUnlock = () => {
    if (isUnlocking || doorOpened) return;

    setIsUnlocking(true);

    // Ripple animation
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 3,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rippleOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Glow pulse animation
    Animated.sequence([
      Animated.timing(glowOpacity, {
        toValue: 0.6,
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Icon rotation animation (keyhole opening)
    Animated.timing(iconRotation, {
      toValue: 1,
      duration: 250,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Simulate door unlock after animations
    setTimeout(() => {
      setDoorOpened(true);
      
      // Success message animation
      Animated.parallel([
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(successTranslateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Reset after 2 seconds
      setTimeout(() => {
        resetAnimations();
      }, 2000);
    }, 600);
  };

  const resetAnimations = () => {
    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsUnlocking(false);
      setDoorOpened(false);
      successTranslateY.setValue(10);
      rippleScale.setValue(0);
      rippleOpacity.setValue(0);
      glowOpacity.setValue(0);
    });
  };

  const iconRotateStyle = {
    transform: [
      {
        rotate: iconRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Instructions */}
        <Text style={styles.instructions}>
          Face door reader and tap Unlock
        </Text>
        
        {/* Unlock Button Container */}
        <View style={styles.buttonWrapper}>
          {/* Success Message */}
          <Animated.View
            style={[
              styles.successMessage,
              {
                opacity: successOpacity,
                transform: [{ translateY: successTranslateY }],
              },
            ]}
            pointerEvents="none"
          >
            <Text style={styles.successText}>Door Opened</Text>
          </Animated.View>
          
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
              },
            ]}
          />
          
          {/* Ripple Effect */}
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [{ scale: rippleScale }],
                opacity: rippleOpacity,
              },
            ]}
          />
          
          {/* Unlock Button */}
          <TouchableOpacity
            onPress={handleUnlock}
            activeOpacity={0.9}
            disabled={isUnlocking}
            style={styles.buttonTouchable}
          >
            <View style={styles.unlockButton}>
              <Animated.View style={iconRotateStyle}>
                <Icon
                  name={doorOpened ? 'unlock' : 'lock'}
                  size={36}
                  color={theme.colors.white}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Status Text */}
        <Text style={styles.statusText}>
          {isUnlocking && !doorOpened
            ? 'Unlocking...'
            : doorOpened
            ? 'Access Granted'
            : 'Ready to unlock'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    textAlign: 'center',
    position: 'absolute',
    top: theme.spacing.xxxl * 2,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  buttonTouchable: {
    zIndex: 2,
  },
  unlockButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  ripple: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.accentRed,
    zIndex: 0,
  },
  glowEffect: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.colors.accentRed,
    zIndex: -1,
  },
  successMessage: {
    position: 'absolute',
    top: -80,
    alignItems: 'center',
  },
  successText: {
    ...theme.typography.heading.h2,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  statusText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    textAlign: 'center',
    position: 'absolute',
    bottom: theme.spacing.xxxl * 4,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
  },
});