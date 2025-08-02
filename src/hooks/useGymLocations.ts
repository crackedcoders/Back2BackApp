import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
export type GymLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  isPrimary: boolean;
};

// Storage keys
const STORAGE_KEYS = {
  PRIMARY_GYM: '@back2back_primary_gym',
  GYM_LOCATIONS: '@back2back_gym_locations',
};

// Custom hook for managing gym locations
export const useGymLocations = () => {
  const [locations, setLocations] = useState<GymLocation[]>([]);
  const [primaryLocationId, setPrimaryLocationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load locations from storage or API
  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get from local storage first
      const storedLocations = await AsyncStorage.getItem(STORAGE_KEYS.GYM_LOCATIONS);
      const storedPrimaryId = await AsyncStorage.getItem(STORAGE_KEYS.PRIMARY_GYM);

      if (storedLocations) {
        const parsedLocations = JSON.parse(storedLocations);
        setLocations(parsedLocations);
        
        if (storedPrimaryId) {
          setPrimaryLocationId(storedPrimaryId);
        }
      } else {
        // Fetch from API if not in storage
        await fetchLocationsFromAPI();
      }
    } catch (err) {
      setError('Failed to load gym locations');
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch locations from API
  const fetchLocationsFromAPI = async () => {
    // Replace with actual API call
    const response = await fetch('https://api.back2back.com/user/gym-locations', {
      headers: {
        'Authorization': 'Bearer <user-token>',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data = await response.json();
    const fetchedLocations = data.locations as GymLocation[];
    
    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.GYM_LOCATIONS,
      JSON.stringify(fetchedLocations)
    );
    
    // Find primary location
    const primary = fetchedLocations.find(loc => loc.isPrimary);
    if (primary) {
      await AsyncStorage.setItem(STORAGE_KEYS.PRIMARY_GYM, primary.id);
      setPrimaryLocationId(primary.id);
    }
    
    setLocations(fetchedLocations);
  };

  // Update primary gym location
  const updatePrimaryGym = useCallback(async (locationId: string) => {
    try {
      // Update local state optimistically
      const updatedLocations = locations.map(loc => ({
        ...loc,
        isPrimary: loc.id === locationId,
      }));
      setLocations(updatedLocations);
      setPrimaryLocationId(locationId);

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.PRIMARY_GYM, locationId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.GYM_LOCATIONS,
        JSON.stringify(updatedLocations)
      );

      // Update on server
      const response = await fetch('https://api.back2back.com/user/primary-gym', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer <user-token>',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gymLocationId: locationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update primary gym');
      }

      return true;
    } catch (err) {
      // Revert on error
      await loadLocations();
      throw err;
    }
  }, [locations, loadLocations]);

  // Get primary location details
  const getPrimaryLocation = useCallback(() => {
    return locations.find(loc => loc.id === primaryLocationId);
  }, [locations, primaryLocationId]);

  // Load locations on mount
  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return {
    locations,
    primaryLocationId,
    loading,
    error,
    updatePrimaryGym,
    getPrimaryLocation,
    refetch: loadLocations,
  };
};