import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Platform, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { REGISTRATION_FORM_FIELDS, ID_OPTIONS, ACTION_BUTTONS, validateField } from '../../utils/formConfig';

export default function Registration({ navigation }) {
  const [formData, setFormData] = useState({
    selectedId: '',
    idImage: null,
    surname: '',
    firstName: '',
    contact: '',
    dob: '',
    houseNo: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const backgroundImage = require('../../assets/background.jpg');
  const logoImage = require('../../assets/logo.jpg');

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        idImage: result.assets[0].uri
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const newErrors = {};
    
    // Validate all fields
    REGISTRATION_FORM_FIELDS.forEach(field => {
      const error = validateField(formData[field.key], field.validation);
      if (error) {
        newErrors[field.key] = error;
      }
    });

    // Additional validation for password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Backend/API logic removed. You can add local success logic here if needed.
    // Example: set a local success message or navigate to another screen.
    // For now, just log success.
    console.log('Registration successful (local only).');
  };

  // Group fields by row
  const groupFieldsByRow = () => {
    const grouped = {};
    REGISTRATION_FORM_FIELDS.forEach(field => {
      if (!grouped[field.row]) {
        grouped[field.row] = [];
      }
      grouped[field.row].push(field);
    });
    return grouped;
  };

  const groupedFields = groupFieldsByRow();

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <Image source={logoImage} style={styles.logo} />
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.formScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>SIGN UP</Text>
            
            {/* ID Selection and Upload Row */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text style={styles.label}>Select ID</Text>
                {Platform.OS === 'android' ? (
                  <Picker
                    selectedValue={formData.selectedId}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleInputChange('selectedId', itemValue)}>
                    {ID_OPTIONS.map((option) => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="Select ID"
                    value={formData.selectedId}
                    onChangeText={(value) => handleInputChange('selectedId', value)}
                  />
                )}
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={styles.label}>Upload ID:</Text>
                <TouchableOpacity style={styles.uploadIdBox} onPress={handlePickImage}>
                  {formData.idImage ? (
                    <Image source={{ uri: formData.idImage }} style={styles.uploadedIdImage} />
                  ) : (
                    <Text style={styles.uploadIdIcon}>📷</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Dynamic form fields grouped by rows */}
            {Object.keys(groupedFields).map((rowKey) => {
              const rowFields = groupedFields[rowKey];
              return (
                <View key={rowKey} style={rowFields[0]?.fullWidth ? styles.fieldContainer : styles.row}>
                  {rowFields.map((field) => (
                    <View 
                      key={field.key} 
                      style={[
                        field.fullWidth ? styles.fieldContainer : { flex: field.flex },
                        field.marginRight && { marginRight: field.marginRight },
                        field.marginLeft && { marginLeft: field.marginLeft },
                        field.marginHorizontal && { marginHorizontal: field.marginHorizontal }
                      ]}
                    >
                      <Text style={styles.label}>{field.label}</Text>
                      <TextInput
                        style={[styles.input, errors[field.key] && styles.inputError]}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChangeText={(value) => handleInputChange(field.key, value)}
                        keyboardType={field.keyboardType}
                        autoCapitalize={field.autoCapitalize}
                        secureTextEntry={field.secureTextEntry}
                      />
                      {errors[field.key] && (
                        <Text style={styles.errorText}>{errors[field.key]}</Text>
                      )}
                    </View>
                  ))}
                </View>
              );
            })}

            {/* Dynamic action buttons */}
            {ACTION_BUTTONS.registration.map((button) => (
              <TouchableOpacity
                key={button.key}
                style={[
                  styles.button,
                  button.style === 'primary' ? styles.primaryButton : styles.textButton
                ]}
                onPress={button.key === 'createAccount' ? handleSubmit : button.onPress}
              >
                <Text style={[
                  styles.buttonText,
                  button.style === 'primary' ? styles.primaryButtonText : styles.textButtonText
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

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
    backgroundColor: 'transparent',
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 30,
    marginBottom: 0,
    alignSelf: 'flex-start',
    marginLeft: 20,
    zIndex: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 24,
    width: '100%',
    maxWidth: 600,
    minWidth: 340,
    minHeight: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  picker: {
    height: 45,
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0a2c6b',
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontSize: 18,
    color: '#222',
  },
  uploadIdBox: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  uploadIdIcon: {
    fontSize: 24,
    color: '#888',
  },
  uploadedIdImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 6,
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
    marginBottom: 5,
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
  textButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  primaryButtonText: {
    color: '#fff',
  },
  textButtonText: {
    color: '#222',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#222',
    fontSize: 14,
  },
  loginLink: {
    color: '#0a2c6b',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 14,
    color: '#222',
    marginBottom: 6,
    marginLeft: 2,
    fontWeight: '500',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 8,
  },
  formScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: Dimensions.get('window').height * 0.6,
    paddingTop: 32,
    paddingBottom: 24,
  },
}); 