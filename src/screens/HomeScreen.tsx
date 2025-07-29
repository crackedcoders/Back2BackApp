import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';
import { Card, IconButton } from '../components';
import { TabParamList } from '../navigation/types';

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleDoorUnlock = () => {
    navigation.navigate('Door');
  };

  const handleClassPress = () => {
    navigation.navigate('Classes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Home</Text>
        
        {/* Streak Card */}
        <Card style={styles.streakCard}>
          <View style={styles.streakContent}>
            <View style={styles.flameContainer}>
              <Icon name="zap" size={32} color={theme.colors.accentRed} />
            </View>
            <View style={styles.streakTextContainer}>
              <Text style={styles.streakNumber}>8-day</Text>
              <Text style={styles.streakLabel}>streak</Text>
            </View>
          </View>
        </Card>
        
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
  header: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  streakCard: {
    marginBottom: theme.spacing.xl,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakNumber: {
    ...theme.typography.heading.h2,
    color: theme.colors.white,
  },
  streakLabel: {
    ...theme.typography.body.regular,
    color: theme.colors.text.secondary,
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