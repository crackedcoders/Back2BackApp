import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { ClassDetailScreen } from '../screens/ClassDetailScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { CheckInHistoryScreen } from '../screens/CheckInHistoryScreen';
import { ClassAttendanceHistoryScreen } from '../screens/ClassAttendanceHistoryScreen';
import { theme } from '../theme';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: theme.colors.black,
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
        <Stack.Screen name="CheckInHistory" component={CheckInHistoryScreen} />
        <Stack.Screen name="ClassAttendanceHistory" component={ClassAttendanceHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};