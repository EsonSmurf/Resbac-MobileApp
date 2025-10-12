import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const EmergencyTips = ({ navigation }) => {
  const [selectedIncidentType, setSelectedIncidentType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [currentTip, setCurrentTip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch incident types from backend
  const fetchIncidentTypes = async () => {
    try {
      // TODO: Replace with your actual backend API endpoint
      // const response = await fetch('YOUR_BACKEND_URL/api/incident-types');
      // const data = await response.json();
      // setIncidentTypes(data.incidentTypes);
      
      // Mock data for demonstration - remove this when backend is ready
      const mockIncidentTypes = [
        'Fire',
        'Medical Emergency',
        'Trauma',
        'Disaster',
        'Vehicular Accident'
      ];
      setIncidentTypes(mockIncidentTypes);
      
      if (mockIncidentTypes.length > 0) {
        setSelectedIncidentType(mockIncidentTypes[0]);
      }
    } catch (error) {
      console.error('Error fetching incident types:', error);
      setError('Failed to load incident types');
    }
  };

  // Fetch emergency tip based on selected incident type
  const fetchEmergencyTip = async (incidentType) => {
    if (!incidentType) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with your actual backend API endpoint
      // const response = await fetch(`YOUR_BACKEND_URL/api/emergency-tips?type=${incidentType}`);
      // const data = await response.json();
      // setCurrentTip(data.tip);
      
      // Mock data for demonstration - remove this when backend is ready
      const mockTip = {
      
      };
      setCurrentTip(mockTip);
    } catch (error) {
      console.error('Error fetching emergency tip:', error);
      setError('Failed to load emergency tip');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchIncidentTypes();
  }, []);

  // Fetch tip when incident type changes
  useEffect(() => {
    if (selectedIncidentType) {
      fetchEmergencyTip(selectedIncidentType);
    }
  }, [selectedIncidentType]);

  const handleIncidentTypeSelect = (type) => {
    setSelectedIncidentType(type);
    setShowDropdown(false);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderText}>First aid page</Text>
        </View>
        <Header navigation={navigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchIncidentTypes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <BottomNav navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
      {/* Main Header with Profile */}
      <Header navigation={navigation} />

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header row above container */}
        <View style={styles.emergencyTipsHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
          </TouchableOpacity>
          <Text style={styles.emergencyTipsTitle}>Emergency Tips</Text>
        </View>

        {/* Incident Type Selector above container */}
        <View style={styles.incidentTypeSection}>
          <Text style={styles.incidentTypeLabel}>Incident Type</Text>
          <View style={styles.dropdownWrap}>
            <TouchableOpacity 
              style={styles.dropdownContainer}
              onPress={() => setShowDropdown(!showDropdown)}
              disabled={incidentTypes.length === 0}
            >
              <Text style={styles.dropdownText}>
                {selectedIncidentType || 'Select incident type'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {/* Dropdown Options (overlay) */}
            {showDropdown && incidentTypes.length > 0 && (
              <View style={styles.dropdownOptions}>
                {incidentTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.dropdownOption}
                    onPress={() => handleIncidentTypeSelect(type)}
                  >
                    <Text style={styles.dropdownOptionText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Container with image only */}
        <View style={styles.emergencyTipsSection}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff8c00" />
              <Text style={styles.loadingText}>Loading emergency tip...</Text>
            </View>
          ) : currentTip ? (
            <View style={styles.infographicContainer}>
              {/* Image Container/Placeholder */}
              <View style={styles.imageContainer}>
                {currentTip.imageUrl ? (
                  <Image
                    source={{ uri: currentTip.imageUrl }}
                    style={styles.emergencyImage}
                    resizeMode="contain"
                    onError={() => {
                      // Handle image loading error
                      console.log('Image failed to load');
                    }}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderSubtext}>Emergency Guide Image</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No emergency tip available for this incident type.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  topHeader: {
    backgroundColor: '#666',
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  topHeaderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  emergencyTipsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  emergencyTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonImg: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
  emergencyTipsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  incidentTypeSection: {
    marginBottom: 24,
  },
  dropdownWrap: {
    position: 'relative',
  },
  incidentTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  dropdownOptions: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 100,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff8c00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infographicContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infographicHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infographicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emergencyImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderSubtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  placeholderDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default EmergencyTips;
