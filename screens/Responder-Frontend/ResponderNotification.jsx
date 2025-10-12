import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';

const ResponderNotification = ({ navigation, notifications = [] }) => {
  return (
    <View style={styles.notificationContainer}>
      {/* Header */}
      <NewHeader navigation={navigation} />

      {/* Title Row */}
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
      </View>

      {/* Notification container */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {notifications.length > 0 ? (
            <View style={styles.notificationsList}>
              {notifications.map((item) => (
                <View style={styles.notificationItem} key={item.id}>
                  <Text style={styles.notificationText}>{item.message}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No notifications available</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <NewBottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
    position: 'relative',
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
    fontSize: 24,
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
  notificationText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
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

export default ResponderNotification;


