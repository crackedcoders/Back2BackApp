import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { ClassesScreen } from '../screens/ClassesScreen';
import { DoorScreen } from '../screens/DoorScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';

const Tab = createBottomTabNavigator();

type TabNavigatorRouteProp = RouteProp<RootStackParamList, 'Main'>;

export const TabNavigator = () => {
  const route = useRoute<TabNavigatorRouteProp>();
  const userName = route.params?.userName;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accentRed,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: {
          backgroundColor: theme.colors.black,
          height: theme.layout.bottomTabHeight,
          borderTopWidth: 0,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.md,
          position: 'absolute',
          elevation: 0,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={24} />
          ),
        }}
      >
        {() => <HomeScreen userName={userName} />}
      </Tab.Screen>
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Door"
        component={DoorScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="key" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="activity" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};