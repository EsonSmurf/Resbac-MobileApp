import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

function Arrived({ navigation, route }) {
  const [location, setLocation] = useState('Fetching location...');
  const [statusMessage, setStatusMessage] = useState('Responder is on their way');

  // ✅ Simulate the location fetching like in your React.js version
  useEffect(() => {
    // Simulate fetching current location from backend or API
    const fetchLocation = async () => {
      try {
        // Placeholder example (replace with actual location logic or API later)
        setTimeout(() => {
          setLocation('Brgy. Mabini Street, Zone 3, Davao City');
        }, 1500);
      } catch (error) {
        console.error('Failed to fetch location:', error);
        setLocation('Unable to fetch location');
      }
    };

    fetchLocation();
  }, []);

  return (
    <View style={styles.arrivedContainer}>
      {/* Header */}
      <Header navigation={navigation} />

      {/* Map Background */}
      <View style={styles.mapBackground}>
        {/* TODO: Replace with actual map API (e.g., react-native-maps) */}
        <View style={styles.mapPlaceholder}></View>
      </View>

      {/* Status Card Overlay */}
      <View style={styles.statusCard}>
        <View style={styles.statusContent}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationIcon}>📍</Text>
            <View style={styles.locationText}>
              <Text style={styles.locationAddress}>{location}</Text>
            </View>
          </View>
          <View style={styles.statusMessage}>
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  arrivedContainer: {
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
    left: '2.5%',
    right: '2.5%',
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
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationIcon: {
    fontSize: 20,
    color: '#d32f2f',
    marginTop: 2,
  },
  locationText: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    lineHeight: 20,
  },
  statusMessage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    textAlign: 'center',
  },
});

export default Arrived;
