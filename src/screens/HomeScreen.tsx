import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Dimensions, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';
import { Card, IconButton, ClassCard } from '../components';
import { TabParamList } from '../navigation/types';

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

interface HomeScreenProps {
  userName?: string;
}

interface Announcement {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  isNew: boolean;
}

const { width } = Dimensions.get('window');

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New HIIT Classes Added',
    summary: 'Check out our new morning HIIT sessions starting next week',
    fullText: 'We\'re excited to announce the addition of new High-Intensity Interval Training (HIIT) classes to our morning schedule! Starting next Monday, we\'ll be offering 45-minute HIIT sessions at 6:00 AM and 7:00 AM, Monday through Friday.\n\nThese classes are designed to maximize your workout efficiency with alternating periods of intense exercise and recovery. Perfect for those looking to boost metabolism, improve cardiovascular fitness, and build strength.\n\nSpaces are limited to 15 participants per class to ensure personalized attention. Book your spot through the app to secure your place!',
    isNew: true,
  },
  {
    id: '2',
    title: 'Holiday Schedule Update',
    summary: 'Modified hours for New Year celebrations - see details',
    fullText: 'Please note our special holiday hours for the New Year period:\n\nDecember 31st (New Year\'s Eve):\n• Morning classes: 6 AM - 12 PM\n• Open gym: 12 PM - 4 PM\n• Closed from 4 PM\n\nJanuary 1st (New Year\'s Day):\n• Closed all day\n\nJanuary 2nd:\n• Regular schedule resumes\n\nWe wish all our members a happy and healthy New Year! Remember to stay active during the holidays - even a short workout makes a difference.',
    isNew: true,
  },
  {
    id: '3',
    title: 'Equipment Upgrade Complete',
    summary: 'Brand new rowing machines now available in the cardio zone',
    fullText: 'The wait is over! Our cardio zone has been upgraded with 8 brand new Concept2 RowErg rowing machines. These state-of-the-art rowers feature:\n\n• PM5 Performance Monitors with Bluetooth connectivity\n• Adjustable footrests and ergonomic handles\n• Smooth, quiet operation\n• Compatible with our fitness tracking app\n\nRowing provides a full-body, low-impact workout that\'s perfect for all fitness levels. If you\'re new to rowing, ask our trainers for a quick introduction - proper form is key to maximizing your workout and preventing injury.\n\nThe old rowing machines have been donated to local community centers as part of our commitment to promoting fitness in the wider community.',
    isNew: false,
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ userName }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const iconFillAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const announcementRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const underlineAnimation = useRef(new Animated.Value(1)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const modalSlideAnimation = useRef(new Animated.Value(50)).current;

  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      
      // Start auto-scroll for announcements
      startAutoScroll();
      
      return () => {
        if (autoScrollTimer.current) {
          clearInterval(autoScrollTimer.current);
        }
        // Stop any running animations
        underlineAnimation.stopAnimation();
      };
    }, [])
  );

  useEffect(() => {
    // First animate the icon fill
    Animated.timing(iconFillAnimation, {
      toValue: 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // After icon animation completes, start pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [iconFillAnimation, pulseAnimation]);

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const handleDoorUnlock = () => {
    navigation.navigate('Door');
  };

  const handleClassPress = () => {
    navigation.navigate('Classes');
  };

  const startCountdownAnimation = () => {
    // Stop any existing animation
    underlineAnimation.stopAnimation();
    
    // Reset to full width instantly (scaleX = 1)
    underlineAnimation.setValue(1);
    
    // Linear countdown from scaleX = 1 to scaleX = 0 over 5 seconds
    Animated.timing(underlineAnimation, {
      toValue: 0,
      duration: 5000, // 5 second countdown
      easing: Easing.linear, // Linear for steady countdown
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    
    // Start the countdown animation
    startCountdownAnimation();
    
    autoScrollTimer.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % mockAnnouncements.length;
        console.log('Auto-scroll: current =', prevIndex, 'next =', nextIndex);
        
        // Scroll to next card
        announcementRef.current?.scrollToIndex({ 
          index: nextIndex, 
          animated: true 
        });
        
        // Start new countdown for next interval
        startCountdownAnimation();
        
        return nextIndex;
      });
    }, 5000);
  };

  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    
    console.log('Manual scroll end: offsetX =', offsetX, 'calculated index =', index, 'current =', currentIndex);
    
    if (index !== currentIndex && index >= 0 && index < mockAnnouncements.length) {
      setCurrentIndex(index);
      // Reset countdown when user manually swipes
      startAutoScroll();
    }
  };

  const openAnnouncementModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalVisible(true);
    
    // Animate modal opening
    Animated.parallel([
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnimation, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAnnouncementModal = () => {
    // Animate modal closing
    Animated.parallel([
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnimation, {
        toValue: 50,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedAnnouncement(null);
    });
  };

  const markAsRead = () => {
    if (selectedAnnouncement) {
      // Update the announcement's isNew status
      const index = mockAnnouncements.findIndex(a => a.id === selectedAnnouncement.id);
      if (index !== -1) {
        mockAnnouncements[index].isNew = false;
      }
      closeAnnouncementModal();
    }
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <TouchableOpacity 
      style={styles.announcementCard} 
      activeOpacity={0.9}
      onPress={() => openAnnouncementModal(item)}
    >
      <View style={styles.announcementContent}>
        <View style={styles.announcementIconContainer}>
          <Icon name="bell" size={24} color={theme.colors.accentRed} />
        </View>
        <View style={styles.announcementTextContainer}>
          <Text style={styles.announcementTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.announcementSummary} numberOfLines={1} ellipsizeMode="tail">
            {item.summary}
          </Text>
        </View>
        {item.isNew && <View style={styles.newIndicator} />}
      </View>
      
      {/* Animated countdown underline */}
      <View style={styles.underlineContainer}>
        <Animated.View
          style={[
            styles.announcementUnderline,
            {
              transform: [
                {
                  scaleX: underlineAnimation,
                },
              ],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getTimeBasedGreeting()}, {userName || 'Guest'}</Text>
          <Text style={styles.subGreeting}>Ready to crush your workout?</Text>
        </View>
        
        {/* Announcements Banner */}
        <View style={styles.announcementsContainer}>
          <FlatList
            ref={announcementRef}
            data={mockAnnouncements}
            renderItem={renderAnnouncement}
            horizontal
            pagingEnabled
            snapToInterval={width}
            snapToAlignment="start"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            keyExtractor={(item) => item.id}

            onTouchStart={() => {
              // Stop current countdown and timer when user starts touching
              if (autoScrollTimer.current) {
                clearInterval(autoScrollTimer.current);
              }
              underlineAnimation.stopAnimation();
            }}
            onTouchEnd={() => {
              // Reset auto-scroll timer after user interaction
              startAutoScroll();
            }}
          />
          
          {/* Page Indicators */}
          <View style={styles.pageIndicators}>
            {mockAnnouncements.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pageIndicator,
                  index === currentIndex && styles.pageIndicatorActive,
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Streak Card */}
        <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
          <Card style={styles.streakCard}>
            <View style={styles.streakContent}>
              <View style={styles.flameContainer}>
                {/* Soft halo effect */}
                <Animated.View
                  style={[
                    styles.flameHalo,
                    {
                      opacity: iconFillAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.2, 0.3],
                      }),
                    },
                  ]}
                />
                
                {/* White outline fire icon (fades out) */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [1, 0.5, 0],
                    }),
                  }}
                >
                  <MCIcon name="fire" size={44} color={theme.colors.white} />
                </Animated.View>
                
                {/* Tighter gradient with cleaner colors */}
                {/* Lemon yellow core */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation,
                  }}
                >
                  <MCIcon name="fire" size={44} color="#FFF700" />
                </Animated.View>
                
                {/* Orange transition layer */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation.interpolate({
                      inputRange: [0, 0.4, 1],
                      outputRange: [0, 0.85, 0.9],
                    }),
                  }}
                >
                  <MCIcon name="fire" size={44} color="#FF6B00" style={{ transform: [{ scale: 0.9 }] }} />
                </Animated.View>
                
                {/* Crimson outer layer */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: iconFillAnimation.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0, 0.7, 0.85],
                    }),
                  }}
                >
                  <MCIcon name="fire" size={44} color="#DC143C" style={{ transform: [{ scale: 0.75 }] }} />
                </Animated.View>
              </View>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakText}>8 day streak</Text>
                <Text style={styles.streakSubtext}>Keep it going!</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
        
        {/* Next Class Card */}
        <ClassCard
          classId="class-1"
          title="Power Lift"
          dateTime={new Date(Date.now() + 3 * 60 * 60 * 1000)} // 3 hours from now
          instructorName="Sarah Johnson"
          instructorAvatarUrl={undefined}
          spotsLeft={4}
          capacity={15}
          location="Downtown"
          onCancel={() => {
            console.log('Cancel class');
            // Implement cancel logic
          }}
          onViewMap={() => {
            console.log('View map');
            // Implement map view logic
          }}
        />
      </ScrollView>
      
      {/* Announcement Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeAnnouncementModal}
      >
        <Animated.View
          style={[
            styles.modalBackdrop,
            {
              opacity: modalAnimation,
            },
          ]}
        >
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            activeOpacity={1}
            onPress={closeAnnouncementModal}
          />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: modalSlideAnimation }],
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedAnnouncement?.title}</Text>
              <TouchableOpacity onPress={closeAnnouncementModal}>
                <Icon name="x" size={24} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
            
            {/* Modal Body - Scrollable Content */}
            <ScrollView 
              style={styles.modalBody} 
              showsVerticalScrollIndicator={true}
              bounces={true}
              scrollEnabled={true}
            >
              <Text style={styles.modalBodyText}>{selectedAnnouncement?.fullText}</Text>
            </ScrollView>
            
            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.markAsReadButton} onPress={markAsRead}>
                <Text style={styles.markAsReadText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
      
      {/* Floating Door Unlock Button */}
      <View style={styles.floatingButtonContainer}>
        <IconButton
          icon={<Icon name="key" size={36} color={theme.colors.white} />}
          size="large"
          onPress={handleDoorUnlock}
          style={styles.floatingButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  greetingSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  greeting: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  subGreeting: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
  },
  streakCard: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.accentRed,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  flameHalo: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF700',
    shadowColor: '#FFF700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  streakTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  streakText: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    fontWeight: 'bold',
    lineHeight: (theme.typography.heading.h3.fontSize || 18) * 1.2,
  },
  streakSubtext: {
    ...theme.typography.body.small,
    color: theme.colors.white,
    opacity: 0.8,
    lineHeight: (theme.typography.body.small.fontSize || 14) * 1.4,
    marginTop: 2,
  },
  announcementsContainer: {
    marginBottom: theme.spacing.xl,
    marginHorizontal: -theme.spacing.lg, // Counteract ScrollView's padding
    paddingHorizontal: theme.spacing.lg, // Add back the correct padding
  },
  announcementCard: {
    width: width - theme.spacing.lg * 2, // Match other cards' width
    height: 85,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginHorizontal: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  announcementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  announcementIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  announcementTextContainer: {
    flex: 1,
  },
  announcementTitle: {
    ...theme.typography.body.regular,
    fontSize: 17,
    color: theme.colors.white,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  announcementSummary: {
    ...theme.typography.body.small,
    fontSize: 15,
    color: theme.colors.coolGrey,
    lineHeight: 20,
  },
  newIndicator: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accentRed,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  pageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.charcoal,
    marginHorizontal: 3,
  },
  pageIndicatorActive: {
    backgroundColor: theme.colors.accentRed,
  },
  underlineContainer: {
    position: 'absolute',
    bottom: 0,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    alignItems: 'center',
  },
  announcementUnderline: {
    width: width - theme.spacing.lg * 4, // Match card content width (card width minus padding)
    height: 1,
    backgroundColor: theme.colors.accentRed,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    width: '100%',
    height: '70%', // Fixed height like the working test modal
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.accentRed,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalInner: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    fontWeight: 'bold',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  modalBody: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  modalBodyText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    lineHeight: 24,
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  markAsReadButton: {
    backgroundColor: theme.colors.accentRed,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  markAsReadText: {
    ...theme.typography.body.medium,
    color: theme.colors.white,
    fontWeight: '600',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 90,
    right: theme.spacing.lg,
  },
  floatingButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});