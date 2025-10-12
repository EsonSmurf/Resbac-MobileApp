import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const Profile = ({ navigation }) => {
  const backButtonImg = require('../../assets/backbutton.png');

  // State for toggling password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  // Placeholder handler for password update (backend ready)
  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // TODO: Integrate with backend
    Alert.alert('Success', 'Password updated!');
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.profileContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonImg} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* First Container: Avatar, Name, Edit Profile */}
        <View style={styles.topContainer}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.profileName}>User Name</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Second Container: Basic Information or Password Form */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderIcon}>i</Text>
            <Text style={styles.infoHeaderText}> Basic Information</Text>
          </View>
          
          {!showPasswordForm ? (
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name:</Text>
                <Text style={styles.infoValue}>-</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>-</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>User ID:</Text>
                <Text style={styles.infoValue}>-</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>-</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>-</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>-</Text>
              </View>
            </View>
          ) : (
            <View style={styles.passwordFormContainer}>
              <Text style={styles.resetPasswordTitle}>Reset Password</Text>
              <Text style={styles.label}>Current Password:</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current Password"
                secureTextEntry
                placeholderTextColor="#999"
              />
              <Text style={styles.label}>New Password:</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                secureTextEntry
                placeholderTextColor="#999"
              />
              <Text style={styles.label}>Confirm Password:</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handlePasswordUpdate}>
                <Text style={styles.saveBtnText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPasswordForm(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Show Change Password and Logout buttons only when not in password form */}
        {!showPasswordForm && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.changePasswordBtn} onPress={() => setShowPasswordForm(true)}>
              <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    margin: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  topContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b3c6e0',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#eee',
  },
  avatarText: {
    fontSize: 48,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    margin: 0,
  },
  editProfileText: {
    color: '#1041BC',
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: '#b3c6e0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1041BC',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: -18,
    marginTop: -18,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  infoHeaderIcon: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6,
  },
  infoHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoContent: {
    // Container for info rows
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#222',
    width: 90,
    flexShrink: 0,
  },
  infoValue: {
    color: '#222',
    flex: 1,
    flexWrap: 'wrap',
  },
  passwordFormContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginTop: 4,
  },
  resetPasswordTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
    margin: 0,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#1041BC',
    borderRadius: 8,
    paddingHorizontal: 36,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#888',
    borderRadius: 8,
    paddingHorizontal: 36,
    paddingVertical: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  actionButtons: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  changePasswordBtn: {
    backgroundColor: '#2ecc40',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 14,
  },
  changePasswordText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#e53935',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile; 