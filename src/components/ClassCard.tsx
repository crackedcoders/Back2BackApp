import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';

// Props interface for the ClassCard component
interface ClassCardProps {
  classId: string;
  title: string;
  dateTime: Date | string;
  instructorName: string;
  instructorAvatarUrl?: string;
  spotsLeft: number;
  capacity: number;
  location: string;
  onCancel?: () => void;
  onViewMap?: () => void;
}

// Helper function to format date and time
const formatDateTime = (dateTime: Date | string): { date: string; time: string } => {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  
  // Format date as "Today", "Tomorrow", or "Mon, Jan 15"
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let dateStr: string;
  if (date.toDateString() === today.toDateString()) {
    dateStr = 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    dateStr = 'Tomorrow';
  } else {
    dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Format time as "7:00 PM"
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
  
  return { date: dateStr, time: timeStr };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const ClassCard: React.FC<ClassCardProps> = ({
  classId,
  title,
  dateTime,
  instructorName,
  instructorAvatarUrl,
  spotsLeft,
  capacity,
  location,
  onCancel,
  onViewMap,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const { date, time } = formatDateTime(dateTime);
  const percentageFull = ((capacity - spotsLeft) / capacity) * 100;
  const isAlmostFull = spotsLeft <= 3;
  
  // Handle card press - navigate to class detail
  const handlePress = () => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to class detail screen
    navigation.navigate('ClassDetail', { classId });
  };
  
  // Handle long press - show quick actions
  const handleLongPress = () => {
    if (Platform.OS === 'ios') {
      // iOS: Use native ActionSheet
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Cancel Class', 'View Map Location'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            Alert.alert(
              'Cancel Class',
              `Are you sure you want to cancel ${title}?`,
              [
                { text: 'No', style: 'cancel' },
                { 
                  text: 'Yes, Cancel', 
                  style: 'destructive',
                  onPress: onCancel 
                },
              ]
            );
          } else if (buttonIndex === 2) {
            onViewMap?.();
          }
        }
      );
    } else {
      // Android: Use Alert with options
      Alert.alert(
        'Quick Actions',
        `${title} - ${time}`,
        [
          { text: 'Close', style: 'cancel' },
          { 
            text: 'Cancel Class', 
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Cancel Class',
                `Are you sure you want to cancel ${title}?`,
                [
                  { text: 'No', style: 'cancel' },
                  { 
                    text: 'Yes, Cancel', 
                    style: 'destructive',
                    onPress: onCancel 
                  },
                ]
              );
            }
          },
          { text: 'View Map Location', onPress: onViewMap },
        ]
      );
    }
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        <View style={styles.card}>
          {/* Main content */}
          <View style={styles.content}>
            {/* Header section with title and time aligned */}
            <View style={styles.headerSection}>
              <View style={styles.leftSection}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {/* Info directly under title */}
                <View style={styles.infoColumn}>
                  <View style={styles.infoRow}>
                    <Icon name="user" size={16} color={theme.colors.accentRed} />
                    <Text style={styles.infoText}>{instructorName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="map-pin" size={16} color={theme.colors.accentRed} />
                    <Text style={styles.infoText}>{location}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.timeContainer}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.time}>{time}</Text>
              </View>
            </View>
            
            {/* Bottom row - Progress and Spots */}
            <View style={styles.bottomRow}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${percentageFull}%` },
                      isAlmostFull && styles.progressFillAlmostFull
                    ]} 
                  />
                </View>
              </View>
              <Text style={[
                styles.spotsText,
                isAlmostFull && styles.spotsTextUrgent
              ]}>
                {spotsLeft} spots left
              </Text>
            </View>
          </View>
          
          {/* Arrow indicator */}
          <View style={styles.arrowContainer}>
            <Icon name="chevron-right" size={20} color={theme.colors.coolGrey} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 90,
    // Clean shadow
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs, // Reduced overall gap between sections
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  leftSection: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading.h3,
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs, // Small gap before info
  },
  infoColumn: {
    gap: 2, // Very tight gap between instructor and location
  },
  timeContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-start', // Align with title baseline
  },
  date: {
    ...theme.typography.body.small,
    fontSize: 12,
    color: theme.colors.coolGrey,
    marginBottom: 2,
  },
  time: {
    ...theme.typography.body.medium,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
  },
  infoText: {
    ...theme.typography.body.small,
    fontSize: 14,
    color: theme.colors.coolGrey,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingRight: theme.spacing.xs, // Add small padding to prevent overflow
  },
  progressContainer: {
    flex: 1,
    maxWidth: '70%', // Constrain progress bar width
  },
  progressBar: {
    height: 4,
    backgroundColor: `${theme.colors.white}15`,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%', // Ensure it stays within container
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accentRed,
    borderRadius: 2,
  },
  progressFillAlmostFull: {
    backgroundColor: '#FF8C00',
  },
  spotsText: {
    ...theme.typography.body.small,
    fontSize: 13,
    color: theme.colors.coolGrey,
    fontWeight: '500',
    minWidth: 80,
    textAlign: 'right',
  },
  spotsTextUrgent: {
    color: '#FF8C00',
    fontWeight: '600',
  },
  arrowContainer: {
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
});