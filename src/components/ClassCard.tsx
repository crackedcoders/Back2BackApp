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
          {/* Left side - Instructor avatar or class icon */}
          <View style={styles.avatarContainer}>
            {instructorAvatarUrl ? (
              <Image 
                source={{ uri: instructorAvatarUrl }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="user" size={24} color={theme.colors.white} />
              </View>
            )}
          </View>
          
          {/* Right side - Class info */}
          <View style={styles.contentContainer}>
            {/* Header - Title and time */}
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.date}>{date}</Text>
                  <Text style={styles.time}>{time}</Text>
                </View>
              </View>
            </View>
            
            {/* Sub info - Instructor and location */}
            <View style={styles.subInfo}>
              <View style={styles.infoItem}>
                <Icon name="user" size={12} color={theme.colors.coolGrey} />
                <Text style={styles.infoText}>{instructorName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="map-pin" size={12} color={theme.colors.coolGrey} />
                <Text style={styles.infoText}>{location}</Text>
              </View>
            </View>
            
            {/* Bottom - Progress bar and spots */}
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
              <Text style={[
                styles.spotsText,
                isAlmostFull && styles.spotsTextUrgent
              ]}>
                {spotsLeft} spots left
              </Text>
            </View>
          </View>
          
          {/* Chevron indicator */}
          <View style={styles.chevronContainer}>
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
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    // Shadow for iOS
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
  },
  avatarContainer: {
    marginRight: theme.spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.coolGrey,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${theme.colors.accentRed}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  date: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginBottom: 2,
  },
  time: {
    ...theme.typography.body.large,
    color: theme.colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
  },
  subInfo: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: `${theme.colors.white}10`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accentRed,
    borderRadius: 3,
  },
  progressFillAlmostFull: {
    backgroundColor: theme.colors.yellow,
  },
  spotsText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    minWidth: 70,
    textAlign: 'right',
  },
  spotsTextUrgent: {
    color: theme.colors.yellow,
    fontWeight: '600',
  },
  chevronContainer: {
    marginLeft: theme.spacing.md,
  },
});