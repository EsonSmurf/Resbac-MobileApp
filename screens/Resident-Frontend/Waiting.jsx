import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const Waiting = ({ navigation, route }) => {
  const [emergencyReport, setEmergencyReport] = useState({
    id: '',
    type: '',
    description: '',
    location: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    status: 'pending',
    submittedAt: new Date().toISOString(),
    estimatedResponseTime: '5-10 minutes',
    assignedDispatcher: null,
    priority: 'medium',
    callDuration: 0,
              fromWitnessReport: false,
          fromSOS: false,
          fromVictim: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get data passed from the call screen
  const callData = route?.params || {};

  // Simulate fetching emergency report data from backend
  useEffect(() => {
    const fetchEmergencyReport = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/emergency-reports/current');
        // const data = await response.json();
        
        // If no call data is present, redirect to report page
        if (!callData.incidentType && !callData.fromWitnessReport && !callData.fromSOS && !callData.fromVictim) {
          console.warn('No incident data provided, redirecting to report page');
          navigation.navigate('Report');
          return;
        }
        
        // Mock data for demonstration
        const mockData = {
          id: 'ER-2024-001',
          type: callData.incidentType || (callData.fromSOS ? 'Emergency' : callData.fromVictim ? 'Victim Report' : 'Witness Report'),
          description: callData.fromSOS 
            ? 'SOS emergency call completed - high priority dispatch'
            : callData.fromVictim
              ? 'Victim emergency call completed - immediate dispatch'
              : callData.fromWitnessReport 
                ? 'Witness report submitted - under review'
                : 'Emergency call completed - awaiting dispatch',
          location: '123 Main Street, Bocaue',
          coordinates: {
            latitude: 14.7995,
            longitude: 120.9267
          },
          status: 'pending',
          submittedAt: callData.timestamp || new Date().toISOString(),
          estimatedResponseTime: callData.fromSOS ? '2-5 minutes' : callData.fromVictim ? '3-7 minutes' : '5-10 minutes',
          assignedDispatcher: null,
          priority: callData.fromSOS ? 'critical' : callData.fromVictim ? 'high' : 'medium',
          callDuration: callData.callDuration || 0,
          fromWitnessReport: callData.fromWitnessReport || false,
          fromSOS: callData.fromSOS || false,
          fromVictim: callData.fromVictim || false
        };
        
        setEmergencyReport(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load emergency report details');
        console.error('Error fetching emergency report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyReport();
  }, [callData, navigation]);

  // Function to handle canceling the emergency report
  const handleCancelReport = async () => {
    Alert.alert(
      'Cancel Emergency Report',
      'Are you sure you want to cancel this emergency report?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await fetch(`/api/emergency-reports/${emergencyReport.id}/cancel`, {
              //   method: 'PUT',
              //   headers: { 'Content-Type': 'application/json' }
              // });
              
              navigation.navigate('Dashboard');
            } catch (err) {
              setError('Failed to cancel emergency report');
              console.error('Error canceling report:', err);
            }
          },
        },
      ]
    );
  };

  // Function to handle updating report status
  const handleUpdateStatus = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/emergency-reports/${emergencyReport.id}/status`);
      // const data = await response.json();
      // setEmergencyReport(prev => ({ ...prev, ...data }));
      
      console.log('Checking for status updates...');
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Auto-refresh status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (emergencyReport.status === 'pending') {
        handleUpdateStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [emergencyReport.status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.waitingContainer}>
        <Header navigation={navigation} />
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1041BC" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
        <BottomNav navigation={navigation} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.waitingContainer}>
        <Header navigation={navigation} />
        <View style={styles.errorOverlay}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.replace('Waiting', route?.params)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <BottomNav navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.waitingContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      {/* Map Background */}
      <View style={styles.mapBackground}>
        {/* Map content will be rendered here when backend API is integrated */}
        <View style={styles.mapPlaceholder}>
          {/* TODO: Replace with actual map data from backend API */}
        </View>
      </View>

      {/* Status Card Overlay */}
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <View style={styles.processingSpinner}>
            <View style={styles.spinnerCircle} />
          </View>
        </View>
        <View style={styles.statusContent}>
          <Text style={styles.statusTitle}>
            {emergencyReport.fromSOS 
              ? 'Your SOS emergency call has been successfully submitted'
              : emergencyReport.fromWitnessReport 
                ? 'Your witness report has been successfully submitted'
                : 'Your emergency report has been successfully submitted'
            }
          </Text>
          <Text style={styles.statusSubtitle}>
            {emergencyReport.fromSOS
              ? 'and is now being dispatched with high priority.'
              : emergencyReport.fromWitnessReport
                ? 'and is now being reviewed by our response team.'
                : 'and is now awaiting assignment by a dispatcher.'
            }
          </Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  waitingContainer: {
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
    bottom: 120,
    left: '2.5%',
    right: '2.5%',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
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
  statusIcon: {
    marginBottom: 20,
  },
  processingSpinner: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerCircle: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderRadius: 30,
    transform: [{ rotate: '0deg' }],
  },
  statusContent: {
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 8,
  },
  loadingText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  errorOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    color: '#d32f2f',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1041BC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Waiting;
