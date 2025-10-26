import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';
import { getEcho } from '../../utils/echo'; // keep this if you're using realtime

const Dashboard = ({ navigation }) => {
  const [data, setData] = useState({
    user: { name: '', address: '', avatar: null },
    emergencyTips: 'Show',
    publicAnnouncements: [],
    recentReports: [],
  });
  const [locationName, setLocationName] = useState('Loading...');
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await apiFetch(`${config.API_BASE_URL}/api/resident/reports`);
        setData(prev => ({ ...prev, recentReports: reports }));
        if (reports.length > 0) setLocationName('Current Location');
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      }
    };

    const fetchLatestAnnouncement = async () => {
      try {
        const announcements = await apiFetch(`${config.API_BASE_URL}/api/resident/announcements`);
        if (announcements.length > 0) setLatestAnnouncement(announcements[0]);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      }
    };

    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          navigation.navigate('Login');
          return;
        }
        const user = JSON.parse(userData);

        // 🧩 Use stored user data instead of calling /api/residents/profile
        setData(prev => ({
          ...prev,
          user: {
            name: `${user.first_name} ${user.last_name}`,
            address: user.address || 'No address found',
            avatar: null,
          },
        }));
      } catch (err) {
        console.error('User data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    fetchLatestAnnouncement();
    loadUserData();

    // Optional: Setup real-time listener (if you use Echo)
    const setupEcho = async () => {
      try {
        const echo = await getEcho();
        echo.channel('public-announcements')
          .listen('NewAnnouncement', (event) => {
            console.log('📢 New announcement:', event);
            setLatestAnnouncement(event.announcement);
          });

        echo.channel('resident-reports')
          .listen('ReportUpdated', (event) => {
            console.log('📡 Report updated:', event);
            fetchReports(); // refresh automatically
          });
      } catch (e) {
        console.log('Echo setup failed:', e.message);
      }
    };

    setupEcho();
  }, []);

  const getStatusClass = (status = '') =>
    `report-status ${status.toLowerCase().replace(/\s+/g, '-')}`;

  if (loading) {
    return (
      <View style={styles.dashboardContainer}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e53935" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
        <BottomNav navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.dashboardContainer}>
      <Header navigation={navigation} />

      <ScrollView style={styles.scrollView}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.leftSide}>
            <Text style={styles.welcome}>Welcome back!</Text>
            <Text style={styles.name}>{data.user.name || 'User'}</Text>
            <Text style={styles.address}>{data.user.address || ''}</Text>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity style={styles.tipsButton} onPress={() => navigation.navigate('EmergencyTips')}>
              <Text style={styles.tipsButtonText}>Emergency Tips</Text>
              <View style={styles.tipsShowButton}>
                <Text style={styles.tipsShowButtonText}>{data.emergencyTips}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SOS Section */}
        <View style={styles.sosSection}>
          <Text style={styles.sosTitle}>Are you in an Emergency?</Text>
          <Text style={styles.sosSubtitle}>Press the button to report an emergency.</Text>
          <TouchableOpacity style={styles.sosButton} onPress={() => navigation.navigate('Report')}>
            <View style={styles.sosOuterCircle}>
              <View style={styles.sosInnerCircle}>
                <Text style={styles.sosText}>SOS</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Public Announcements */}
        <Text style={styles.sectionTitle}>Latest Announcement</Text>
        {latestAnnouncement ? (
          <View style={styles.announcementCard}>
            <Text style={styles.announcementTitle}>{latestAnnouncement.title}</Text>
            <Text style={styles.announcementDate}>
              {new Date(latestAnnouncement.posted_at).toLocaleString()}
            </Text>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No announcements available</Text>
          </View>
        )}

        {/* Recent Reports */}
        <Text style={styles.sectionTitle}>My Recent Report</Text>
        {data.recentReports.length > 0 ? (
          (() => {
            const item = data.recentReports[0];
            return (
              <TouchableOpacity
                style={styles.reportCard}
                key={item.id}
                onPress={() => navigation.navigate('Waiting', { emergencyReport: item })}
              >
                <View style={styles.reportInfo}>
                  <Text style={styles.reportDate}>{item.date}</Text>
                  <Text style={styles.reportType}>
                    Incident Type: <Text style={{ fontWeight: 'bold' }}>{item.type}</Text>
                  </Text>
                  <Text style={styles.reportLocation}>{locationName}</Text>
                </View>
                <View style={styles.reportStatusContainer}>
                  <Text style={[styles.reportStatus, { backgroundColor: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })()
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recent reports</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending': return '#f7b84b';
    case 'in progress': return '#4CAF50';
    case 'completed': return '#2196F3';
    case 'cancelled': return '#f44336';
    default: return '#f7b84b';
  }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  leftSide: { flex: 1 },
  rightSide: { alignItems: 'flex-end' },
  welcome: { fontSize: 18, fontWeight: '600', color: '#222', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  address: { fontSize: 12, color: '#666', marginBottom: 8 },
  tipsButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  tipsButtonText: { fontSize: 14, color: '#222', marginRight: 8 },
  tipsShowButton: { backgroundColor: '#e53935', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4 },
  tipsShowButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
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
  sosTitle: { fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 2 },
  sosSubtitle: { fontSize: 12, color: '#888', marginBottom: 10 },
  sosButton: { alignItems: 'center', justifyContent: 'center', marginTop: 8 },
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
  sosText: { color: '#fff', fontWeight: 'bold', fontSize: 36, letterSpacing: 2 },
  sectionTitle: { fontWeight: 'bold', fontSize: 15, marginTop: 10, marginBottom: 4, color: '#222', marginLeft: 16 },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
  },
  announcementTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#222' },
  announcementDate: { fontSize: 12, color: '#666' },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  reportInfo: { flex: 1 },
  reportDate: { color: '#222', fontSize: 13, marginBottom: 2 },
  reportType: { color: '#e53935', fontSize: 13, marginBottom: 2 },
  reportLocation: { color: '#666', fontSize: 12 },
  reportStatusContainer: { marginLeft: 10 },
  reportStatus: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, color: '#fff', fontWeight: 'bold', fontSize: 13 },
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
  emptyText: { color: '#888', fontSize: 14 },
});

export default Dashboard;
