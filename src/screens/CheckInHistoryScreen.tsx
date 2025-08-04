import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Card } from '../components/Card';

// Mock data for check-in history
const checkInHistory = [
  {
    id: '1',
    date: '2025-01-03',
    time: '07:30 AM',
    location: 'Back2Back Downtown',
    duration: '1h 45m',
    type: 'Gym Visit',
  },
  {
    id: '2',
    date: '2025-01-02',
    time: '06:15 AM',
    location: 'Back2Back Downtown',
    duration: '2h 15m',
    type: 'Gym Visit',
  },
  {
    id: '3',
    date: '2025-01-01',
    time: '08:00 AM',
    location: 'Back2Back Downtown',
    duration: '1h 30m',
    type: 'Gym Visit',
  },
  {
    id: '4',
    date: '2024-12-31',
    time: '07:45 AM',
    location: 'Back2Back Westside',
    duration: '2h 00m',
    type: 'Gym Visit',
  },
  {
    id: '5',
    date: '2024-12-30',
    time: '06:30 AM',
    location: 'Back2Back Downtown',
    duration: '1h 20m',
    type: 'Gym Visit',
  },
  {
    id: '6',
    date: '2024-12-29',
    time: '08:15 AM',
    location: 'Back2Back Downtown',
    duration: '1h 55m',
    type: 'Gym Visit',
  },
  {
    id: '7',
    date: '2024-12-28',
    time: '07:00 AM',
    location: 'Back2Back Valley',
    duration: '2h 30m',
    type: 'Gym Visit',
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export const CheckInHistoryScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Check-In History</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Stats Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="activity" size={24} color={theme.colors.accentRed} />
            <Text style={styles.summaryTitle}>Total Visits</Text>
          </View>
          <Text style={styles.summaryValue}>156</Text>
          <Text style={styles.summaryDescription}>
            You've been consistently active! Keep up the great work.
          </Text>
        </Card>

        {/* History List */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {checkInHistory.map((visit) => (
            <Card key={visit.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.historyDate}>{formatDate(visit.date)}</Text>
                </View>
                <View style={styles.checkInTimeContainer}>
                  <Icon name="log-in" size={16} color={theme.colors.accentRed} />
                  <Text style={styles.checkInTime}>{visit.time}</Text>
                </View>
              </View>
              
              <View style={styles.historyDetails}>
                <View style={styles.locationContainer}>
                  <Icon name="map-pin" size={16} color={theme.colors.coolGrey} />
                  <Text style={styles.historyLocation}>{visit.location}</Text>
                </View>
                <View style={styles.typeContainer}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{visit.type}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Load More Button */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More History</Text>
          <Icon name="chevron-down" size={20} color={theme.colors.accentRed} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.heading.h2,
    color: theme.colors.white,
  },
  placeholder: {
    width: 40,
  },
  summaryCard: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    ...theme.typography.body.medium,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
    fontSize: 18,
  },
  summaryValue: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    fontSize: 48,
    lineHeight: 56,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  summaryDescription: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyContainer: {
    paddingHorizontal: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  historyItem: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateTimeContainer: {
    flex: 1,
  },
  historyDate: {
    ...theme.typography.body.medium,
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  checkInTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.accentRed}20`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  checkInTime: {
    ...theme.typography.body.small,
    color: theme.colors.accentRed,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyLocation: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.xs,
  },
  typeContainer: {
    marginLeft: theme.spacing.md,
  },
  typeBadge: {
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  typeText: {
    ...theme.typography.body.small,
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
  },
  loadMoreText: {
    ...theme.typography.body.regular,
    color: theme.colors.accentRed,
    marginRight: theme.spacing.sm,
    fontWeight: '600',
  },
});