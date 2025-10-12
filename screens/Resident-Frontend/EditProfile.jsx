import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Dimensions } from 'react-native';
import Header from '../Components/ResidentComponents/Header';
import BottomNav from '../Components/ResidentComponents/BottomNav';

const { width } = Dimensions.get('window');

const EditProfile = ({ navigation }) => {
  const userAvatar = require('../../assets/user.png');
  const backButtonImg = require('../../assets/backbutton.png');

  // State for form fields (empty, backend-ready)
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [userId] = useState(''); // User ID is disabled and empty
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');

  // Placeholder save handler (backend logic to be added)
  const handleSave = () => {
    // TODO: Integrate with backend
    navigation.goBack();
  };

  return (
    <View style={styles.editProfileContainer}>
      {/* Header */}
      <Header navigation={navigation} />
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
        {/* Title row with back button and Edit Profile text */}
        <View style={styles.titleRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={backButtonImg} style={styles.backButtonImg} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        
        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.profileAvatar}>
            <Image source={userAvatar} style={styles.avatarImage} />
          </View>
          <Text style={styles.profileName}>{fullName || ' '}</Text>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
        
        {/* Form Card (nested container like responder screen) */}
        <View style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
            />

            <Text style={styles.label}>Address:</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
            />

            <Text style={styles.label}>User ID:</Text>
            <TextInput
              style={styles.inputDisabled}
              value={userId}
              editable={false}
              placeholder="User ID"
            />
            <Text style={styles.inputNote}>User ID cannot be changed</Text>

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.phoneAgeRow}>
              <View style={styles.phoneField}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.ageField}>
                <Text style={styles.label}>Age:</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          {/* Buttons inside the form card */}
          <View style={styles.buttonRowCard}>
            <TouchableOpacity style={[styles.btn, styles.btnSmall, styles.cancel]} onPress={() => navigation.goBack()}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSmall, styles.save]} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        
      </ScrollView>
      
      {/* BOTTOM NAVIGATION */}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  editProfileContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 18,
    marginHorizontal: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
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
    margin: 0,
  },
  avatarCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#e9ecef',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#222',
    margin: 0,
  },
  changePhotoBtn: {
    backgroundColor: '#1041BC',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
  },
  changePhotoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  formGroup: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b3c6e0',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  inputDisabled: {
    backgroundColor: '#eee',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#888',
  },
  inputNote: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 2,
    margin: 0,
  },
  phoneAgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneField: {
    flex: 1,
    marginRight: 8,
  },
  ageField: {
    flex: 0.3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 50,
  },
  buttonRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btn: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: {
    minWidth: 0,
    flex: 1,
    marginHorizontal: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  save: {
    backgroundColor: '#1041BC',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cancel: {
    backgroundColor: '#e53935',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default EditProfile; 