import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Card } from '../components';

interface ClassItem {
  id: string;
  title: string;
  time: string;
  coach: string;
  spotsAvailable: number;
  totalSpots: number;
  type: 'burn40' | 'crossfit' | 'burnbarbell';
}

const mockClasses: ClassItem[] = [
  {
    id: '1',
    title: 'Burn40 HIIT',
    time: '7:00 PM',
    coach: 'Mike Chen',
    spotsAvailable: 3,
    totalSpots: 15,
    type: 'burn40',
  },
  {
    id: '2',
    title: 'CrossFit WOD',
    time: '8:00 PM',
    coach: 'Sarah Johnson',
    spotsAvailable: 8,
    totalSpots: 20,
    type: 'crossfit',
  },
  {
    id: '3',
    title: 'BurnBarbell',
    time: '9:00 AM',
    coach: 'Emma Davis',
    spotsAvailable: 5,
    totalSpots: 12,
    type: 'burnbarbell',
  },
  {
    id: '4',
    title: 'CrossFit Fundamentals',
    time: '6:00 AM',
    coach: 'John Smith',
    spotsAvailable: 2,
    totalSpots: 15,
    type: 'crossfit',
  },
  {
    id: '5',
    title: 'Burn40 Cardio',
    time: '5:30 PM',
    coach: 'Lisa Wang',
    spotsAvailable: 10,
    totalSpots: 25,
    type: 'burn40',
  },
];

const weekDays = [
  { id: 'mon', label: 'Mon', date: '25' },
  { id: 'tue', label: 'Tue', date: '26' },
  { id: 'wed', label: 'Wed', date: '27' },
  { id: 'thu', label: 'Thu', date: '28', isToday: true },
  { id: 'fri', label: 'Fri', date: '29' },
  { id: 'sat', label: 'Sat', date: '30' },
  { id: 'sun', label: 'Sun', date: '31' },
];

const filters = [
  { id: 'all', label: 'All', type: null },
  { id: 'burn40', label: 'Burn40', type: 'burn40' },
  { id: 'crossfit', label: 'CrossFit', type: 'crossfit' },
  { id: 'burnbarbell', label: 'BurnBarbell', type: 'burnbarbell' },
];

export const ClassesScreen = ({ navigation }: any) => {
  const [selectedDay, setSelectedDay] = useState('thu');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    React.useCallback(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [])
  );

  const filteredClasses = mockClasses.filter((classItem) => {
    const activeFilter = filters.find((f) => f.id === selectedFilter);
    if (!activeFilter || activeFilter.type === null) return true;
    return classItem.type === activeFilter.type;
  });

  const renderClass = ({ item }: { item: ClassItem }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ClassDetail', { classId: item.id })}
    >
      <Card style={styles.classCard}>
        <View style={styles.classContent}>
          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>{item.title}</Text>
            <Text style={styles.classTime}>{item.time}</Text>
            <View style={styles.coachContainer}>
              <View style={styles.coachAvatar}>
                <Text style={styles.coachInitial}>
                  {item.coach.charAt(0)}
                </Text>
              </View>
              <Text style={styles.coachName}>{item.coach}</Text>
            </View>
          </View>
          <View style={styles.classRight}>
            <View style={styles.spotsBadge}>
              <Text style={styles.spotsText}>
                {item.spotsAvailable} open
              </Text>
            </View>
            <Icon
              name="chevron-right"
              size={20}
              color={theme.colors.coolGrey}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.header}>Classes</Text>

        {/* Weekly Timeline */}
        <View style={styles.weekWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.weekContainer}
            contentContainerStyle={styles.weekContent}
          >
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.id}
                onPress={() => setSelectedDay(day.id)}
                style={[
                  styles.dayPill,
                  selectedDay === day.id && styles.dayPillActive,
                  day.isToday && styles.dayPillToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    selectedDay === day.id && styles.dayLabelActive,
                  ]}
                >
                  {day.label}
                </Text>
                <Text
                  style={[
                    styles.dayDate,
                    selectedDay === day.id && styles.dayDateActive,
                  ]}
                >
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={[
                  styles.filterPill,
                  selectedFilter === filter.id && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.id && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Class List */}
      <FlatList
        ref={flatListRef}
        data={filteredClasses}
        renderItem={renderClass}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  fixedHeader: {
    backgroundColor: theme.colors.black,
    zIndex: 10,
  },
  header: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  weekWrapper: {
    backgroundColor: theme.colors.black,
  },
  weekContainer: {
    height: 80,
  },
  weekContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
  dayPill: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillActive: {
    backgroundColor: theme.colors.accentRed,
  },
  dayPillToday: {
    borderWidth: 2,
    borderColor: theme.colors.accentRed,
  },
  dayLabel: {
    ...theme.typography.caption.regular,
    color: theme.colors.coolGrey,
  },
  dayLabelActive: {
    color: theme.colors.white,
  },
  dayDate: {
    ...theme.typography.body.medium,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
  },
  dayDateActive: {
    color: theme.colors.white,
  },
  filterContainer: {
    backgroundColor: theme.colors.black,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterContent: {
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    marginRight: theme.spacing.sm,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.coolGrey,
    minWidth: 80,
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: theme.colors.accentRed,
    borderColor: theme.colors.accentRed,
  },
  filterText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
  filterTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 100,
  },
  classCard: {
    marginBottom: theme.spacing.md,
  },
  classContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    ...theme.typography.heading.h4,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  classTime: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    marginBottom: theme.spacing.sm,
  },
  coachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.coolGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  coachInitial: {
    ...theme.typography.caption.regular,
    color: theme.colors.white,
  },
  coachName: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
  classRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotsBadge: {
    backgroundColor: theme.colors.accentRed,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xl,
    marginRight: theme.spacing.sm,
  },
  spotsText: {
    ...theme.typography.caption.regular,
    color: theme.colors.white,
  },
});