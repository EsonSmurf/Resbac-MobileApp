import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const Dashboard = ({ navigation }) => {
  const [data] = useState({
    user: {
      name: '',
      address: '',
      avatar: null,
    },
    emergencyTips: 'Show',
    publicAnnouncements: [],
    recentReports: [],
  });

  // Handle SOS button click
  const handleSOSClick = () => {
    navigation.navigate('Call', {
      incidentType: 'Emergency',
      fromSOS: true
    });
  };

  return (
    <View style={styles.dashboardContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      <ScrollView style={styles.scrollView}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.leftSide}>
            <Text style={styles.welcome}>Welcome back!</Text>
            <Text style={styles.name}>{data.user.name || ''}</Text>
            <Text style={styles.address}>{data.user.address || ''}</Text>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity style={styles.tipsButton} onPress={() => navigation.navigate('EmergencyTips')}>
              <Text style={styles.tipsButtonText}>Emergency Tips</Text>
              <View style={styles.tipsShowButton}>
                <Text style={styles.tipsShowButtonText}>Show</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SOS Section */}
        <View style={styles.sosSection}>
          <Text style={styles.sosTitle}>Are you in an Emergency?</Text>
          <Text style={styles.sosSubtitle}>Press the button to report an emergency.</Text>
          <TouchableOpacity style={styles.sosButton} onPress={handleSOSClick}>
            <View style={styles.sosOuterCircle}>
              <View style={styles.sosInnerCircle}>
                <Text style={styles.sosText}>SOS</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Public Announcements */}
        <Text style={styles.sectionTitle}>Public Announcement</Text>
        {data.publicAnnouncements.length > 0 ? (
          <View style={styles.announcementsList}>
            {data.publicAnnouncements.map((item) => (
              <View style={styles.announcementCard} key={item.id}>
                <Text style={styles.announcementText}>{item.message}</Text>
                <TouchableOpacity style={styles.announcementButton}>
                  <Text style={styles.announcementButtonText}>{item.button}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No announcements available</Text>
          </View>
        )}
        
        {/* Recent Reports */}
        <Text style={styles.sectionTitle}>My Recent Report</Text>
        {data.recentReports.length > 0 ? (
          <View style={styles.reportsList}>
            {data.recentReports.map((item) => (
              <View style={styles.reportCard} key={item.id}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportDate}>{item.date}</Text>
                  <Text style={styles.reportType}>
                    Incident Type : <Text style={{ fontWeight: 'bold' }}>{item.type}</Text>
                  </Text>
                  <Text style={styles.reportLocation}>{item.location}</Text>
                </View>
                <View style={styles.reportStatusContainer}>
                  <Text style={styles.reportStatus}>{item.status}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recent reports</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 90,
  },
  userInfoSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  tipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  tipsButtonText: {
    fontSize: 14,
    color: '#222',
    marginRight: 8,
  },
  tipsShowButton: {
    backgroundColor: '#e53935',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  tipsShowButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sosSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e53935',
    alignItems: 'center',
    padding: 18,
    margin: 16,
    marginBottom: 18,
  },
  sosTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  sosSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  sosButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sosOuterCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffb3b3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosInnerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e53935',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6E120E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  sosText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 36,
    letterSpacing: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 4,
    color: '#222',
    marginLeft: 16,
  },
  announcementsList: {
    marginHorizontal: 16,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  announcementText: {
    flex: 1,
    color: '#222',
    fontSize: 14,
  },
  announcementButton: {
    backgroundColor: '#4be37a',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  announcementButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reportsList: {
    marginHorizontal: 16,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  reportInfo: {
    flex: 1,
  },
  reportDate: {
    color: '#222',
    fontSize: 13,
    marginBottom: 2,
  },
  reportType: {
    color: '#e53935',
    fontSize: 13,
    marginBottom: 2,
  },
  reportLocation: {
    color: '#666',
    fontSize: 12,
  },
  reportStatusContainer: {
    backgroundColor: '#f7b84b',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 10,
  },
  reportStatus: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
});

export default Dashboard; 