import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const Report = ({ navigation }) => {
  const backButtonImg = require('../../assets/backbutton.png');

  const [reporterType, setReporterType] = useState('Victim');

  const incidentTypes = [
    { label: 'Fire', color: '#ff6666' },
    { label: 'Medical Emergency', color: '#fd3d40ff' },
    { label: 'Disaster\n(Earthquake, Floods, etc)', color: '#f96567ff' },
    { label: 'Vehicular Accident', color: '#fca8a9ff' },
    { label: 'Trauma', color: '#fa8789ff' },
    { label: 'Ambulance Services', color: '#fd3d40ff' },
  ];
  
  return (
    <View style={styles.reportContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonImg} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Report Incident</Text>
      </View>
      
      {/* Reporter Type Toggle */}
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
      
      {/* Incident Type Container */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.incidentContainer}>
          <Text style={styles.incidentLabel}>Incident Type:</Text>
          <View style={styles.incidentGrid}>
            {incidentTypes.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.incidentButton, { backgroundColor: item.color }]}
                onPress={() => {
                  if (reporterType === 'Witness') {
                    navigation.navigate('WitnessReport', { incidentType: item.label });
                  } else {
                    // Victim flow - navigate directly to Call screen
                    navigation.navigate('Call', { 
                      incidentType: item.label,
                      fromVictim: true 
                    });
                  }
                }}
              >
                <Text style={styles.incidentButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
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
    margin: 0,
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
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Report; 