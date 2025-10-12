import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const Notification = ({ navigation, notifications = [] }) => {
  const backButtonImg = require('../../assets/backbutton.png');

  return (
    <View style={styles.notificationContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonImg} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
      </View>
      
      {/* Notification container */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {notifications.length > 0 ? (
            <View style={styles.notificationsList}>
              {notifications.map((item, index) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.notificationItem,
                    index === notifications.length - 1 && styles.notificationItemLast
                  ]}
                >
                  <Text style={styles.notificationText}>{item.message}</Text>
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No notifications available</Text>
          )}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#f7f8fa',
    minHeight: '100%',
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
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
    margin: 0,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    marginBottom: 8,
    minHeight: 300,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  notificationsList: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  notificationItemLast: {
    borderBottomWidth: 0,
  },
  notificationText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
    margin: 0,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    margin: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
    margin: 0,
  },
});

export default Notification; 