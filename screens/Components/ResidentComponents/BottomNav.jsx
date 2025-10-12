import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const BottomNav = ({ navigation }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('History')}>
        <Image source={require('../../../assets/history.png')} 
          style={styles.navImg} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('Announcement')}>
        <Image source={require('../../../assets/announcement.png')} 
          style={styles.navImg} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navIcon}  onPress={() => navigation.navigate('Dashboard')}>
        <Image source={require('../../../assets/home.png')} 
          style={styles.navImg} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('Report')}>
        <Image source={require('../../../assets/report.png')} 
          style={styles.navImg} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('Notification')}>
        <Image source={require('../../../assets/notification.png')} 
          style={styles.navImg} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1041BC',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 70, // Increased height for better visibility
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20, // Increased padding for better spacing
    paddingBottom: 10, // Added bottom padding for safe area
    zIndex: 1000, // Increased z-index to ensure it's on top
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8, // Android shadow
  },
  navIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8, // Added vertical padding for better touch area
  },
  navImg: {
    width: 26, // Slightly increased size
    height: 26,
    resizeMode: 'contain',
  },
});

export default BottomNav;
