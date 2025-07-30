import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Path, Circle, Text as SvgText, Line } from 'react-native-svg';
import { theme } from '../theme';
import { Card } from '../components/Card';

const { width } = Dimensions.get('window');

// Mock data
const workoutHistory = [
  { id: '1', date: 'Dec 28', name: 'Power Lift', duration: '45 min' },
  { id: '2', date: 'Dec 27', name: 'Open Gym', duration: '60 min' },
  { id: '3', date: 'Dec 26', name: 'HIIT Circuit', duration: '30 min' },
  { id: '4', date: 'Dec 24', name: 'CrossFit', duration: '55 min' },
  { id: '5', date: 'Dec 23', name: 'Open Gym', duration: '40 min' },
];

const personalRecords = [
  { name: 'Squat', weight: '315 lbs' },
  { name: 'Deadlift', weight: '405 lbs' },
  { name: 'Bench', weight: '225 lbs' },
  { name: 'Clean', weight: '185 lbs' },
  { name: 'Snatch', weight: '155 lbs' },
  { name: 'Press', weight: '135 lbs' },
];

const bodyStats = [
  { label: 'Weight', value: '185 lbs', icon: 'activity' },
  { label: 'Body Fat', value: '15%', icon: 'percent' },
  { label: 'Muscle Mass', value: '156 lbs', icon: 'trending-up' },
];

const milestones = [
  { label: '100 Visits', achieved: true },
  { label: '10 PRs', achieved: true },
  { label: '7-Day Streak', achieved: false },
];

// Chart data for total weight lifted (last 6 months)
const weightChartData = [
  { month: 'Jul', weight: 12500 },
  { month: 'Aug', weight: 13200 },
  { month: 'Sep', weight: 13800 },
  { month: 'Oct', weight: 14500 },
  { month: 'Nov', weight: 15200 },
  { month: 'Dec', weight: 16000 },
];

export const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'prs' | 'stats' | 'milestones'>('history');
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = width - theme.spacing.xl * 2 - theme.spacing.lg * 2;
  const maxWeight = Math.max(...weightChartData.map(d => d.weight));
  const minWeight = Math.min(...weightChartData.map(d => d.weight));
  const xStep = chartWidth / (weightChartData.length - 1);

  // Create path for line chart
  const linePath = weightChartData
    .map((point, index) => {
      const x = index * xStep;
      const y = chartHeight - ((point.weight - minWeight) / (maxWeight - minWeight)) * (chartHeight - 40);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const renderWorkoutHistory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Workout History</Text>
      {workoutHistory.map((workout) => (
        <View key={workout.id} style={styles.historyItem}>
          <View style={styles.historyLeft}>
            <Text style={styles.historyDate}>{workout.date}</Text>
            <Text style={styles.historyName}>{workout.name}</Text>
          </View>
          <Text style={styles.historyDuration}>{workout.duration}</Text>
        </View>
      ))}
    </View>
  );

  const renderPersonalRecords = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Records</Text>
      <View style={styles.prGrid}>
        {personalRecords.map((pr, index) => (
          <Card key={index} style={styles.prCard}>
            <Text style={styles.prName}>{pr.name}</Text>
            <Text style={styles.prWeight}>{pr.weight}</Text>
          </Card>
        ))}
      </View>
    </View>
  );

  const renderStats = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Weight Lifted</Text>
        <View style={styles.chart}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Grid lines */}
            {[0, 1, 2].map(i => (
              <Line
                key={i}
                x1={0}
                y1={20 + i * 80}
                x2={chartWidth}
                y2={20 + i * 80}
                stroke={theme.colors.charcoal}
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}
            
            {/* Line */}
            <Path
              d={linePath}
              fill="none"
              stroke={theme.colors.accentRed}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Points */}
            {weightChartData.map((point, index) => {
              const x = index * xStep;
              const y = chartHeight - ((point.weight - minWeight) / (maxWeight - minWeight)) * (chartHeight - 40);
              return (
                <Circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="5"
                  fill={theme.colors.white}
                  stroke={theme.colors.accentRed}
                  strokeWidth="2"
                />
              );
            })}
            
            {/* X-axis labels */}
            {weightChartData.map((point, index) => (
              <SvgText
                key={index}
                x={index * xStep}
                y={chartHeight - 5}
                fontSize="12"
                fill={theme.colors.coolGrey}
                textAnchor="middle"
              >
                {point.month}
              </SvgText>
            ))}
          </Svg>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Stats</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {bodyStats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Icon name={stat.icon} size={24} color={theme.colors.accentRed} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </ScrollView>
      </View>
    </>
  );

  const renderMilestones = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Milestones</Text>
      <View style={styles.milestonesContainer}>
        {milestones.map((milestone, index) => (
          <View
            key={index}
            style={[
              styles.milestoneBadge,
              milestone.achieved && styles.milestoneBadgeAchieved,
            ]}
          >
            <Icon
              name={milestone.achieved ? 'check-circle' : 'circle'}
              size={20}
              color={milestone.achieved ? theme.colors.white : theme.colors.coolGrey}
            />
            <Text
              style={[
                styles.milestoneText,
                milestone.achieved && styles.milestoneTextAchieved,
              ]}
            >
              {milestone.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return renderWorkoutHistory();
      case 'prs':
        return renderPersonalRecords();
      case 'stats':
        return renderStats();
      case 'milestones':
        return renderMilestones();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.header}>Progress</Text>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'history' && styles.segmentActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.segmentText, activeTab === 'history' && styles.segmentTextActive]}>
              History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'prs' && styles.segmentActive]}
            onPress={() => setActiveTab('prs')}
          >
            <Text style={[styles.segmentText, activeTab === 'prs' && styles.segmentTextActive]}>
              PRs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'stats' && styles.segmentActive]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.segmentText, activeTab === 'stats' && styles.segmentTextActive]}>
              Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'milestones' && styles.segmentActive]}
            onPress={() => setActiveTab('milestones')}
          >
            <Text style={[styles.segmentText, activeTab === 'milestones' && styles.segmentTextActive]}>
              Milestones
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Content */}
        {renderContent()}
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
    paddingBottom: theme.spacing.xxxl * 2,
  },
  header: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  segmentActive: {
    backgroundColor: theme.colors.accentRed,
  },
  segmentText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: theme.colors.white,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.charcoal,
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginBottom: theme.spacing.xs,
  },
  historyName: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
  },
  historyDuration: {
    ...theme.typography.body.regular,
    color: theme.colors.accentRed,
  },
  prGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  prName: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    marginBottom: theme.spacing.sm,
  },
  prWeight: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  chart: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  statCard: {
    width: 120,
    marginRight: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginVertical: theme.spacing.sm,
  },
  statLabel: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
  milestonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  milestoneBadgeAchieved: {
    backgroundColor: theme.colors.accentRed,
  },
  milestoneText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.sm,
  },
  milestoneTextAchieved: {
    color: theme.colors.white,
  },
});