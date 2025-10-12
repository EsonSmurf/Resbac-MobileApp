import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const NewHeader = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft} />
      <TouchableOpacity style={styles.accountButton} onPress={() => navigation.navigate('ResponderProfile')}>
        <View style={styles.avatar}>
          <Image source={require('../../../assets/user.png')} style={styles.avatarImage} resizeMode="cover" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1041BC',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flex: 1,
  },
  accountButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
});

export default NewHeader;


