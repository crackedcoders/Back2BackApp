import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { ClassCard } from './ClassCard';

// Example usage of ClassCard component demonstrating various states
export const ClassCardExamples = () => {
  // Example 1: Class happening today with plenty of spots
  const todayClass = (
    <ClassCard
      classId="class-1"
      title="Morning HIIT"
      dateTime={new Date(Date.now() + 2 * 60 * 60 * 1000)} // 2 hours from now
      instructorName="Mike Thompson"
      instructorAvatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
      spotsLeft={8}
      capacity={15}
      location="Downtown"
      onCancel={() => Alert.alert('Cancel', 'Cancel Morning HIIT class?')}
      onViewMap={() => Alert.alert('Map', 'Opening Downtown location map')}
    />
  );

  // Example 2: Tomorrow's class that's almost full
  const tomorrowClass = (
    <ClassCard
      classId="class-2"
      title="CrossFit Fundamentals"
      dateTime={new Date(Date.now() + 26 * 60 * 60 * 1000)} // Tomorrow
      instructorName="Jessica Lee"
      instructorAvatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
      spotsLeft={2}
      capacity={20}
      location="Westside"
      onCancel={() => Alert.alert('Cancel', 'Cancel CrossFit class?')}
      onViewMap={() => Alert.alert('Map', 'Opening Westside location map')}
    />
  );

  // Example 3: Class next week with no instructor image
  const nextWeekClass = (
    <ClassCard
      classId="class-3"
      title="Yoga Flow"
      dateTime={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // Next week
      instructorName="Emma Wilson"
      instructorAvatarUrl={undefined} // No image - will show icon placeholder
      spotsLeft={12}
      capacity={25}
      location="Valley"
      onCancel={() => Alert.alert('Cancel', 'Cancel Yoga Flow class?')}
      onViewMap={() => Alert.alert('Map', 'Opening Valley location map')}
    />
  );

  // Example 4: Almost full class (triggers warning color)
  const almostFullClass = (
    <ClassCard
      classId="class-4"
      title="Olympic Weightlifting"
      dateTime={new Date(Date.now() + 5 * 60 * 60 * 1000)} // 5 hours from now
      instructorName="Carlos Rodriguez"
      instructorAvatarUrl="https://randomuser.me/api/portraits/men/22.jpg"
      spotsLeft={1}
      capacity={10}
      location="Downtown"
      onCancel={() => Alert.alert('Cancel', 'Cancel Olympic Weightlifting?')}
      onViewMap={() => Alert.alert('Map', 'Opening Downtown location map')}
    />
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingVertical: 20 }}>
        {todayClass}
        {tomorrowClass}
        {nextWeekClass}
        {almostFullClass}
      </View>
    </ScrollView>
  );
};

// Example of fetching and displaying next class from API
export const NextClassExample = () => {
  const [nextClass, setNextClass] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    fetchNextClass();
  }, []);

  const fetchNextClass = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('https://api.back2back.com/user/next-class');
      const data = await response.json();
      
      setNextClass({
        classId: data.id,
        title: data.name,
        dateTime: new Date(data.startTime),
        instructorName: data.instructor.name,
        instructorAvatarUrl: data.instructor.avatarUrl,
        spotsLeft: data.capacity - data.enrolled,
        capacity: data.capacity,
        location: data.location.name,
      });
    } catch (error) {
      console.error('Failed to fetch next class:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClass = async () => {
    Alert.alert(
      'Cancel Class',
      `Are you sure you want to cancel ${nextClass.title}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // API call to cancel class
              await fetch(`https://api.back2back.com/bookings/${nextClass.classId}/cancel`, {
                method: 'POST',
              });
              // Refresh data
              fetchNextClass();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel class');
            }
          },
        },
      ]
    );
  };

  if (loading || !nextClass) {
    return null; // Or loading state
  }

  return (
    <ClassCard
      {...nextClass}
      onCancel={handleCancelClass}
      onViewMap={() => {
        // Navigate to map screen with location
        navigation.navigate('Map', { location: nextClass.location });
      }}
    />
  );
};