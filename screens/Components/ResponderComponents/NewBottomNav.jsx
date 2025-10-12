import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const NewBottomNav = ({ navigation }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('ResponderReports')}>
        <Image source={require('../../../assets/report.png')} style={styles.navImg} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('ResponderDashboard')}>
        <Image source={require('../../../assets/home.png')} style={styles.navImg} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('ResponderNotification')}>
        <Image source={require('../../../assets/notification.png')} style={styles.navImg} />
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
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  navImg: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: 'white',
    opacity: 0.9,
  },
});

export default NewBottomNav;


