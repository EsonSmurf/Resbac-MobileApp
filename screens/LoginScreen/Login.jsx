import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ImageBackground, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from '../../utils/config.js';
import { LOGIN_FORM_FIELDS, ACTION_BUTTONS } from '../../utils/formConfig.js';
// removed encryption import - we send plain password now
import { apiFetch } from '../../utils/apiFetch.js';

export default function Login({ navigation }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

const handleSubmit = async () => {
  // basic validation
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);

  try {
    console.log('Attempting login with', formData.email);

    // --- SEND PLAIN EMAIL + PASSWORD (no encryption) ---
   const data = await apiFetch(`${config.API_BASE_URL}/api/login`, {

      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    console.log('Login response:', data);

    // Save token & user
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      console.log('Token saved');
    } else {
      console.warn('Login response missing token', data);
    }

    // pending-residency check
    if (data.user && data.user.role_id === 4 && data.user.residency_status === 'pending') {
      Alert.alert('Pending Approval', 'Your residency is still pending approval.');
      setIsLoading(false);
      return;
    }

    // ✅ Updated role-to-screen mapping
    const roleRoutes = {
      1: 'Dashboard',          // Admin → for now just go to Dashboard
      2: 'Dashboard',          // Dispatcher → also Dashboard (unless you add DispatcherDashboard later)
      3: 'ResponderDashboard', // Responder
      4: 'Dashboard',          // Resident
    };

    navigation.navigate((data.user && roleRoutes[data.user.role_id]) || 'Dashboard');

  } catch (error) {
    console.error('Login Error:', error);
    Alert.alert('Login Failed', error.message || 'Something went wrong');
  } finally {
    setIsLoading(false);
  }
};

  const backgroundImage = require('../../assets/background.jpg');
  const logoImage = require('../../assets/logo.jpg');

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Image source={logoImage} style={styles.logo} />
        <View style={styles.formContainer}>
          <Text style={styles.title}>LOGIN</Text>

          {/* Form Fields */}
          {LOGIN_FORM_FIELDS.map((field) => (
            <View key={field.key} style={styles.fieldContainer}>
              <TextInput
                style={[styles.input, errors[field.key] && styles.inputError]}
                placeholder={field.placeholder}
                placeholderTextColor="#888"
                value={formData[field.key]}
                onChangeText={(value) => handleInputChange(field.key, value)}
                keyboardType={field.keyboardType}
                autoCapitalize={field.autoCapitalize}
                secureTextEntry={field.secureTextEntry}
                editable={!isLoading}
              />
              {errors[field.key] && <Text style={styles.errorText}>{errors[field.key]}</Text>}
            </View>
          ))}

          {/* Buttons */}
          {ACTION_BUTTONS.login.map((button) => (
            <TouchableOpacity
              key={button.key}
              style={[
                styles.button,
                button.style === 'primary' ? styles.primaryButton : styles.textButton,
                isLoading && styles.disabledButton
              ]}
              onPress={button.key === 'login' ? handleSubmit : button.onPress}
              disabled={isLoading}
            >
              <Text style={[
                styles.buttonText,
                button.style === 'primary' ? styles.primaryButtonText : styles.textButtonText,
                isLoading && styles.disabledButtonText
              ]}>
                {isLoading ? 'Logging in...' : button.text}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account yet?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')} disabled={isLoading}>
              <Text style={styles.signupLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 30,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 25,
    marginTop: 40,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    width: '100%',
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#0a2c6b',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  textButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    width: 'auto',
    height: 'auto',
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  primaryButtonText: {
    color: '#fff',
  },
  disabledButtonText: {
    color: '#666',
  },
  textButtonText: {
    color: '#222',
    fontSize: 13,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#222',
    fontSize: 14,
  },
  signupLink: {
    color: '#0a2c6b',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  frontendNoticeContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  frontendNoticeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
    textAlign: 'center',
  },
  frontendNoticeText: {
    fontSize: 12,
    color: '#2e7d32',
    textAlign: 'center',
    lineHeight: 16,
  },

});
