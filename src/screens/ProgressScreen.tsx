import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

// Mock data for the chart
const chartData = [
  { day: 'Mon', visits: 1 },
  { day: 'Tue', visits: 0 },
  { day: 'Wed', visits: 1 },
  { day: 'Thu', visits: 1 },
  { day: 'Fri', visits: 0 },
  { day: 'Sat', visits: 1 },
  { day: 'Sun', visits: 1 },
];

const personalRecords = [
  { title: 'Longest Streak', value: '32 days', icon: 'trending-up' },
  { title: 'Total Visits', value: '156', icon: 'activity' },
  { title: 'Best Month', value: 'March 2024', icon: 'award' },
  { title: 'Weekly Average', value: '4.5 days', icon: 'bar-chart-2' },
];

export const ProgressScreen = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const currentStreak = 7;
  const weeklyGoal = 5;

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = width - theme.spacing.xl * 2;
  const maxValue = Math.max(...chartData.map(d => d.visits));
  const xStep = chartWidth / (chartData.length - 1);

  // Create path for line chart
  const linePath = chartData
    .map((point, index) => {
      const x = index * xStep;
      const y = chartHeight - (point.visits / (maxValue || 1)) * (chartHeight - 40);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Calculate streak gauge angle
  const streakPercentage = (currentStreak / weeklyGoal) * 100;
  const streakAngle = (streakPercentage / 100) * 270; // 270 degrees for 3/4 circle

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Keep up the great work!</Text>
        </View>

        {/* Streak Gauge */}
        <View style={styles.streakContainer}>
          <Svg width={180} height={180} viewBox="0 0 180 180">
            {/* Background arc */}
            <Path
              d="M 30 150 A 60 60 0 1 1 150 150"
              fill="none"
              stroke={theme.colors.charcoal}
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <Path
              d={`M 30 150 A 60 60 0 ${streakAngle > 180 ? 1 : 0} 1 ${
                90 + 60 * Math.cos((Math.PI * (270 - streakAngle)) / 180)
              } ${
                90 - 60 * Math.sin((Math.PI * (270 - streakAngle)) / 180)
              }`}
              fill="none"
              stroke={theme.colors.accentRed}
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Center text */}
            <SvgText
              x="90"
              y="85"
              fontSize="36"
              fontWeight="bold"
              fill={theme.colors.white}
              textAnchor="middle"
            >
              {currentStreak}
            </SvgText>
            <SvgText
              x="90"
              y="110"
              fontSize="14"
              fill={theme.colors.coolGrey}
              textAnchor="middle"
            >
              day streak
            </SvgText>
          </Svg>
          <Text style={styles.streakGoal}>Goal: {weeklyGoal} days/week</Text>
        </View>

        {/* Time Range Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              timeRange === 'week' && styles.toggleButtonActive,
            ]}
            onPress={() => setTimeRange('week')}
          >
            <Text
              style={[
                styles.toggleText,
                timeRange === 'week' && styles.toggleTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              timeRange === 'month' && styles.toggleButtonActive,
            ]}
            onPress={() => setTimeRange('month')}
          >
            <Text
              style={[
                styles.toggleText,
                timeRange === 'month' && styles.toggleTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Line Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Gym Visits</Text>
          <View style={styles.chart}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Grid lines */}
              {[0, 1].map(i => (
                <Path
                  key={i}
                  d={`M 0 ${i === 0 ? 40 : chartHeight - 20} L ${chartWidth} ${
                    i === 0 ? 40 : chartHeight - 20
                  }`}
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
              {chartData.map((point, index) => {
                const x = index * xStep;
                const y = chartHeight - (point.visits / (maxValue || 1)) * (chartHeight - 40);
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
              {chartData.map((point, index) => (
                <SvgText
                  key={index}
                  x={index * xStep}
                  y={chartHeight + 5}
                  fontSize="12"
                  fill={theme.colors.coolGrey}
                  textAnchor="middle"
                >
                  {point.day}
                </SvgText>
              ))}
            </Svg>
          </View>
        </View>

        {/* Personal Records */}
        <View style={styles.recordsContainer}>
          <Text style={styles.recordsTitle}>Personal Records</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recordsScroll}
          >
            {personalRecords.map((record, index) => (
              <View key={index} style={styles.recordCard}>
                <Icon name={record.icon} size={24} color={theme.colors.accentRed} />
                <Text style={styles.recordValue}>{record.value}</Text>
                <Text style={styles.recordLabel}>{record.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  streakGoal: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginTop: theme.spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.accentRed,
  },
  toggleText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: theme.colors.white,
  },
  chartContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  chartTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  chart: {
    height: 250,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  recordsContainer: {
    paddingLeft: theme.spacing.xl,
  },
  recordsTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  recordsScroll: {
    paddingRight: theme.spacing.xl,
  },
  recordCard: {
    width: 140,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginRight: theme.spacing.md,
    alignItems: 'center',
  },
  recordValue: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  recordLabel: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    textAlign: 'center',
  },
});