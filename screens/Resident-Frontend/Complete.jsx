import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

function Complete({ navigation, route }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Fade in animation
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for success circle
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.completeContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      {/* Map Background */}
      <View style={styles.mapBackground}>
        {/* Map content will be rendered here when backend API is integrated */}
        <View style={styles.mapPlaceholder}>
          {/* TODO: Replace with actual map tiles or API integration */}
        </View>
      </View>

      {/* Completion Status Card Overlay */}
      <Animated.View 
        style={[
          styles.statusCard,
          {
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          }
        ]}
      >
        <View style={styles.statusContent}>
          <View style={styles.completionIcon}>
            <Animated.View 
              style={[
                styles.successCircle,
                {
                  transform: [{ scale: pulseAnim }],
                }
              ]}
            >
              <Text style={styles.checkmark}>✓</Text>
            </Animated.View>
          </View>
          <View style={styles.completionMessage}>
            <Text style={styles.completionText}>
              The responder has reached your location
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  completeContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    minHeight: '100%',
    position: 'relative',
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e8f4fd',
    zIndex: 1,
  },
  mapPlaceholder: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#e8f4fd',
  },
  statusCard: {
    position: 'absolute',
    bottom: 80,
    left: '5%',
    right: '5%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  statusContent: {
    gap: 16,
    alignItems: 'center',
  },
  completionIcon: {
    alignItems: 'center',
    marginBottom: 8,
  },
  successCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  checkmark: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  completionMessage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default Complete;
