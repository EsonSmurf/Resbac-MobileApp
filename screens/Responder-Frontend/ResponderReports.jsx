import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';

const ResponderReports = ({ navigation }) => {
  const [reports] = useState([]);

  const getStatusStyle = (status) => {
    if (!status) return styles.statusPending;
    const normalized = String(status).toLowerCase();
    if (normalized.includes('cancel')) return styles.statusCancelled;
    if (normalized.includes('resolve')) return styles.statusResolved;
    if (normalized.includes('route') || normalized.includes('en route')) return styles.statusEnroute;
    return styles.statusPending;
  };

  const prettyStatus = (status) => {
    if (!status) return '';
    const s = String(status).toLowerCase();
    if (s.includes('cancel')) return 'Cancelled';
    if (s.includes('resolve')) return 'Resolved';
    if (s.includes('route') || s.includes('en route')) return 'En Route';
    return 'Pending';
  };

  return (
    <View style={styles.reportsContainer}>
      {/* Header */}
      <NewHeader navigation={navigation} />

      {/* Title row */}
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
        </TouchableOpacity>
        <Text style={styles.title}>Reports</Text>
      </View>

      {/* Reports card */}
      <View style={styles.reportsCard}>
        {reports.length > 0 ? (
          <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
            {reports.map((report) => (
              <View key={report.id} style={styles.reportRow}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportDatetime}>{report.dateTime}</Text>
                  <Text style={styles.reportIncident}>
                    Incident Type: <Text style={styles.incidentType}>{report.incidentType}</Text>
                  </Text>
                  <Text style={styles.reportLocation}>{report.location}</Text>
                </View>
                {report.status ? (
                  <Text style={[styles.statusLabel, getStatusStyle(report.status)]}>{prettyStatus(report.status)}</Text>
                ) : null}
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={[styles.emptyText, styles.reportsEmpty]}>No assigned reports</Text>
        )}
      </View>

      {/* Bottom Navigation */}
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
  backButtonIcon: {
    fontSize: 20,
    color: '#333',
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


