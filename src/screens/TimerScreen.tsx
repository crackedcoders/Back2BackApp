import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { Card } from '../components/Card';

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
  const [timerInitialTime, setTimerInitialTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    setTimerTime(timerInitialTime);
    setTimerRunning(false);
    setTimerPaused(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    Vibration.vibrate(100);
  };

  const setTimerPreset = (minutes: number) => {
    const seconds = minutes * 60;
    setTimerTime(seconds);
    setTimerInitialTime(seconds);
  };

  const adjustTimer = (adjustment: number) => {
    if (!timerRunning) {
      const newTime = Math.max(0, timerTime + adjustment);
      setTimerTime(newTime);
      setTimerInitialTime(newTime);
    }
  };

  const getStopwatchStatusText = (): string => {
    if (!stopwatchRunning) return 'Ready to start';
    if (stopwatchPaused) return 'Paused';
    return 'Running';
  };

  const getTimerStatusText = (): string => {
    if (!timerRunning && timerTime === 0) return 'Set timer';
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
      <Card style={styles.timerCard}>
        <View style={styles.timerDisplay}>
          <Text style={styles.timeText}>{formatTime(stopwatchTime)}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(stopwatchRunning, stopwatchPaused) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(stopwatchRunning, stopwatchPaused) }]}>
              {getStopwatchStatusText()}
            </Text>
          </View>
        </View>
      </Card>

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
              <Text style={styles.controlButtonText}>
                {stopwatchPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stopButton} onPress={handleStopwatchStop}>
              <Icon name="square" size={24} color={theme.colors.white} />
              <Text style={styles.controlButtonText}>Stop</Text>
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

  const renderTimer = () => (
    <View style={styles.content}>
      {/* Timer Display */}
      <Card style={styles.timerCard}>
        <View style={styles.timerDisplay}>
          <Text style={styles.timeText}>{formatTime(timerTime)}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(timerRunning, timerPaused) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(timerRunning, timerPaused) }]}>
              {getTimerStatusText()}
            </Text>
          </View>
        </View>
      </Card>

      {/* Timer Adjustment Controls */}
      {!timerRunning && (
        <View style={styles.timerAdjustContainer}>
          <View style={styles.adjustRow}>
            <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTimer(-60)}>
              <Text style={styles.adjustButtonText}>-1m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTimer(-300)}>
              <Text style={styles.adjustButtonText}>-5m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTimer(300)}>
              <Text style={styles.adjustButtonText}>+5m</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTimer(60)}>
              <Text style={styles.adjustButtonText}>+1m</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {!timerRunning ? (
          <TouchableOpacity 
            style={[styles.startButton, timerTime === 0 && styles.disabledButton]} 
            onPress={handleTimerStart}
            disabled={timerTime === 0}
          >
            <Icon name="play" size={32} color={theme.colors.white} />
            <Text style={styles.buttonText}>Start</Text>
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
              <Text style={styles.controlButtonText}>
                {timerPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stopButton} onPress={handleTimerStop}>
              <Icon name="square" size={24} color={theme.colors.white} />
              <Text style={styles.controlButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}

        {timerTime > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={handleTimerReset}>
            <Icon name="rotate-ccw" size={20} color={theme.colors.coolGrey} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Timer Presets */}
      {!timerRunning && timerTime === 0 && (
        <View style={styles.quickTimesContainer}>
          <Text style={styles.quickTimesTitle}>Quick Timer</Text>
          <View style={styles.quickTimesGrid}>
            {[
              { label: '5 min', minutes: 5 },
              { label: '10 min', minutes: 10 },
              { label: '15 min', minutes: 15 },
              { label: '30 min', minutes: 30 },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.label}
                style={styles.quickTimeButton}
                onPress={() => setTimerPreset(preset.minutes)}
              >
                <Text style={styles.quickTimeText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

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
  timerCard: {
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: theme.colors.white,
    fontFamily: 'monospace',
    marginBottom: theme.spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: theme.spacing.xxl,
  },
  startButton: {
    backgroundColor: theme.colors.accentRed,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
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
  },
  controlButton: {
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    minWidth: 100,
  },
  stopButton: {
    backgroundColor: theme.colors.accentRed,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    minWidth: 100,
  },
  controlButtonText: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  resetButtonText: {
    ...theme.typography.body.regular,
    color: theme.colors.coolGrey,
    marginLeft: theme.spacing.sm,
  },
  quickTimesContainer: {
    alignItems: 'center',
  },
  quickTimesTitle: {
    ...theme.typography.heading.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.lg,
  },
  quickTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickTimeButton: {
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  quickTimeText: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
    fontWeight: '600',
  },
  timerAdjustContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  adjustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  adjustButton: {
    backgroundColor: theme.colors.charcoal,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  adjustButtonText: {
    ...theme.typography.body.regular,
    color: theme.colors.white,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});