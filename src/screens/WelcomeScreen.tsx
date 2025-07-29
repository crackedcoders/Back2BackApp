import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { Button } from '../components';
import { RootStackParamList } from '../navigation/types';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [name, setName] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const waveAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the red wave
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [waveAnimation]);

  const handleGetStarted = () => {
    if (name && membershipId) {
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };

  const translateY = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Animated Red Wave */}
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [{ translateY }],
              },
            ]}
          />
          
          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Back2Back</Text>
            
            {/* Glass-morphism Card */}
            <View style={styles.glassCard}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.colors.coolGrey}
                  autoCapitalize="words"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Membership ID</Text>
                <TextInput
                  style={styles.input}
                  value={membershipId}
                  onChangeText={setMembershipId}
                  placeholder="Enter your membership ID"
                  placeholderTextColor={theme.colors.coolGrey}
                  autoCapitalize="characters"
                />
              </View>
            </View>
            
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.button}
              disabled={!name || !membershipId}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  wave: {
    position: 'absolute',
    top: -100,
    left: -50,
    right: -50,
    height: height * 0.4,
    backgroundColor: theme.colors.accentRed,
    borderRadius: width,
    opacity: 0.1,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xxxl * 2,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    marginBottom: theme.spacing.xxxl,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.body.medium,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 52,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.white,
    ...theme.typography.body.regular,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.lg,
  },
});