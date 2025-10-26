import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';

const ResponderReports = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [assignedIncidents, setAssignedIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiFetch(`${config.API_BASE_URL}/api/responder/reports`);
        const reportsArray = Array.isArray(data) ? data : Object.values(data);
        setReports(reportsArray);
        setAssignedIncidents(reportsArray);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setReports(prev => [e.detail, ...prev]);
      setAssignedIncidents(prev => [e.detail, ...prev]);
      
      setTimeout(() => {
        setAssignedIncidents(prev => prev.filter(i => i.id !== e.detail.id));
      }, 5000);
    };

    // Web had a custom event for Echo; for RN use your Echo setup if needed.
    // Example (pseudo):
    // getEcho().then(echo => {
    //   echo.private(`responder`).listen('IncidentAssigned', (payload) => handler({ detail: payload.incident }));
    // });
    // return () => echo.leave('responder');
  }, []);

  const getStatusStyle = (status) => {
    if (!status) return styles.statusPending;
    const normalized = String(status).toLowerCase().replace(/\s+/g, '-');
    if (normalized.includes('cancel')) return styles.statusCancelled;
    if (normalized.includes('resolve')) return styles.statusResolved;
    if (normalized.includes('route') || normalized.includes('en-route')) return styles.statusEnroute;
    if (normalized.includes('on-scene') || normalized.includes('on scene')) return styles.statusOnScene;
    return styles.statusPending;
  };

  const prettyStatus = (status) => {
    if (!status) return '';
    const s = String(status).toLowerCase();
    if (s.includes('cancel')) return 'Cancelled';
    if (s.includes('resolve')) return 'Resolved';
    if (s.includes('route') || s.includes('en route')) return 'En Route';
    if (s.includes('on scene')) return 'On Scene';
    return 'Pending';
  };

  return (
    <View style={styles.reportsContainer}>
      <NewHeader navigation={navigation} />

      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
        </TouchableOpacity>
        <Text style={styles.title}>Assigned Reports</Text>
      </View>

      <View style={styles.reportsCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#3498db" style={styles.loadingIndicator} />
        ) : reports.length > 0 ? (
          <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportRow}
                onPress={() => navigation.navigate('ResponderViewReport', { report })}
              >
                <View style={styles.reportInfo}>
                  <Text style={styles.reportDatetime}>{report.date}</Text>
                  <Text style={styles.reportIncident}>
                    Incident Type: <Text style={styles.incidentType}>{report.type}</Text>
                  </Text>
                  <Text style={styles.reportLocation}>
                    {report.landmark || (report.latitude && report.longitude ? `${report.latitude}, ${report.longitude}` : "Unknown Location")}
                  </Text>
                </View>
                {report.status && (
                  <Text style={[styles.statusLabel, getStatusStyle(report.status)]}>
                    {prettyStatus(report.status)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={[styles.emptyText, styles.reportsEmpty]}>No assigned reports</Text>
        )}
      </View>

      <NewBottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  reportsContainer: {
    minHeight: '100%',
    backgroundColor: '#f7f8fa',
    position: 'relative',
    paddingBottom: 80,
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
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backButtonImg: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  reportsCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b3c6e0',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingVertical: 8,
    minHeight: 320,
  },
  loadingIndicator: {
    marginTop: 40,
  },
  reportsList: {
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reportInfo: {
    flex: 1,
  },
  reportDatetime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  reportIncident: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
    fontWeight: '600',
  },
  incidentType: {
    color: '#e74c3c',
    fontWeight: '700',
  },
  reportLocation: {
    fontSize: 12,
    color: '#666',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusEnroute: { color: '#f39c12' },
  statusOnScene: { color: '#e67e22' },
  statusCancelled: { color: '#e74c3c' },
  statusResolved: { color: '#27ae60' },
  statusPending: { color: '#7f8c8d' },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    margin: 0,
  },
  reportsEmpty: {
    paddingVertical: 16,
  },
});

export default ResponderReports;