import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';
import { reverseGeocode } from '../../utils/hereApi';
import MapView, { Heatmap, Marker } from 'react-native-maps';

const MUNICIPAL = { latitude: 14.79407719563481, longitude: 120.94294770863102 };

const ResponderDashboard = ({ navigation }) => {
  const [incidents, setIncidents] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [locationName, setLocationName] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsObj = await apiFetch(`${config.API_BASE_URL}/api/responder/reports`);
        const reports = Array.isArray(reportsObj) ? reportsObj : Object.values(reportsObj);

        if (reports && reports.length > 0) {
          const item = reports[0];
          setLatestReport(item);
          if (item.latitude && item.longitude) {
            const address = await reverseGeocode(item.latitude, item.longitude);
            setLocationName(address || 'Unknown Location');
          } else {
            setLocationName('—');
          }
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        Alert.alert('Error', 'Failed to fetch reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const fetchHeatmapIncidents = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${config.API_BASE_URL}/api/heatmap/incidents`, {
          method: 'GET',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        setIncidents(data || []);
      } catch (error) {
        console.error('Error fetching heatmap incidents:', error);
      }
    };

    fetchHeatmapIncidents();
  }, []);

  const handleViewReport = (report) => {
    navigation.navigate('ResponderViewReport', { report });
  };

  /** 🎨 Color calculation similar to your web version */
  const colorForCount = (count, maxCount) => {
    const p = maxCount > 0 ? Math.min(count / maxCount, 1) : 0;
    if (p <= 0.5) {
      const t = p / 0.5;
      return `rgb(${120 + 135 * t}, ${200 - 80 * t}, ${120 - 120 * t})`; // green→yellow
    } else {
      const t = (p - 0.5) / 0.5;
      return `rgb(${255 - 54 * t}, ${210 - 90 * t}, ${120 - 44 * t})`; // yellow→red
    }
  };

  const renderHeatmap = () => {
    if (!Array.isArray(incidents) || incidents.length === 0) {
      return (
        <Marker
          coordinate={{ latitude: MUNICIPAL.latitude, longitude: MUNICIPAL.longitude }}
          title="No incidents yet"
          description="There are currently no heatmap points to display."
        />
      );
    }

    const validIncidents = incidents
      .filter((item) => item && item.latitude && item.longitude)
      .map((item) => ({
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        weight: 1,
        count: item.count || 1,
      }));

    const maxCount = Math.max(...validIncidents.map((i) => i.count));

    return (
      <>
        <Heatmap
          points={validIncidents.map((p) => ({
            latitude: p.latitude,
            longitude: p.longitude,
            weight: p.count || 1,
          }))}
          opacity={0.7}
          radius={40}
          gradient={{
            colors: ['#78C878', '#FFD778', '#C94C4C'],
            startPoints: [0.01, 0.5, 1],
            colorMapSize: 256,
          }}
        />
        {validIncidents.map((item, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            pinColor={colorForCount(item.count, maxCount)}
            title={`Incidents: ${item.count}`}
          />
        ))}
      </>
    );
  };

  return (
    <View style={styles.responderDashboard}>
      <NewHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        <View style={styles.assignedReportsSection}>
          <Text style={styles.sectionTitle}>Assigned Reports</Text>
          <View style={styles.reportsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#3498db" />
            ) : latestReport ? (
              <TouchableOpacity style={styles.reportCard} onPress={() => handleViewReport(latestReport)}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportDate}>{latestReport.date}</Text>
                  <Text style={styles.reportType}>
                    Incident Type: <Text style={styles.reportTypeHighlight}>{latestReport.type}</Text>
                  </Text>
                  <Text style={styles.reportLocation}>{locationName}</Text>
                </View>
                <View style={styles.reportStatusContainer}>
                  <Text
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(latestReport.status) }]}
                  >
                    {latestReport.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No assigned reports available</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.heatmapSection}>
          <Text style={styles.sectionTitle}>Incident Heatmap</Text>
          <View style={styles.responderMapContainer}>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: MUNICIPAL.latitude,
                longitude: MUNICIPAL.longitude,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }}
            >
              {renderHeatmap()}
            </MapView>
          </View>
        </View>
      </ScrollView>
      <NewBottomNav navigation={navigation} />
    </View>
  );
};

// Helper: status colors
const getStatusColor = (status) => {
  if (!status) return '#7f8c8d';
  const s = status.toLowerCase().replace(/\s+/g, '-');
  if (s.includes('pending')) return '#f1c40f';
  if (s.includes('en-route') || s.includes('en route')) return '#3498db';
  if (s.includes('on-scene') || s.includes('on scene')) return '#e67e22';
  if (s.includes('resolved')) return '#27ae60';
  if (s.includes('cancelled')) return '#e74c3c';
  return '#7f8c8d';
};

const styles = StyleSheet.create({
  responderDashboard: { flex: 1, backgroundColor: '#f5f5f5', position: 'relative' },
  dashboardContent: { paddingTop: 100, paddingHorizontal: 16, paddingBottom: 100, maxWidth: 600, alignSelf: 'center' },
  welcomeSection: { marginBottom: 24 },
  welcomeText: { fontSize: 24, fontWeight: '600', color: '#2c3e50' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginBottom: 16 },
  assignedReportsSection: { marginBottom: 32 },
  reportCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportInfo: { flex: 1, marginRight: 12 },
  reportDate: { fontSize: 14, color: '#7f8c8d', marginBottom: 4, fontWeight: '500' },
  reportType: { fontSize: 16, color: '#2c3e50', marginBottom: 4, fontWeight: '500' },
  reportTypeHighlight: { color: '#e74c3c', fontWeight: '600' },
  reportLocation: { fontSize: 14, color: '#7f8c8d' },
  reportStatusContainer: { alignItems: 'flex-end' },
  statusBadge: { color: '#fff', fontWeight: '600', fontSize: 13, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  emptyCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: { color: '#7f8c8d', fontSize: 16, fontWeight: '500', textAlign: 'center' },
  heatmapSection: { marginBottom: 32 },
  responderMapContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 400,
  },
});

export default ResponderDashboard;
