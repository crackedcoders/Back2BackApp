import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';
import { Card, IconButton } from '../components';
import { TabParamList } from '../navigation/types';

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

interface HomeScreenProps {
  userName?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userName }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const iconFillAnimation = useRef(new Animated.Value(0)).current;
  const [showFilledIcon, setShowFilledIcon] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    // First animate the icon fill
    Animated.timing(iconFillAnimation, {
      toValue: 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // After icon animation completes, start pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [iconFillAnimation, pulseAnimation]);

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const handleDoorUnlock = () => {
    navigation.navigate('Door');
  };

  const handleClassPress = () => {
    navigation.navigate('Classes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getTimeBasedGreeting()}, {userName || 'Guest'}</Text>
          <Text style={styles.subGreeting}>Ready to crush your workout?</Text>
        </View>
        
        {/* Streak Card */}
        <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
          <Card style={styles.streakCard}>
            <View style={styles.streakContent}>
              <View style={styles.flameContainer}>
                {/* Soft halo effect */}
                <Animated.View
                  style={[
                    styles.flameHalo,
                    {
                      opacity: iconFillAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.2, 0.3],
                      }),
                    },
                  ]}
                />
                
                {/* White outline fire icon (fades out) */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [1, 0.5, 0],
                    }),
                  }}
                >
                  <MCIcon name="fire" size={44} color={theme.colors.white} />
                </Animated.View>
                
                {/* Tighter gradient with cleaner colors */}
                {/* Lemon yellow core */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation,
                  }}
                >
                  <MCIcon name="fire" size={44} color="#FFF700" />
                </Animated.View>
                
                {/* Orange transition layer */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation.interpolate({
                      inputRange: [0, 0.4, 1],
                      outputRange: [0, 0.85, 0.9],
                    }),
                  }}
                >
                  <MCIcon name="fire" size={44} color="#FF6B00" style={{ transform: [{ scale: 0.9 }] }} />
                </Animated.View>
                
                {/* Crimson outer layer */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0, 0.7, 0.85],
                    }),
                  }}
                >
                  <MCIcon name="fire" size={44} color="#DC143C" style={{ transform: [{ scale: 0.75 }] }} />
                </Animated.View>
              </View>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakText}>8 day streak</Text>
                <Text style={styles.streakSubtext}>Keep it going!</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
        
        {/* Next Class Tile */}
        <TouchableOpacity onPress={handleClassPress} activeOpacity={0.7}>
          <Card style={styles.classCard}>
            <View style={styles.classHeader}>
              <Text style={styles.classTitle}>Next: Power Lift 7 PM</Text>
              <Text style={styles.spotsText}>4 spots left</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View style={styles.progressBar} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionCards}>
            <TouchableOpacity style={styles.actionCard} onPress={handleClassPress}>
              <Icon name="calendar" size={24} color={theme.colors.white} />
              <Text style={styles.actionText}>View Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Progress')}>
              <Icon name="trending-up" size={24} color={theme.colors.white} />
              <Text style={styles.actionText}>Check Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Door Unlock Button */}
      <View style={styles.floatingButtonContainer}>
        <IconButton
          icon={<Icon name="key" size={36} color={theme.colors.white} />}
          size="large"
          onPress={handleDoorUnlock}
          style={styles.floatingButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  greetingSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  greeting: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  subGreeting: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
  },
  streakCard: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.accentRed,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  flameHalo: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF700',
    shadowColor: '#FFF700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  streakTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  streakText: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    fontWeight: 'bold',
    lineHeight: theme.typography.heading.h3.fontSize * 1.2,
  },
  streakSubtext: {
    ...theme.typography.body.small,
    color: theme.colors.white,
    opacity: 0.8,
    lineHeight: theme.typography.body.small.fontSize * 1.4,
    marginTop: 2,
  },
  classCard: {
    marginBottom: theme.spacing.xl,
  },
  classHeader: {
    marginBottom: theme.spacing.md,
  },
  classTitle: {
    ...theme.typography.heading.h4,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  spotsText: {
    ...theme.typography.body.small,
    color: theme.colors.text.secondary,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.accentRed,
    borderRadius: 3,
    width: '60%',
  },
  quickActions: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  actionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  actionText: {
    ...theme.typography.body.small,
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 90,
    right: theme.spacing.lg,
  },
  floatingButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});