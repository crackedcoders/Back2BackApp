import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definition for membership plans
export type MembershipPlan = {
  id: string;
  name: string;
  price: number;
  enrollment: number;
  fromPrice: number;
  features: string[];
  description: string;
};

// Storage keys for caching
const MEMBERSHIP_PLANS_STORAGE_KEY = '@Back2Back:membershipPlans';
const CURRENT_MEMBERSHIP_STORAGE_KEY = '@Back2Back:currentMembership';

// Mock API functions - Replace these with actual API calls
const api = {
  fetchMembershipPlans: async (): Promise<MembershipPlan[]> => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response - replace with actual API call
    // Example: const response = await fetch(`${API_BASE_URL}/memberships/plans`);
    // return response.json();
    
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
  
  fetchCurrentMembership: async (): Promise<string> => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response - replace with actual API call
    // Example: const response = await fetch(`${API_BASE_URL}/user/membership`, {
    //   headers: { 'Authorization': `Bearer ${authToken}` }
    // });
    // const data = await response.json();
    // return data.planId;
    
    return '1'; // Returns plan ID
  },
  
  updateMembership: async (planId: string): Promise<void> => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Example actual API call:
    // await fetch(`${API_BASE_URL}/user/membership`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${authToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ planId }),
    // });
    
    console.log('Updated membership to plan:', planId);
  },
};

export const useMembership = () => {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [currentMembershipId, setCurrentMembershipId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load membership data from cache and then fetch from API
  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from cache first for faster initial load
      const [cachedPlans, cachedCurrent] = await Promise.all([
        AsyncStorage.getItem(MEMBERSHIP_PLANS_STORAGE_KEY),
        AsyncStorage.getItem(CURRENT_MEMBERSHIP_STORAGE_KEY),
      ]);
      
      if (cachedPlans) {
        setMembershipPlans(JSON.parse(cachedPlans));
      }
      if (cachedCurrent) {
        setCurrentMembershipId(cachedCurrent);
      }
      
      // Fetch fresh data from API
      const [freshPlans, freshCurrentId] = await Promise.all([
        api.fetchMembershipPlans(),
        api.fetchCurrentMembership(),
      ]);
      
      setMembershipPlans(freshPlans);
      setCurrentMembershipId(freshCurrentId);
      
      // Update cache
      await Promise.all([
        AsyncStorage.setItem(MEMBERSHIP_PLANS_STORAGE_KEY, JSON.stringify(freshPlans)),
        AsyncStorage.setItem(CURRENT_MEMBERSHIP_STORAGE_KEY, freshCurrentId),
      ]);
    } catch (err) {
      setError('Failed to load membership information');
      console.error('Error loading membership data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateMembership = async (planId: string) => {
    try {
      setError(null);
      
      // Call API to update membership
      await api.updateMembership(planId);
      
      // Update local state
      setCurrentMembershipId(planId);
      
      // Update cache
      await AsyncStorage.setItem(CURRENT_MEMBERSHIP_STORAGE_KEY, planId);
      
      return { success: true };
    } catch (err) {
      setError('Failed to update membership');
      console.error('Error updating membership:', err);
      return { success: false, error: 'Failed to update membership' };
    }
  };

  const getCurrentPlan = (): MembershipPlan | undefined => {
    return membershipPlans.find(plan => plan.id === currentMembershipId);
  };

  const refreshMembershipData = async () => {
    await loadMembershipData();
  };

  return {
    membershipPlans,
    currentMembershipId,
    loading,
    error,
    updateMembership,
    getCurrentPlan,
    refreshMembershipData,
  };
};