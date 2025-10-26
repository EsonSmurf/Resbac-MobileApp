import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Image, Alert, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';

const DEFAULT_PROFILE = "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg";

const ResponderEditProfile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [team, setTeam] = useState('');
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [role] = useState('Responder');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (!userJson) throw new Error('No user found in storage');
        const user = JSON.parse(userJson);
        setId(user.id);

        const data = await apiFetch(`${config.API_BASE_URL}/api/responders/${user.id}`);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setPhone(data.contact_num || '');
        setAddress(data.address || '');
        setTeam(data.team || '-');
        setProfileImage(
          data.profile_image_url 
            ? (data.profile_image_url.startsWith('http') 
              ? data.profile_image_url 
              : `${config.API_BASE_URL}${data.profile_image_url}`)
            : DEFAULT_PROFILE
        );
      } catch (err) {
        console.error('Failed to load responder:', err);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'You must grant permission to access photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setSelectedFile(uri);
      setProfileImage(uri);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = { 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        contact_num: phone, 
        address 
      };

      const token = await AsyncStorage.getItem('token');

      const res = await fetch(`${config.API_BASE_URL}/api/responders/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to update profile');
      }

      if (selectedFile) {
        const formData = new FormData();
        const filename = selectedFile.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
          uri: selectedFile,
          name: filename,
          type,
        });

        const uploadRes = await fetch(`${config.API_BASE_URL}/api/responders/profile-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          console.error('Image upload failed:', errorText);
          throw new Error('Image upload failed');
        }
      }

      // Update local user cache
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, ...updatedData, profile_image_url: profileImage };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3563e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NewHeader navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: profileImage }}
            style={styles.avatarImg}
            onError={() => setProfileImage(DEFAULT_PROFILE)}
          />
          <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
            <Text style={styles.changePhotoBtnText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>First Name:</Text>
          <TextInput style={styles.textInput} value={firstName} onChangeText={setFirstName} />

          <Text style={styles.fieldLabel}>Last Name:</Text>
          <TextInput style={styles.textInput} value={lastName} onChangeText={setLastName} />

          <Text style={styles.fieldLabel}>Address:</Text>
          <TextInput style={styles.textInput} value={address} onChangeText={setAddress} />

          <Text style={styles.fieldLabel}>Phone:</Text>
          <TextInput style={styles.textInput} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

          <Text style={styles.fieldLabel}>Email:</Text>
          <TextInput style={styles.textInput} keyboardType="email-address" value={email} onChangeText={setEmail} />

          <Text style={styles.fieldLabel}>Team:</Text>
          <View style={styles.readonlyChip}><Text>{team}</Text></View>

          <Text style={styles.fieldLabel}>Role:</Text>
          <View style={styles.readonlyChip}><Text>{role}</Text></View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => navigation.goBack()}>
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSave}>
              <Text style={styles.btnPrimaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <NewBottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  content: {
    paddingBottom: 100,
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
    marginRight: 8,
    padding: 4,
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    padding: 16,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e9eef9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  changePhotoBtn: {
    backgroundColor: '#3563e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  changePhotoBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 90,
    padding: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginTop: 12,
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#b3c6e0',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#222',
  },
  rowTwoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  readonlyChip: {
    backgroundColor: '#eef2fb',
    borderWidth: 1,
    borderColor: '#d6e0ff',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  readonlyChipText: {
    color: '#666',
    fontSize: 14,
  },
  subtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#e6e6e6',
  },
  btnSecondaryText: {
    color: '#333',
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: '#1f4ed8',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ResponderEditProfile;


