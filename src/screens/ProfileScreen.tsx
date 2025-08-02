import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { RootStackParamList } from '../navigation/types';

const stats = [
  { label: 'Total Visits', value: '156', icon: 'activity' },
  { label: 'Current Streak', value: '7 days', icon: 'trending-up' },
  { label: 'Member Since', value: 'Jan 2024', icon: 'calendar' },
  { label: 'Classes Attended', value: '48', icon: 'award' },
];

const menuItems = [
  { title: 'Personal Info', icon: 'user', action: 'personal' },
  { title: 'Membership', icon: 'credit-card', action: 'membership' },
  { title: 'Settings', icon: 'settings', action: 'settings' },
  { title: 'Privacy & Security', icon: 'lock', action: 'privacy' },
  { title: 'Help & Support', icon: 'help-circle', action: 'help' },
  { title: 'Sign Out', icon: 'log-out', action: 'signout', isDestructive: true },
];

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );
  const handleMenuPress = (action: string) => {
    if (action === 'signout') {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Sign out') },
        ],
      );
    } else if (action === 'settings') {
      navigation.navigate('ProfileSettings');
    } else {
      console.log(`Navigate to ${action}`);
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
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Icon name={stat.icon} size={20} color={theme.colors.accentRed} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => handleMenuPress(item.action)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.menuIconContainer,
                  item.isDestructive && styles.menuIconDestructive,
                ]}>
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={item.isDestructive ? theme.colors.accentRed : theme.colors.white} 
                  />
                </View>
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && styles.menuItemTextDestructive,
                ]}>
                  {item.title}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.coolGrey} />
            </TouchableOpacity>
          ))}
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
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    fontSize: 36,
  },
  name: {
    ...theme.typography.heading.h2,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  email: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: theme.spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.charcoal,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    marginTop: theme.spacing.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuIconDestructive: {
    backgroundColor: `${theme.colors.accentRed}20`,
  },
  menuItemText: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
  },
  menuItemTextDestructive: {
    color: theme.colors.accentRed,
  },
});