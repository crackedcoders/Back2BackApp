import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Card } from './Card';
import { useGymLocations } from '../hooks/useGymLocations';

type PrimaryGymCardProps = {
  onPress?: () => void;
};

export const PrimaryGymCard: React.FC<PrimaryGymCardProps> = ({ onPress }) => {
  const { getPrimaryLocation, loading } = useGymLocations();
  const primaryLocation = getPrimaryLocation();

  if (loading) {
    return (
      <Card style={styles.container}>
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading gym location...</Text>
        </View>
      </Card>
    );
  }

  if (!primaryLocation) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Card style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name="map-pin" size={20} color={theme.colors.accentRed} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>No Home Gym Selected</Text>
              <Text style={styles.subtitle}>Tap to select your primary location</Text>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.coolGrey} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="map-pin" size={20} color={theme.colors.accentRed} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{primaryLocation.name}</Text>
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>PRIMARY</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>{primaryLocation.city}</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.coolGrey} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingState: {
    paddingVertical: theme.spacing.md,
  },
  loadingText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    textAlign: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.accentRed}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
    fontWeight: '600',
  },
  subtitle: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginTop: 2,
  },
  primaryBadge: {
    backgroundColor: theme.colors.accentRed,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  primaryBadgeText: {
    ...theme.typography.body.small,
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 9,
  },
});