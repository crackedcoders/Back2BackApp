import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Type definitions for gym locations
type GymLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  isPrimary: boolean;
};

// Mock API functions - Replace with actual API calls
const api = {
  // Fetch user's available gym locations
  fetchGymLocations: async (): Promise<GymLocation[]> => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API response
    return [
      {
        id: '1',
        name: 'Back2Back Downtown',
        address: '123 Main Street',
        city: 'Los Angeles, CA 90012',
        isPrimary: true,
      },
      {
        id: '2',
        name: 'Back2Back Westside',
        address: '456 Ocean Ave',
        city: 'Santa Monica, CA 90401',
        isPrimary: false,
      },
      {
        id: '3',
        name: 'Back2Back Valley',
        address: '789 Ventura Blvd',
        city: 'Sherman Oaks, CA 91403',
        isPrimary: false,
      },
    ];
  },
  
  // Update user's primary gym location
  updatePrimaryGym: async (locationId: string): Promise<void> => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated primary gym to:', locationId);
  },
};

export const ProfileSettingsScreen = () => {
  const navigation = useNavigation();
  
  // State for gym locations
  const [locations, setLocations] = useState<GymLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [primaryLocationId, setPrimaryLocationId] = useState<string | null>(null);
  
  // State for other settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  // Load gym locations on mount
  useEffect(() => {
    loadGymLocations();
  }, []);

  const loadGymLocations = async () => {
    try {
      setLoading(true);
      const fetchedLocations = await api.fetchGymLocations();
      setLocations(fetchedLocations);
      
      // Find and set the current primary location
      const primary = fetchedLocations.find(loc => loc.isPrimary);
      if (primary) {
        setPrimaryLocationId(primary.id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load gym locations');
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle primary gym selection
  const handleLocationSelect = async (locationId: string) => {
    if (locationId === primaryLocationId || updating) return;
    
    try {
      setUpdating(true);
      
      // Update local state optimistically
      setPrimaryLocationId(locationId);
      setLocations(prevLocations =>
        prevLocations.map(loc => ({
          ...loc,
          isPrimary: loc.id === locationId,
        }))
      );
      
      // Call API to persist the change
      await api.updatePrimaryGym(locationId);
      
      // Show confirmation
      const selectedLocation = locations.find(loc => loc.id === locationId);
      Alert.alert(
        'Home Gym Updated',
        `${selectedLocation?.name} is now your primary location.`
      );
    } catch (error) {
      // Revert on error
      Alert.alert('Error', 'Failed to update gym location');
      loadGymLocations(); // Reload to get correct state
    } finally {
      setUpdating(false);
    }
  };

  // Render a single location item
  const renderLocationItem = (location: GymLocation) => {
    const isSelected = location.id === primaryLocationId;
    
    return (
      <TouchableOpacity
        key={location.id}
        style={[styles.locationItem, isSelected && styles.locationItemSelected]}
        onPress={() => handleLocationSelect(location.id)}
        disabled={updating}
      >
        <View style={styles.locationContent}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationAddress}>{location.address}</Text>
            <Text style={styles.locationCity}>{location.city}</Text>
          </View>
          
          <View style={styles.selectionIndicator}>
            {isSelected ? (
              <View style={styles.selectedCircle}>
                <Icon name="check" size={16} color={theme.colors.white} />
              </View>
            ) : (
              <View style={styles.unselectedCircle} />
            )}
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryBadgeText}>PRIMARY</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Home Gym Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="map-pin" size={20} color={theme.colors.accentRed} />
            <Text style={styles.sectionTitle}>Home Gym Location</Text>
          </View>
          
          <Text style={styles.sectionDescription}>
            Select your primary gym location. This will be used for class bookings and personalized recommendations.
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.accentRed} />
            </View>
          ) : (
            <View style={styles.locationsContainer}>
              {locations.map(renderLocationItem)}
            </View>
          )}
        </View>

        {/* Quick Toggle Section */}
        <Card style={styles.quickToggleCard}>
          <View style={styles.quickToggleHeader}>
            <Icon name="zap" size={20} color={theme.colors.yellow} />
            <Text style={styles.quickToggleTitle}>Quick Location Toggle</Text>
          </View>
          <Text style={styles.quickToggleDescription}>
            Temporarily switch to another location for your next visit
          </Text>
          <View style={styles.toggleButtonsContainer}>
            {locations.slice(0, 2).map((location) => (
              <Button
                key={location.id}
                title={location.name.replace('Back2Back ', '')}
                onPress={() => handleLocationSelect(location.id)}
                variant={location.id === primaryLocationId ? 'filled' : 'outline'}
                style={styles.toggleButton}
                disabled={updating}
              />
            ))}
          </View>
        </Card>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="bell" size={20} color={theme.colors.accentRed} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Class Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified before your scheduled classes
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ 
                false: theme.colors.charcoal, 
                true: `${theme.colors.accentRed}80` 
              }}
              thumbColor={notificationsEnabled ? theme.colors.accentRed : theme.colors.coolGrey}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Marketing Updates</Text>
              <Text style={styles.settingDescription}>
                Receive news about events and promotions
              </Text>
            </View>
            <Switch
              value={marketingEnabled}
              onValueChange={setMarketingEnabled}
              trackColor={{ 
                false: theme.colors.charcoal, 
                true: `${theme.colors.accentRed}80` 
              }}
              thumbColor={marketingEnabled ? theme.colors.accentRed : theme.colors.coolGrey}
            />
          </View>
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
  section: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },
  sectionDescription: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  locationsContainer: {
    gap: theme.spacing.md,
  },
  locationItem: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locationItemSelected: {
    borderColor: theme.colors.accentRed,
    backgroundColor: `${theme.colors.accentRed}10`,
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    ...theme.typography.body.large,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  locationAddress: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginBottom: 2,
  },
  locationCity: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
  selectionIndicator: {
    marginLeft: theme.spacing.md,
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.coolGrey,
  },
  primaryBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.accentRed,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  primaryBadgeText: {
    ...theme.typography.body.small,
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
  quickToggleCard: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    padding: theme.spacing.lg,
  },
  quickToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickToggleTitle: {
    ...theme.typography.body.large,
    color: theme.colors.white,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  quickToggleDescription: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginBottom: theme.spacing.md,
  },
  toggleButtonsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  toggleButton: {
    flex: 1,
    height: 40,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.charcoal,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.lg,
  },
  settingLabel: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
  },
});