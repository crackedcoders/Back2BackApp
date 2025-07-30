import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';

// Mock data for classes - in a real app this would come from an API
const classesData: { [key: string]: any } = {
  '1': {
    title: 'Power Lift',
    instructor: 'Mike Chen',
    duration: '60 min',
    level: 'Advanced',
    capacity: '15 spots',
    spotsLeft: 3,
    time: '7:00 PM',
    date: 'Today, March 28',
    description: 'Focus on compound movements and progressive overload. Build raw strength with squats, deadlifts, and bench press. Perfect for those looking to increase their max lifts.',
    equipment: ['Barbell', 'Weight Plates', 'Power Rack'],
    benefits: [
      'Increases muscle strength',
      'Builds bone density',
      'Improves posture',
      'Enhances athletic performance',
    ],
  },
  '2': {
    title: 'HIIT Circuit',
    instructor: 'Sarah Johnson',
    duration: '45 min',
    level: 'Intermediate',
    capacity: '20 spots',
    spotsLeft: 8,
    time: '8:00 PM',
    date: 'Today, March 28',
    description: 'High-intensity interval training that combines cardio and strength exercises. Perfect for building endurance and burning calories. All fitness levels welcome with modifications provided.',
    equipment: ['Dumbbells', 'Resistance Bands', 'Mat'],
    benefits: [
      'Improves cardiovascular fitness',
      'Burns calories efficiently',
      'Builds lean muscle',
      'Boosts metabolism',
    ],
  },
  '3': {
    title: 'Yoga Flow',
    instructor: 'Emma Davis',
    duration: '75 min',
    level: 'All Levels',
    capacity: '12 spots',
    spotsLeft: 5,
    time: '9:00 AM',
    date: 'Today, March 28',
    description: 'A dynamic vinyasa flow linking breath with movement. Build flexibility, balance, and mental clarity through mindful sequences. Suitable for all experience levels.',
    equipment: ['Yoga Mat', 'Blocks', 'Strap'],
    benefits: [
      'Increases flexibility',
      'Reduces stress and anxiety',
      'Improves balance',
      'Enhances mind-body connection',
    ],
  },
  '4': {
    title: 'CrossFit',
    instructor: 'John Smith',
    duration: '60 min',
    level: 'Intermediate',
    capacity: '15 spots',
    spotsLeft: 2,
    time: '6:00 AM',
    date: 'Today, March 28',
    description: 'Constantly varied functional movements performed at high intensity. Combines weightlifting, gymnastics, and cardio for a complete workout.',
    equipment: ['Barbell', 'Kettlebell', 'Pull-up Bar', 'Box'],
    benefits: [
      'Full-body conditioning',
      'Improves functional fitness',
      'Builds community',
      'Enhances work capacity',
    ],
  },
  '5': {
    title: 'Spin Class',
    instructor: 'Lisa Wang',
    duration: '45 min',
    level: 'All Levels',
    capacity: '25 spots',
    spotsLeft: 10,
    time: '5:30 PM',
    date: 'Today, March 28',
    description: 'High-energy indoor cycling class set to motivating music. Burn calories and build endurance while having fun. All fitness levels welcome.',
    equipment: ['Spin Bike', 'Water Bottle', 'Towel'],
    benefits: [
      'Low-impact cardio',
      'Strengthens legs and core',
      'Burns major calories',
      'Improves mental health',
    ],
  },
};

export const ClassDetailScreen = ({ navigation, route }: any) => {
  const { classId } = route.params || {};
  const classData = classesData[classId] || classesData['2']; // Default to HIIT if no ID
  const handleBook = () => {
    console.log('Book class');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon={<Icon name="arrow-left" size={24} color={theme.colors.white} />}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Class Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Class Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={48} color={theme.colors.coolGrey} />
          </View>
        </View>

        {/* Class Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{classData.title}</Text>
          
          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="user" size={16} color={theme.colors.coolGrey} />
              <Text style={styles.metaText}>{classData.instructor}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="clock" size={16} color={theme.colors.coolGrey} />
              <Text style={styles.metaText}>{classData.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="trending-up" size={16} color={theme.colors.coolGrey} />
              <Text style={styles.metaText}>{classData.level}</Text>
            </View>
          </View>

          {/* Schedule Info */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleRow}>
              <Icon name="calendar" size={20} color={theme.colors.accentRed} />
              <Text style={styles.scheduleText}>{classData.date}</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Icon name="clock" size={20} color={theme.colors.accentRed} />
              <Text style={styles.scheduleText}>{classData.time}</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Icon name="users" size={20} color={theme.colors.accentRed} />
              <Text style={styles.scheduleText}>
                {classData.spotsLeft} spots left ({classData.capacity})
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Class</Text>
            <Text style={styles.description}>{classData.description}</Text>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment Needed</Text>
            <View style={styles.tagContainer}>
              {classData.equipment.map((item, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {classData.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Icon name="check-circle" size={16} color={theme.colors.accentRed} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Book This Class"
          onPress={handleBook}
          style={styles.bookButton}
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.charcoal,
  },
  headerTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xl,
  },
  metaText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.xs,
  },
  scheduleCard: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scheduleText: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
    marginLeft: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tagText: {
    ...theme.typography.body.small,
    color: theme.colors.white,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  benefitText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.charcoal,
  },
  bookButton: {
    width: '100%',
  },
});