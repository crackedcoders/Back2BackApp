import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definition for user information
export type UserInfo = {
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
};

// Storage key for caching
const USER_INFO_STORAGE_KEY = '@Back2Back:userInfo';

// Mock API functions - Replace these with actual API calls
const api = {
  fetchUserInfo: async (): Promise<UserInfo> => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response - replace with actual API call
    // Example: const response = await fetch(`${API_BASE_URL}/user/profile`, {
    //   headers: { 'Authorization': `Bearer ${authToken}` }
    // });
    // return response.json();
    
    return {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '3105551234',
      profilePicture: undefined,
    };
  },
  
  updateUserInfo: async (userInfo: UserInfo): Promise<void> => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Example actual API call:
    // await fetch(`${API_BASE_URL}/user/profile`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${authToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(userInfo),
    // });
    
    console.log('Updated user info:', userInfo);
  },
};

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user info from cache and then fetch from API
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from cache first for faster initial load
      const cachedData = await AsyncStorage.getItem(USER_INFO_STORAGE_KEY);
      if (cachedData) {
        setUserInfo(JSON.parse(cachedData));
      }
      
      // Fetch fresh data from API
      const freshData = await api.fetchUserInfo();
      setUserInfo(freshData);
      
      // Update cache
      await AsyncStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(freshData));
    } catch (err) {
      setError('Failed to load user information');
      console.error('Error loading user info:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (newUserInfo: UserInfo) => {
    try {
      setError(null);
      
      // Update local state optimistically
      setUserInfo(newUserInfo);
      
      // Update cache
      await AsyncStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(newUserInfo));
      
      // Call API to persist changes
      await api.updateUserInfo(newUserInfo);
      
      return { success: true };
    } catch (err) {
      // Revert on error
      await loadUserInfo();
      setError('Failed to update user information');
      console.error('Error updating user info:', err);
      return { success: false, error: 'Failed to update user information' };
    }
  };

  const refreshUserInfo = async () => {
    await loadUserInfo();
  };

  return {
    userInfo,
    loading,
    error,
    updateUserInfo,
    refreshUserInfo,
  };
};