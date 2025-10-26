import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';

const WitnessReport = ({ navigation, route }) => {
  const [incidentType] = useState(route?.params?.incidentType || '');
  const [incidentTypeId] = useState(route?.params?.incidentTypeId || null);
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: route?.params?.latitude || 14.7995,
    longitude: route?.params?.longitude || 120.9267
  });
  const [mapReady, setMapReady] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setSelectedCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to report incidents.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleSubmitReport = async () => {
    if (!mapReady) return Alert.alert("Map Error", "Map not ready.");
    
    try {
      const payload = {
        incident_type_id: incidentTypeId,
        reporter_type: "witness",
        latitude: selectedCoords.lat,
        longitude: selectedCoords.lng,
        landmark: null,
        description: null,
      };

      const data = await apiFetch(`${config.API_BASE_URL}/api/incidents/from-resident`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Witness report response:", data);

      if (data.duplicate_of) {
        Alert.alert("Duplicate Report", "This incident was already reported. We've added you as a duplicate reporter.");
        navigation.navigate('Waiting', {
          duplicateOf: data.duplicate_of,
          duplicates: data.duplicates
        });
        return;
      }

      navigation.navigate('Call', {
        incidentType, 
        fromWitnessReport: true, 
        incident: data.incident 
      });

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Submit failed — try again.");
    }
  };

  return (
    <View style={styles.witnessReportContainer}>
      <Header navigation={navigation} />
      
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonImg} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Witness Report</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Incident Type:</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>{incidentType}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Pin the Location of the Incident:</Text>
          <Text style={styles.instructionText}>Tap on the map to drop a pin where the incident happened.</Text>

          <View style={styles.mapBox}>
            {initializing && (
              <View style={styles.mapLoadingOverlay}>
                <Text style={styles.mapLoadingText}>Loading map...</Text>
              </View>
            )}

            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Map will be displayed here</Text>
              <Text style={styles.coordinatesText}>
                Coordinates: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmitReport}
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  witnessReportContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backButtonIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  formSection: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#222',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#222',
  },
  mapBox: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#b3c6e0',
    height: 200,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mapLoadingText: {
    fontSize: 16,
    color: '#666',
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  coordinatesText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#e53935',
    borderRadius: 10,
    alignSelf: 'center',
    width: '50%',
    marginVertical: 16,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default WitnessReport;