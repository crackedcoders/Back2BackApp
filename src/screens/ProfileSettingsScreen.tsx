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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Type definitions
type GymLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  isPrimary: boolean;
};

type UserInfo = {
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
};

type MembershipPlan = {
  id: string;
  name: string;
  price: number;
  enrollment: number;
  fromPrice: number;
  features: string[];
  description: string;
};

type TabType = 'gym' | 'personal' | 'membership';

// Mock API functions - Replace with actual API calls
const api = {
  // Fetch user's available gym locations
  fetchGymLocations: async (): Promise<GymLocation[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated primary gym to:', locationId);
  },

  // Fetch user info
  fetchUserInfo: async (): Promise<UserInfo> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '3105551234',
      profilePicture: undefined,
    };
  },

  // Update user info
  updateUserInfo: async (userInfo: UserInfo): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated user info:', userInfo);
  },

  // Fetch membership plans
  fetchMembershipPlans: async (): Promise<MembershipPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: '1',
        name: '24 HR Free Weights',
        price: 69.99,
        enrollment: 50,
        fromPrice: 124.72,
        features: ['unlimited classes', 'program access', 'free weights'],
        description: 'Full access to 24 HR Free Weights and Outdoor GYM',
      },
      {
        id: '2',
        name: '24 HR Free Weights / Burn40',
        price: 119.99,
        enrollment: 100,
        fromPrice: 228.46,
        features: ['unlimited classes', 'program access', 'Burn40', 'free weights', 'BurnBarbell'],
        description: '24 HR access to free weights, unlimited access to Burn40',
      },
      {
        id: '3',
        name: 'CrossFit Included Full Access',
        price: 159.99,
        enrollment: 100,
        fromPrice: 269.95,
        features: ['unlimited classes', 'program access', 'Burn40', 'CrossFit', 'free weights'],
        description: 'CrossFit, Burn30, and 24 HR Free Weights (CrossFit experience required)',
      },
      {
        id: '4',
        name: 'Drop-In',
        price: 0,
        enrollment: 0,
        fromPrice: 20.00,
        features: [],
        description: 'Pay per visit',
      },
    ];
  },

  // Get current membership
  fetchCurrentMembership: async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return '1'; // Returns plan ID
  },

  // Update membership
  updateMembership: async (planId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated membership to plan:', planId);
  },
};

export const ProfileSettingsScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const initialTab = route?.params?.initialTab || 'gym';
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  
  // Home Gym tab state
  const [locations, setLocations] = useState<GymLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [updatingGym, setUpdatingGym] = useState(false);
  const [primaryLocationId, setPrimaryLocationId] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  // Personal Info tab state
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [editedUserInfo, setEditedUserInfo] = useState<UserInfo>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [savingUserInfo, setSavingUserInfo] = useState(false);

  // Membership tab state
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [currentMembershipId, setCurrentMembershipId] = useState<string>('');
  const [selectedMembershipId, setSelectedMembershipId] = useState<string>('');
  const [loadingMembership, setLoadingMembership] = useState(true);
  const [updatingMembership, setUpdatingMembership] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'gym') {
      loadGymLocations();
    } else if (activeTab === 'personal') {
      loadUserInfo();
    } else if (activeTab === 'membership') {
      loadMembershipData();
    }
  }, [activeTab]);

  // Home Gym tab functions
  const loadGymLocations = async () => {
    try {
      setLoadingLocations(true);
      const fetchedLocations = await api.fetchGymLocations();
      setLocations(fetchedLocations);
      
      const primary = fetchedLocations.find(loc => loc.isPrimary);
      if (primary) {
        setPrimaryLocationId(primary.id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load gym locations');
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleLocationSelect = async (locationId: string) => {
    if (locationId === primaryLocationId || updatingGym) return;
    
    try {
      setUpdatingGym(true);
      setPrimaryLocationId(locationId);
      setLocations(prevLocations =>
        prevLocations.map(loc => ({
          ...loc,
          isPrimary: loc.id === locationId,
        }))
      );
      
      await api.updatePrimaryGym(locationId);
      
      const selectedLocation = locations.find(loc => loc.id === locationId);
      Alert.alert(
        'Home Gym Updated',
        `${selectedLocation?.name} is now your primary location.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update gym location');
      loadGymLocations();
    } finally {
      setUpdatingGym(false);
    }
  };

  // Personal Info tab functions
  const loadUserInfo = async () => {
    try {
      setLoadingUserInfo(true);
      const info = await api.fetchUserInfo();
      setUserInfo(info);
      setEditedUserInfo(info);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user information');
    } finally {
      setLoadingUserInfo(false);
    }
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number formatting helper
  const formatPhoneNumber = (text: string): string => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handleSaveUserInfo = async () => {
    // Validate inputs
    if (!editedUserInfo.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return;
    }
    
    if (!isValidEmail(editedUserInfo.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }
    
    const cleanedPhone = editedUserInfo.phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setSavingUserInfo(true);
      await api.updateUserInfo({
        ...editedUserInfo,
        phoneNumber: cleanedPhone,
      });
      setUserInfo(editedUserInfo);
      Alert.alert('Success', 'Your information has been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user information');
    } finally {
      setSavingUserInfo(false);
    }
  };

  // Membership tab functions
  const loadMembershipData = async () => {
    try {
      setLoadingMembership(true);
      const [plans, currentId] = await Promise.all([
        api.fetchMembershipPlans(),
        api.fetchCurrentMembership(),
      ]);
      setMembershipPlans(plans);
      setCurrentMembershipId(currentId);
      setSelectedMembershipId(currentId);
    } catch (error) {
      Alert.alert('Error', 'Failed to load membership information');
    } finally {
      setLoadingMembership(false);
    }
  };

  const handleMembershipChange = async () => {
    if (selectedMembershipId === currentMembershipId) {
      Alert.alert('Info', 'This is already your current membership plan');
      return;
    }

    const selectedPlan = membershipPlans.find(plan => plan.id === selectedMembershipId);
    
    Alert.alert(
      'Confirm Membership Change',
      `Switch to ${selectedPlan?.name}?\n\nMonthly: $${selectedPlan?.price}\nEnrollment: $${selectedPlan?.enrollment}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setUpdatingMembership(true);
              await api.updateMembership(selectedMembershipId);
              setCurrentMembershipId(selectedMembershipId);
              Alert.alert('Success', 'Your membership has been updated');
            } catch (error) {
              Alert.alert('Error', 'Failed to update membership');
            } finally {
              setUpdatingMembership(false);
            }
          },
        },
      ]
    );
  };

  // Tab rendering helper
  const renderTab = (tab: TabType, title: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Render Home Gym tab content
  const renderGymContent = () => (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="map-pin" size={20} color={theme.colors.accentRed} />
          <Text style={styles.sectionTitle}>Home Gym Location</Text>
        </View>
        
        <Text style={styles.sectionDescription}>
          Select your primary gym location. This will be used for class bookings and personalized recommendations.
        </Text>

        {loadingLocations ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.accentRed} />
          </View>
        ) : (
          <View style={styles.locationsContainer}>
            {locations.map((location) => {
              const isSelected = location.id === primaryLocationId;
              
              return (
                <TouchableOpacity
                  key={location.id}
                  style={[styles.locationItem, isSelected && styles.locationItemSelected]}
                  onPress={() => handleLocationSelect(location.id)}
                  disabled={updatingGym}
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
            })}
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
              disabled={updatingGym}
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
    </>
  );

  // Render Personal Info tab content
  const renderPersonalContent = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="user" size={20} color={theme.colors.accentRed} />
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>

      {loadingUserInfo ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accentRed} />
        </View>
      ) : (
        <>
          {/* Profile Picture */}
          <TouchableOpacity style={styles.profilePictureContainer}>
            {editedUserInfo.profilePicture ? (
              <Image 
                source={{ uri: editedUserInfo.profilePicture }} 
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Icon name="camera" size={32} color={theme.colors.coolGrey} />
              </View>
            )}
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editedUserInfo.fullName}
                onChangeText={(text) => setEditedUserInfo({...editedUserInfo, fullName: text})}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.coolGrey}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={editedUserInfo.email}
                onChangeText={(text) => setEditedUserInfo({...editedUserInfo, email: text})}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.coolGrey}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formatPhoneNumber(editedUserInfo.phoneNumber)}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  if (cleaned.length <= 10) {
                    setEditedUserInfo({...editedUserInfo, phoneNumber: cleaned});
                  }
                }}
                placeholder="(555) 123-4567"
                placeholderTextColor={theme.colors.coolGrey}
                keyboardType="phone-pad"
                maxLength={14}
              />
            </View>
          </View>

          <Button
            title="Save Changes"
            onPress={handleSaveUserInfo}
            variant="filled"
            style={styles.saveButton}
            disabled={savingUserInfo}
          />
        </>
      )}
    </View>
  );

  // Render Membership tab content
  const renderMembershipContent = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="credit-card" size={20} color={theme.colors.accentRed} />
        <Text style={styles.sectionTitle}>Membership Plans</Text>
      </View>

      {loadingMembership ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accentRed} />
        </View>
      ) : (
        <>
          <Text style={styles.sectionDescription}>
            Select your membership plan. Changes will take effect at the start of your next billing cycle.
          </Text>

          <View style={styles.membershipContainer}>
            {membershipPlans.map((plan) => {
              const isSelected = plan.id === selectedMembershipId;
              const isCurrent = plan.id === currentMembershipId;
              
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.membershipItem,
                    isSelected && styles.membershipItemSelected,
                  ]}
                  onPress={() => setSelectedMembershipId(plan.id)}
                  disabled={updatingMembership}
                >
                  <View style={styles.membershipHeader}>
                    <View style={styles.membershipTitleRow}>
                      <Text style={styles.membershipName}>{plan.name}</Text>
                      {isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>CURRENT</Text>
                        </View>
                      )}
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

                  <View style={styles.membershipPricing}>
                    {plan.price > 0 ? (
                      <>
                        <Text style={styles.membershipPrice}>${plan.price}</Text>
                        <Text style={styles.membershipPeriod}>/month</Text>
                        {plan.enrollment > 0 && (
                          <Text style={styles.enrollmentFee}>
                            + ${plan.enrollment} enrollment
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text style={styles.membershipFromPrice}>
                        from ${plan.fromPrice}
                      </Text>
                    )}
                  </View>

                  {plan.features.length > 0 && (
                    <View style={styles.featuresContainer}>
                      {plan.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                          <Icon name="check" size={14} color={theme.colors.accentRed} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={styles.membershipDescription}>{plan.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            title="Confirm Change"
            onPress={handleMembershipChange}
            variant="filled"
            style={styles.confirmButton}
            disabled={updatingMembership || selectedMembershipId === currentMembershipId}
          />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
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

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {renderTab('gym', 'Home Gym')}
            {renderTab('personal', 'Personal Info')}
            {renderTab('membership', 'Membership')}
          </View>

          {/* Tab Content */}
          {activeTab === 'gym' && renderGymContent()}
          {activeTab === 'personal' && renderPersonalContent()}
          {activeTab === 'membership' && renderMembershipContent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  keyboardView: {
    flex: 1,
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
    marginBottom: theme.spacing.lg,
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
  
  // Tab Navigation Styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.black,
  },
  tabText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.colors.white,
  },

  // Common Section Styles
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

  // Home Gym Tab Styles
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

  // Personal Info Tab Styles
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  changePhotoText: {
    ...theme.typography.body.regular,
    color: theme.colors.accentRed,
    fontWeight: '600',
  },
  formContainer: {
    gap: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.white,
    ...theme.typography.body.regular,
    borderWidth: 1,
    borderColor: theme.colors.charcoal,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
  },

  // Membership Tab Styles
  membershipContainer: {
    gap: theme.spacing.md,
  },
  membershipItem: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  membershipItemSelected: {
    borderColor: theme.colors.accentRed,
    backgroundColor: `${theme.colors.accentRed}10`,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  membershipTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  membershipName: {
    ...theme.typography.body.large,
    color: theme.colors.white,
    fontWeight: '600',
  },
  currentBadge: {
    backgroundColor: theme.colors.green,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  currentBadgeText: {
    ...theme.typography.body.small,
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
  membershipPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  membershipPrice: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
  },
  membershipPeriod: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
  },
  enrollmentFee: {
    ...theme.typography.body.small,
    color: theme.colors.yellow,
    marginLeft: theme.spacing.sm,
  },
  membershipFromPrice: {
    ...theme.typography.body.large,
    color: theme.colors.white,
  },
  featuresContainer: {
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.sm,
  },
  membershipDescription: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginTop: theme.spacing.sm,
    lineHeight: 18,
  },
  confirmButton: {
    marginTop: theme.spacing.xl,
  },
});