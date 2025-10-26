import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location'; // Keep this - it's correct
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';

const Report = ({ navigation }) => {
  const backButtonImg = require('../../assets/backbutton.png');
  const [reporterType, setReporterType] = useState('Victim');
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllIncidentTypes = async () => {
      try {
        let page = 1;
        let allTypes = [];
        let totalPages = 1;

        do {
          const res = await apiFetch(`${config.API_BASE_URL}/api/incident-types?page=${page}`);
          allTypes = [...allTypes, ...res.data]; 
          totalPages = res.last_page; 
          page++;
        } while (page <= totalPages);

        const styledTypes = allTypes.map((type) => {
          let color = '#c94c4c';
          let fontColor = '#222';
          if (type.priority) {
            switch (type.priority.priority_level) {
              case 4: color = '#ac3737ff'; fontColor = '#fff'; break; 
              case 3: color = '#c94c4c'; break; 
              case 2: color = '#dc6b6bff'; break; 
              case 1: color = '#e59595'; break; 
            }
          }
          return { ...type, color, fontColor };
        });

        setIncidentTypes(styledTypes);
      } catch (err) {
        console.error("Failed to fetch incident types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllIncidentTypes();
  }, []);

  const mapIncidentLabelToId = (label) => {
    const found = incidentTypes.find((type) => type.name === label);
    return found ? found.id : null;
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);
      return status === 'granted';
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
        maximumAge: 60000,
      });
      console.log('Location obtained:', location.coords);
      return location.coords;
    } catch (err) {
      console.error('Location error:', err);
      throw err;
    }
  };

  const handleIncidentClick = async (incidentType) => {
    console.log('Incident clicked:', incidentType.name);
    
    if (reporterType === "Witness") {
      const hasPermission = await requestLocationPermission();
      console.log('Witness permission granted:', hasPermission);
      
      if (!hasPermission) {
        Alert.alert("Location Permission", "Location access is required to report incidents.");
        return;
      }

      try {
        const coords = await getCurrentLocation();
        const latitude = coords.latitude;
        const longitude = coords.longitude;

        navigation.navigate('WitnessReport', {
          incidentType: incidentType.name,
          incidentTypeId: mapIncidentLabelToId(incidentType.name),
          latitude,
          longitude
        });
      } catch (err) {
        console.error("Geolocation error:", err);
        Alert.alert("Location Error", "Failed to detect your location. The map will default to Bocaue.");
        navigation.navigate('WitnessReport', {
          incidentType: incidentType.name,
          incidentTypeId: mapIncidentLabelToId(incidentType.name)
        });
      }
      return;
    }

    try {
      const hasPermission = await requestLocationPermission();
      console.log('Victim permission granted:', hasPermission);
      
      if (!hasPermission) {
        Alert.alert("Location Permission", "Location access is required to report incidents.");
        return;
      }

      const coords = await getCurrentLocation();
      const latitude = coords.latitude;
      const longitude = coords.longitude;

      const payload = {
        incident_type_id: mapIncidentLabelToId(incidentType.name),
        reporter_type: reporterType.toLowerCase(),
        latitude,
        longitude,
        description: null,
      };

      console.log('Sending payload:', payload);

      try {
        const data = await apiFetch(`${config.API_BASE_URL}/api/incidents/from-resident`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        console.log("Incident created:", data);

        if (data.duplicate_of) {
          Alert.alert(
            "Report Acknowledged",
            "Your report has been acknowledged! " +
            "It seems this incident was already reported, so we've added you as a duplicate reporter. " +
            "Thank you for helping keep the community safe."
          );

          navigation.navigate('Dashboard', {
            duplicateOf: data.duplicate_of,
            duplicates: data.duplicates
          });
          return;
        }

        if (reporterType === "Victim") {
          navigation.navigate('Call', { 
            incidentType: incidentType.name, 
            incident: data.incident 
          });
        }
      } catch (error) {
        console.error("Error creating incident:", error);
        Alert.alert("Error", "Failed to report incident. Please try again.");
      }
    } catch (error) {
      console.error("Error creating incident:", error);
      Alert.alert("Error", "Failed to report incident. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.reportContainer}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading incident types...</Text>
        </View>
        <BottomNav navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.reportContainer}>
      <Header navigation={navigation} />
      
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonImg} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Report</Text>
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Reporter Type:</Text>
        <TouchableOpacity
          style={[styles.toggleButton, reporterType === 'Victim' && styles.toggleButtonActiveVictim]}
          onPress={() => setReporterType('Victim')}
        >
          <Text style={[styles.toggleButtonText, reporterType === 'Victim' && styles.toggleButtonTextActiveVictim]}>Victim</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, reporterType === 'Witness' && styles.toggleButtonActiveWitness]}
          onPress={() => setReporterType('Witness')}
        >
          <Text style={[styles.toggleButtonText, reporterType === 'Witness' && styles.toggleButtonTextActiveWitness]}>Witness</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.incidentContainer}>
          <Text style={styles.incidentLabel}>Incident Type:</Text>
          <View style={styles.incidentGrid}>
            {incidentTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.incidentButton, { backgroundColor: item.color }]}
                onPress={() => handleIncidentClick(item)}
              >
                <Text style={[styles.incidentButtonText, { color: item.fontColor }]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  reportContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  titleRow: {
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  toggleLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 10,
    color: '#222',
  },
  toggleButton: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginRight: 8,
  },
  toggleButtonActiveVictim: {
    backgroundColor: '#e53935',
  },
  toggleButtonActiveWitness: {
    backgroundColor: '#e53935',
  },
  toggleButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  toggleButtonTextActiveVictim: {
    color: '#fff',
  },
  toggleButtonTextActiveWitness: {
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  incidentContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    padding: 20,
  },
  incidentLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#222',
  },
  incidentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  incidentButton: {
    width: '48%',
    minHeight: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incidentButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Report;