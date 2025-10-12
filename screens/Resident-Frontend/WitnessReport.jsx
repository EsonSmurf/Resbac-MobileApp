import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const WitnessReport = ({ navigation, route }) => {
  const backButtonImg = require('../../assets/backbutton.png');
  
  // Get incident type from route params or set default
  const [incidentType, setIncidentType] = useState(route?.params?.incidentType || '');
  const [locationText, setLocationText] = useState('');

  const handleSubmitReport = () => {
    // Handle report submission logic here
    console.log('Submitting witness report:', {
      incidentType,
      location: locationText
    });
    // Navigate back or to confirmation page
    navigation.navigate('Report');
  };

  return (
    <View style={styles.witnessReportContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonImg} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Report Incident</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Incident Type */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Incident Type:</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>{incidentType}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Location:</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter location details"
              value={locationText}
              onChangeText={setLocationText}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Pin Location */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Pin Location:</Text>
          <View style={styles.mapBox}>
            {/* Map placeholder - you can integrate with Google Maps or other mapping service */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Map will be displayed here</Text>
            </View>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={() => navigation.navigate('Call', {
              incidentType,
              fromWitnessReport: true
            })}
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
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
    margin: 0,
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
  inputField: {
    fontSize: 16,
    color: '#222',
    width: '100%',
    backgroundColor: 'transparent',
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
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    color: '#666',
    fontSize: 14,
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