import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';

const ResponderDashboard = ({ navigation }) => {
  const [assignedReports] = useState([]);

  const handleViewReport = (reportId) => {
    navigation.navigate('ResponderReportDetails', { reportId });
  };

  return (
    <View style={styles.dashboardContainer}>
      {/* Header */}
      <NewHeader navigation={navigation} />

      {/* Main Content */}
      <ScrollView style={styles.dashboardContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        {/* Assigned Reports Section */}
        <View style={styles.assignedReportsSection}>
          <Text style={styles.sectionTitle}>Assigned Reports</Text>
          <View style={styles.reportsContainer}>
            {assignedReports.length > 0 ? (
              <View style={styles.reportsList}>
                {assignedReports.map((report) => (
                  <View key={report.id} style={styles.reportCard}>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportDate}>{report.date}</Text>
                      <Text style={styles.reportType}>
                        Incident Type : <Text style={styles.reportTypeStrong}>{report.incidentType}</Text>
                      </Text>
                      <Text style={styles.reportLocation}>{report.location}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleViewReport(report.id)}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyInner}>
                <Text style={styles.emptyText}>No assigned reports available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Incident Heatmap Section */}
        <View style={styles.heatmapSection}>
          <Text style={styles.sectionTitle}>Incident Heatmap</Text>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              {/* This would be replaced with actual Map integration */}
              <View style={styles.mapContent}>
                <View style={styles.mapOverlay}>
                  {/* Pins/roads/labels can be drawn via absolute children or a MapView overlay */}
                </View>
                <View style={styles.mapFooter}>
                  <Text style={styles.googleText}></Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <NewBottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  dashboardContent: {
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  assignedReportsSection: {
    marginBottom: 32,
  },
  reportsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d6e0ff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    padding: 12,
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
    marginRight: 12,
  },
  reportDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '500',
  },
  reportType: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
    fontWeight: '500',
  },
  reportTypeStrong: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  reportLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  viewButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyInner: {
    backgroundColor: '#f9fbff',
    borderWidth: 1,
    borderColor: '#d6e0ff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '500',
  },
  heatmapSection: {
    marginBottom: 32,
  },
  mapContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    height: 300,
    position: 'relative',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8f4fd',
  },
  mapContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapFooter: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  googleText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});

export default ResponderDashboard;


