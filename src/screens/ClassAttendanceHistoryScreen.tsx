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

// Mock data for class attendance history
const classHistory = [
  {
    id: '1',
    className: 'Burn40',
    instructor: 'Sarah Johnson',
    date: '2025-01-03',
    time: '7:00 AM',
    location: 'Back2Back Downtown',
    duration: '40 min',
    status: 'completed',
  },
  {
    id: '2',
    className: 'CrossFit WOD',
    instructor: 'Mike Chen',
    date: '2025-01-02',
    time: '6:30 AM',
    location: 'Back2Back Downtown',
    duration: '60 min',
    status: 'completed',
  },
  {
    id: '3',
    className: 'Burn40',
    instructor: 'Emma Davis',
    date: '2025-01-01',
    time: '8:00 AM',
    location: 'Back2Back Downtown',
    duration: '40 min',
    status: 'completed',
  },
  {
    id: '4',
    className: 'BurnBarbell',
    instructor: 'Alex Rodriguez',
    date: '2024-12-30',
    time: '7:30 AM',
    location: 'Back2Back Westside',
    duration: '45 min',
    status: 'completed',
  },
  {
    id: '5',
    className: 'Burn40',
    instructor: 'Sarah Johnson',
    date: '2024-12-29',
    time: '7:00 AM',
    location: 'Back2Back Downtown',
    duration: '40 min',
    status: 'no-show',
  },
  {
    id: '6',
    className: 'CrossFit WOD',
    instructor: 'Mike Chen',
    date: '2024-12-28',
    time: '6:30 AM',
    location: 'Back2Back Downtown',
    duration: '60 min',
    status: 'completed',
  },
  {
    id: '7',
    className: 'Burn40',
    instructor: 'Emma Davis',
    date: '2024-12-27',
    time: '8:00 AM',
    location: 'Back2Back Valley',
    duration: '40 min',
    status: 'completed',
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return theme.colors.green;
    case 'no-show':
      return theme.colors.yellow;
    case 'cancelled':
      return theme.colors.accentRed;
    default:
      return theme.colors.coolGrey;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'no-show':
      return 'No Show';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export const ClassAttendanceHistoryScreen = () => {
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
          <Text style={styles.title}>Class History</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Stats Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="award" size={24} color={theme.colors.accentRed} />
            <Text style={styles.summaryTitle}>Classes Attended</Text>
          </View>
          <Text style={styles.summaryValue}>48</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </Card>

        {/* Class Types Summary */}
        <View style={styles.classTypesContainer}>
          <Text style={styles.sectionTitle}>Favorite Classes</Text>
          <View style={styles.classTypesGrid}>
            <Card style={styles.classTypeCard}>
              <Text style={styles.classTypeName} numberOfLines={1} adjustsFontSizeToFit>Burn40</Text>
              <Text style={styles.classTypeCount}>24 classes</Text>
            </Card>
            <Card style={styles.classTypeCard}>
              <Text style={styles.classTypeName} numberOfLines={1} adjustsFontSizeToFit>CrossFit</Text>
              <Text style={styles.classTypeCount}>15 classes</Text>
            </Card>
            <Card style={styles.classTypeCard}>
              <Text style={styles.classTypeName} numberOfLines={1} adjustsFontSizeToFit>BurnBarbell</Text>
              <Text style={styles.classTypeCount}>9 classes</Text>
            </Card>
          </View>
        </View>

        {/* History List */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Classes</Text>
          
          {classHistory.map((classItem) => (
            <Card key={classItem.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{classItem.className}</Text>
                  <Text style={styles.instructorName}>with {classItem.instructor}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(classItem.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(classItem.status) }]}>
                    {getStatusText(classItem.status)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.historyDetails}>
                <View style={styles.dateTimeRow}>
                  <Icon name="calendar" size={16} color={theme.colors.coolGrey} />
                  <Text style={styles.historyDate}>{formatDate(classItem.date)}</Text>
                  <Text style={styles.historyTime}>{classItem.time}</Text>
                </View>
                
                <View style={styles.locationDurationRow}>
                  <View style={styles.locationContainer}>
                    <Icon name="map-pin" size={16} color={theme.colors.coolGrey} />
                    <Text style={styles.historyLocation}>{classItem.location}</Text>
                  </View>
                  <View style={styles.durationContainer}>
                    <Icon name="clock" size={16} color={theme.colors.coolGrey} />
                    <Text style={styles.historyDuration}>{classItem.duration}</Text>
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
    marginBottom: theme.spacing.xl,
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
    fontWeight: '600',
  },
  summaryValue: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    fontSize: 48,
    lineHeight: 56,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.charcoal,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.charcoal,
    marginHorizontal: theme.spacing.lg,
  },
  statValue: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
    fontSize: 22,
    fontWeight: '600',
  },
  statLabel: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  classTypesContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  classTypesGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  classTypeCard: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 70,
  },
  classTypeName: {
    ...theme.typography.body.medium,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    fontSize: 15,
  },
  classTypeCount: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
  historyContainer: {
    paddingHorizontal: theme.spacing.xl,
  },
  historyItem: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    ...theme.typography.body.medium,
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  instructorName: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.md,
  },
  statusText: {
    ...theme.typography.body.small,
    fontSize: 12,
    fontWeight: '600',
  },
  historyDetails: {
    gap: theme.spacing.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDate: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.md,
  },
  historyTime: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
  locationDurationRow: {
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
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDuration: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.xs,
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