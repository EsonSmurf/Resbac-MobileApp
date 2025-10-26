import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../utils/config';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';

const DEFAULT_PROFILE =
  'https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg';

const ResponderProfile = ({ navigation }) => {
  const [responder, setResponder] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch responder profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        if (!storedUser || !token) {
          navigation.navigate('Login');
          return;
        }

        const { id } = JSON.parse(storedUser);
        const res = await fetch(`${config.API_BASE_URL}/api/responders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');

        setResponder(data);
        setProfileImage(data.profile_image_url || '');
      } catch (err) {
        console.error('Failed to fetch responder profile:', err);
        Alert.alert('Error', 'Unable to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Compute image URL
  const profileImageUrl =
    profileImage.startsWith('http') ||
    profileImage.startsWith('data:') ||
    profileImage.startsWith('blob:')
      ? profileImage
      : `${config.API_BASE_URL}${profileImage || ''}` || DEFAULT_PROFILE;

  // Logout function
  const handleLogout = async () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          try {
            await fetch(`${config.API_BASE_URL}/api/logout`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (err) {
            console.warn('Logout request failed:', err);
          } finally {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          }
        },
      },
    ]);
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${config.API_BASE_URL}/api/residents/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', data.message || 'Password updated successfully!');
        setShowPasswordForm(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <View style={[styles.profileContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1041BC" />
        <Text style={{ marginTop: 10, color: '#333' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.profileContainer}>
      <NewHeader navigation={navigation} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.profileTitleRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
          </TouchableOpacity>
          <Text style={styles.profileTitle}>Profile</Text>
        </View>

        {/* Top Info */}
        <View style={styles.topContainer}>
          <View style={styles.profileAvatar}>
            <Image
              source={{ uri: profileImageUrl }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
              onError={(e) => (e.nativeEvent.target.src = DEFAULT_PROFILE)}
            />
          </View>
          <Text style={styles.profileName}>
            {responder ? `${responder.first_name} ${responder.last_name}` : 'Loading...'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('ResponderEditProfile')}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoHeaderIcon}>i</Text>
            <Text style={styles.infoHeaderText}> Basic Information</Text>
          </View>

          {!showPasswordForm ? (
            <View style={styles.infoContent}>
              <InfoRow label="Full Name" value={`${responder?.first_name || ''} ${responder?.last_name || ''}`} />
              <InfoRow label="Role" value={responder?.role_name || '-'} />
              <InfoRow label="Team" value={`Team ${responder?.team || '-'}`} />
              <InfoRow label="Address" value={responder?.address || '-'} />
              <InfoRow label="Email" value={responder?.email || '-'} />
              <InfoRow label="Phone" value={responder?.contact_num || '-'} />
            </View>
          ) : (
            <View style={styles.passwordFormContainer}>
              <Text style={styles.resetPasswordTitle}>Reset Password</Text>
              <PasswordInput label="Current Password" value={currentPassword} onChange={setCurrentPassword} />
              <PasswordInput label="New Password" value={newPassword} onChange={setNewPassword} />
              <PasswordInput label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />

              <TouchableOpacity style={styles.saveBtn} onPress={handlePasswordUpdate}>
                <Text style={styles.saveBtnText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPasswordForm(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

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

      <NewBottomNav navigation={navigation} />
    </View>
  );
};

// Reusable small components
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const PasswordInput = ({ label, value, onChange }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={label}
      secureTextEntry
      placeholderTextColor="#999"
    />
  </>
);


const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    minHeight: '100%',
    position: 'relative',
  },
  profileTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    marginLeft: 16,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backButtonIcon: {
    fontSize: 28,
    color: '#222',
  },
  backButtonImg: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    margin: 0,
  },
  scrollContainer: {
    paddingBottom: 0,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  topContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
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
  avatarEmoji: {
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
    marginTop: 16,
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
    marginBottom: 120,
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

export default ResponderProfile;


