import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Vibration,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

type TabType = 'stopwatch' | 'timer';

export const TimerScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stopwatch');
  
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchPaused, setStopwatchPaused] = useState(false);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Timer state
  const [timerTime, setTimerTime] = useState(0);
  const [, setTimerInitialTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Timer input state
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  
  // Input editing state - tracks which field is being edited
  const [editingField, setEditingField] = useState<'minutes' | 'seconds' | null>(null);
  const [tempMinutes, setTempMinutes] = useState('');
  const [tempSeconds, setTempSeconds] = useState('');
  
  // Refs for TextInput components
  const minutesInputRef = useRef<TextInput>(null);
  const secondsInputRef = useRef<TextInput>(null);

  // Stopwatch effect
  useEffect(() => {
    if (stopwatchRunning && !stopwatchPaused) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
        stopwatchIntervalRef.current = null;
      }
    }

    return () => {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
      }
    };
  }, [stopwatchRunning, stopwatchPaused]);

  // Timer effect
  useEffect(() => {
    if (timerRunning && !timerPaused && timerTime > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerTime(prevTime => {
          if (prevTime <= 1) {
            setTimerRunning(false);
            setTimerPaused(false);
            Vibration.vibrate([500, 200, 500, 200, 500]);
            Alert.alert('Timer Finished!', 'Your timer has completed.');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, timerPaused, timerTime]);

  // Sync input values with timer time when not running
  useEffect(() => {
    if (!timerRunning && editingField === null) {
      const minutes = Math.floor(timerTime / 60);
      const seconds = timerTime % 60;
      setInputMinutes(minutes);
      setInputSeconds(seconds);
    }
  }, [timerTime, timerRunning, editingField]);

  // Cleanup effect - commit any pending changes on unmount
  useEffect(() => {
    return () => {
      // Commit any pending changes when component unmounts or tab switches
      if (editingField === 'minutes') {
        const minutes = tempMinutes ? parseInt(tempMinutes, 10) || 0 : 0;
        const clampedMinutes = Math.max(0, Math.min(99, minutes));
        setInputMinutes(clampedMinutes);
      } else if (editingField === 'seconds') {
        const seconds = tempSeconds ? parseInt(tempSeconds, 10) || 0 : 0;
        const clampedSeconds = Math.max(0, Math.min(59, seconds));
        setInputSeconds(clampedSeconds);
      }
    };
  }, [editingField, tempMinutes, tempSeconds]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Stopwatch functions
  const handleStopwatchStart = () => {
    setStopwatchRunning(true);
    setStopwatchPaused(false);
    Vibration.vibrate(50);
  };

  const handleStopwatchPause = () => {
    setStopwatchPaused(true);
    Vibration.vibrate(50);
  };

  const handleStopwatchResume = () => {
    setStopwatchPaused(false);
    Vibration.vibrate(50);
  };

  const handleStopwatchStop = () => {
    setStopwatchRunning(false);
    setStopwatchPaused(false);
    Vibration.vibrate([50, 50, 50]);
  };

  const handleStopwatchReset = () => {
    setStopwatchTime(0);
    setStopwatchRunning(false);
    setStopwatchPaused(false);
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
      stopwatchIntervalRef.current = null;
    }
    Vibration.vibrate(100);
  };

  // Timer functions
  const handleTimerStart = () => {
    if (timerTime > 0) {
      // If user is currently editing, finish the edit first
      if (editingField) {
        commitFieldValue(editingField);
        setTempMinutes('');
        setTempSeconds('');
        setEditingField(null);
      }
      
      // Dismiss keyboard if it's open
      Keyboard.dismiss();
      
      setTimerRunning(true);
      setTimerPaused(false);
      Vibration.vibrate(50);
    }
  };

  const handleTimerPause = () => {
    setTimerPaused(true);
    Vibration.vibrate(50);
  };

  const handleTimerResume = () => {
    setTimerPaused(false);
    Vibration.vibrate(50);
  };

  const handleTimerStop = () => {
    setTimerRunning(false);
    setTimerPaused(false);
    Vibration.vibrate([50, 50, 50]);
  };

  const handleTimerReset = () => {
    setTimerTime(0);
    setTimerInitialTime(0);
    setInputMinutes(0);
    setInputSeconds(0);
    setTimerRunning(false);
    setTimerPaused(false);
    // Clear any temp values and editing state
    setTempMinutes('');
    setTempSeconds('');
    setEditingField(null);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    Vibration.vibrate(100);
  };

  // Handle starting edit mode for minutes or seconds
  const handleStartEdit = (field: 'minutes' | 'seconds') => {
    if (timerRunning) return; // Don't allow editing while timer is running
    
    // If switching from another field, commit its value first
    if (editingField && editingField !== field) {
      commitFieldValue(editingField);
    }
    
    setEditingField(field);
    if (field === 'minutes') {
      // Start with empty input for better UX
      setTempMinutes('');
      // Auto-focus the input after a short delay to ensure it's rendered
      setTimeout(() => minutesInputRef.current?.focus(), 50);
    } else {
      // Start with empty input for better UX
      setTempSeconds('');
      setTimeout(() => secondsInputRef.current?.focus(), 50);
    }
    Vibration.vibrate(10);
  };

  // Commit a specific field's value without clearing other temp values
  const commitFieldValue = (field: 'minutes' | 'seconds') => {
    if (field === 'minutes') {
      // Only commit if there's a value, otherwise set to 0
      const minutes = tempMinutes ? parseInt(tempMinutes, 10) || 0 : 0;
      const clampedMinutes = Math.max(0, Math.min(99, minutes));
      setInputMinutes(clampedMinutes);
      
      // Update timer with new values
      const totalSeconds = clampedMinutes * 60 + inputSeconds;
      setTimerTime(totalSeconds);
      setTimerInitialTime(totalSeconds);
    } else if (field === 'seconds') {
      // Only commit if there's a value, otherwise set to 0
      const seconds = tempSeconds ? parseInt(tempSeconds, 10) || 0 : 0;
      const clampedSeconds = Math.max(0, Math.min(59, seconds));
      setInputSeconds(clampedSeconds);
      
      // Update timer with new values
      const totalSeconds = inputMinutes * 60 + clampedSeconds;
      setTimerTime(totalSeconds);
      setTimerInitialTime(totalSeconds);
    }
  };

  // Handle finishing edit and updating timer values
  const handleFinishEdit = () => {
    if (!editingField) return;
    
    // Commit the current field's value
    commitFieldValue(editingField);
    
    // Clear temp values completely to prevent stale data
    setTempMinutes('');
    setTempSeconds('');
    
    setEditingField(null);
    Keyboard.dismiss();
    Vibration.vibrate(10);
  };

  // Handle text change in inputs with live validation
  const handleMinutesChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    // Limit to 2 digits
    const limitedText = numericText.slice(0, 2);
    setTempMinutes(limitedText);
  };

  const handleSecondsChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    // Limit to 2 digits
    const limitedText = numericText.slice(0, 2);
    setTempSeconds(limitedText);
  };

  const getStopwatchStatusText = (): string => {
    if (!stopwatchRunning) return 'Ready to start';
    if (stopwatchPaused) return 'Paused';
    return 'Running';
  };

  const getTimerStatusText = (): string => {
    if (!timerRunning && timerTime === 0) return 'Tap time to set';
    if (!timerRunning) return 'Ready to start';
    if (timerPaused) return 'Paused';
    return 'Running';
  };

  const getStatusColor = (isRunning: boolean, isPaused: boolean): string => {
    if (!isRunning) return theme.colors.coolGrey;
    if (isPaused) return theme.colors.yellow;
    return theme.colors.green;
  };

  const renderStopwatch = () => (
    <View style={styles.content}>
      {/* Timer Display */}
      <View style={styles.timerDisplayContainer}>
        <Text style={styles.timeText}>{formatTime(stopwatchTime)}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(stopwatchRunning, stopwatchPaused) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(stopwatchRunning, stopwatchPaused) }]}>
            {getStopwatchStatusText()}
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {!stopwatchRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStopwatchStart}>
            <Icon name="play" size={32} color={theme.colors.white} />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.runningControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={stopwatchPaused ? handleStopwatchResume : handleStopwatchPause}
            >
              <Icon
                name={stopwatchPaused ? 'play' : 'pause'}
                size={24}
                color={theme.colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.stopButton} onPress={handleStopwatchStop}>
              <Icon name="square" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        )}

        {(stopwatchTime > 0 || stopwatchRunning) && (
          <TouchableOpacity style={styles.resetButton} onPress={handleStopwatchReset}>
            <Icon name="rotate-ccw" size={20} color={theme.colors.coolGrey} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTimer = () => {
    // Get current minutes and seconds for display
    const displayMinutes = Math.floor(timerTime / 60);
    const displaySeconds = timerTime % 60;

    return (
      <TouchableWithoutFeedback onPress={handleFinishEdit}>
        <View style={styles.content}>
        {/* Timer Display with Touchable Segments */}
        <View style={styles.timerDisplayContainer}>
          <View style={styles.editableTimeContainer}>
            {/* Minutes Segment */}
            {editingField === 'minutes' ? (
              <TextInput
                ref={minutesInputRef}
                style={styles.timeInput}
                value={tempMinutes}
                onChangeText={handleMinutesChange}
                onBlur={handleFinishEdit}
                onSubmitEditing={handleFinishEdit}
                keyboardType="numeric"
                maxLength={2}
                placeholder="0"
                placeholderTextColor={theme.colors.coolGrey}
                autoFocus
              />
            ) : (
              <TouchableOpacity 
                onPress={() => handleStartEdit('minutes')}
                disabled={timerRunning}
                activeOpacity={timerRunning ? 1 : 0.7}
              >
                <Text style={[styles.timeSegment, timerRunning && styles.disabledSegment]}>
                  {displayMinutes.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Colon Separator */}
            <Text style={styles.timeSeparator}>:</Text>
            
            {/* Seconds Segment */}
            {editingField === 'seconds' ? (
              <TextInput
                ref={secondsInputRef}
                style={styles.timeInput}
                value={tempSeconds}
                onChangeText={handleSecondsChange}
                onBlur={handleFinishEdit}
                onSubmitEditing={handleFinishEdit}
                keyboardType="numeric"
                maxLength={2}
                placeholder="0"
                placeholderTextColor={theme.colors.coolGrey}
                autoFocus
              />
            ) : (
              <TouchableOpacity 
                onPress={() => handleStartEdit('seconds')}
                disabled={timerRunning}
                activeOpacity={timerRunning ? 1 : 0.7}
              >
                <Text style={[styles.timeSegment, timerRunning && styles.disabledSegment]}>
                  {displaySeconds.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Helper Text */}
          {!timerRunning && editingField === null && (
            <Text style={styles.helperText}>Tap minutes or seconds to edit</Text>
          )}
          
          {/* Status Indicator */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(timerRunning, timerPaused) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(timerRunning, timerPaused) }]}>
              {getTimerStatusText()}
            </Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {!timerRunning ? (
            <TouchableOpacity 
              style={[styles.startButton, timerTime === 0 && styles.disabledButton]} 
              onPress={handleTimerStart}
              disabled={timerTime === 0}
            >
              <Icon name="play" size={28} color={theme.colors.white} />
              <Text style={styles.buttonText}>Start Timer</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.runningControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={timerPaused ? handleTimerResume : handleTimerPause}
              >
                <Icon
                  name={timerPaused ? 'play' : 'pause'}
                  size={24}
                  color={theme.colors.white}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.stopButton} onPress={handleTimerStop}>
                <Icon name="square" size={24} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          )}

          {timerTime > 0 && !timerRunning && (
            <TouchableOpacity style={styles.resetButton} onPress={handleTimerReset}>
              <Icon name="rotate-ccw" size={18} color={theme.colors.coolGrey} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Timer</Text>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stopwatch' && styles.activeTab]}
          onPress={() => setActiveTab('stopwatch')}
        >
          <Icon 
            name="play-circle" 
            size={20} 
            color={activeTab === 'stopwatch' ? theme.colors.white : theme.colors.coolGrey} 
          />
          <Text style={[styles.tabText, activeTab === 'stopwatch' && styles.activeTabText]}>
            Stopwatch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'timer' && styles.activeTab]}
          onPress={() => setActiveTab('timer')}
        >
          <Icon 
            name="clock" 
            size={20} 
            color={activeTab === 'timer' ? theme.colors.white : theme.colors.coolGrey} 
          />
          <Text style={[styles.tabText, activeTab === 'timer' && styles.activeTabText]}>
            Timer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'stopwatch' ? renderStopwatch() : renderTimer()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    ...theme.typography.heading.h1,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.accentRed,
  },
  tabText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.colors.white,
  },
  timerDisplayContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    marginTop: theme.spacing.xl,
  },
  timeText: {
    fontSize: 72,
    fontWeight: '300',
    color: theme.colors.white,
    fontFamily: 'monospace',
    marginBottom: theme.spacing.md,
    letterSpacing: 2,
  },
  editableTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  timeSegment: {
    fontSize: 72,
    fontWeight: '300',
    color: theme.colors.white,
    fontFamily: 'monospace',
    letterSpacing: 2,
    minWidth: 120,
    textAlign: 'center',
  },
  disabledSegment: {
    opacity: 0.7,
  },
  timeSeparator: {
    fontSize: 72,
    fontWeight: '300',
    color: theme.colors.white,
    fontFamily: 'monospace',
    marginHorizontal: theme.spacing.xs,
  },
  timeInput: {
    fontSize: 72,
    fontWeight: '300',
    color: theme.colors.white,
    fontFamily: 'monospace',
    letterSpacing: 2,
    minWidth: 120,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.accentRed,
    paddingBottom: 4,
  },
  helperText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginBottom: theme.spacing.md,
    opacity: 0.8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    ...theme.typography.body.regular,
    fontWeight: '600',
  },
  controlsContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  startButton: {
    backgroundColor: theme.colors.accentRed,
    paddingHorizontal: theme.spacing.xxl * 1.5,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    elevation: 4,
    shadowColor: theme.colors.accentRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginLeft: theme.spacing.md,
    fontWeight: 'bold',
  },
  runningControls: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  controlButton: {
    backgroundColor: theme.colors.charcoal,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stopButton: {
    backgroundColor: theme.colors.accentRed,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: theme.colors.accentRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  resetButtonText: {
    ...theme.typography.body.small,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.xs,
  },
  disabledButton: {
    opacity: 0.4,
  },
});