import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';

const ResponderEditProfile = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [employeeId] = useState('');
  const [role] = useState('Responder');
  const [team] = useState('');

  const handleSave = () => {
    // Backend integration can be added later
    // Use Alert if you want a popup; keeping silent save for consistency
    navigation.goBack();
  };

  const handleCancel = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <NewHeader navigation={navigation} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Row */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoBtnText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Full Name:</Text>
          <TextInput
            style={styles.textInput}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name"
            placeholderTextColor="#888"
          />

          {/* Row: Employee ID and Role */}
          <View style={styles.rowTwoCol}>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>Employee ID:</Text>
              <View style={styles.readonlyChip}>
                <Text style={styles.readonlyChipText}>{employeeId || '—'}</Text>
              </View>
              <Text style={styles.subtext}>Employee ID cannot be changed</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>Role:</Text>
              <View style={styles.readonlyChip}>
                <Text style={styles.readonlyChipText}>{role}</Text>
              </View>
              <Text style={styles.subtext}>Role cannot be changed</Text>
            </View>
          </View>

          {/* Team */}
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>Team:</Text>
            <View style={styles.readonlyChip}>
              <Text style={styles.readonlyChipText}>{team || '—'}</Text>
            </View>
            <Text style={styles.subtext}>Team cannot be changed</Text>
          </View>

          {/* Email */}
          <Text style={styles.fieldLabel}>Email:</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor="#888"
          />

          {/* Phone */}
          <Text style={styles.fieldLabel}>Phone:</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="+63xxxxxxxxxx"
            placeholderTextColor="#888"
          />

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleCancel}>
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


