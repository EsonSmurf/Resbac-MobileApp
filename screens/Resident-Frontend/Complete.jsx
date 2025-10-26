import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const Complete = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [completionData, setCompletionData] = useState({
    responderName: 'Emergency Response Team',
    arrivalTime: new Date().toLocaleTimeString(),
    incidentType: route?.params?.incidentType || 'Emergency',
    location: 'Your Location'
  });

  useEffect(() => {
    // Simulate loading completion data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.completeContainer}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Finalizing response...</Text>
        </View>
        <BottomNav navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.completeContainer}>
      <Header navigation={navigation} />
      
      {/* Map Background */}
      <View style={styles.mapBackground}>
        <View style={styles.mapPlaceholder}>
          {/* Map content will be rendered here when backend API is integrated */}
        </View>
      </View>

      {/* Completion Status Card Overlay */}
      <View style={styles.statusCard}>
        <View style={styles.statusContent}>
          <View style={styles.completionIcon}>
            <View style={styles.successCircle}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>
          <View style={styles.completionMessage}>
            <Text style={styles.completionText}>The responder has reached your location</Text>
            <Text style={styles.completionSubtext}>
              {completionData.responderName} arrived at {completionData.arrivalTime}
            </Text>
          </View>
        </View>
      </View>

      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  completeContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    minHeight: '100%',
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
    bottom: 120,
    left: '5%',
    right: '5%',
    backgroundColor: '#f8f8f8',
    borderRadius: 30,
    padding: 36,
    alignItems: 'center',
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
    alignItems: 'center',
    gap: 20,
  },
  completionIcon: {
    marginBottom: 16,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  completionMessage: {
    alignItems: 'center',
    gap: 8,
  },
  completionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  completionSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Complete;