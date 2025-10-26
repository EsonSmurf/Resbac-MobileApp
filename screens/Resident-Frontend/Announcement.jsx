import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';

const Announcement = ({ navigation }) => {
  const backButtonImg = require('../../assets/backbutton.png');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await apiFetch(`${config.API_BASE_URL}/api/resident/announcements`);
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <View style={styles.announcementContainer}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e53935" />
          <Text style={styles.loadingText}>Loading announcements...</Text>
        </View>
        <BottomNav navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.announcementContainer}>
      <Header navigation={navigation} />
      
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonImg} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Announcements</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {announcements.length === 0 ? (
          <View style={styles.cardContainer}>
            <View style={styles.announcementCard}>
              <Text style={styles.emptyText}>No announcements available.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {announcements.map((item) => (
              <View key={item.id} style={styles.announcementCard}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementContent}>{item.content}</Text>
                <Text style={styles.announcementPoster}>Posted by: {item.poster?.name || 'Admin'}</Text>
                <Text style={styles.announcementDate}>{new Date(item.posted_at).toLocaleString()}</Text>

                {item.images?.length > 0 && (
                  <View style={styles.announcementImageContainer}>
                    {item.images.map(img => (
                      <Image 
                        key={img.id} 
                        source={{ uri: `${config.API_BASE_URL}${img.file_path}` }} 
                        style={styles.announcementImg} 
                      />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  announcementContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    minHeight: '100%',
    position: 'relative',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
    marginLeft: 12,
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
  scrollView: {
    flex: 1,
    paddingBottom: 120,
    paddingTop: 0,
  },
  cardContainer: {
    paddingHorizontal: 16,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    alignItems: 'flex-start',
  },
  announcementTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#222',
  },
  announcementContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  announcementPoster: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  announcementDate: {
    color: '#222',
    fontSize: 14,
    marginTop: 2,
  },
  announcementImageContainer: {
    marginTop: 10,
    width: '100%',
  },
  announcementImg: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    width: '100%',
    marginVertical: 30,
  },
});

export default Announcement;