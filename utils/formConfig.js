// Dynamic form configurations for the app
// This makes it easy to modify form fields, validation rules, and backend mappings

export const ID_OPTIONS = [
  { label: 'Select ID', value: '' },
  { label: 'Passport', value: 'passport' },
  { label: 'Driver\'s License', value: 'drivers_license' },
  { label: 'National ID', value: 'national_id' },
  { label: 'SSS ID', value: 'sss_id' },
  { label: 'GSIS ID', value: 'gsis_id' }
];

export const LOGIN_FORM_FIELDS = [
  {
    key: 'email',
    label: 'Email',
    placeholder: 'Email',
    type: 'email',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    secureTextEntry: false,
    validation: {
      required: true,
      email: true
    }
  },
  {
    key: 'password',
    label: 'Password',
    placeholder: 'Password',
    type: 'password',
    keyboardType: 'default',
    autoCapitalize: 'none',
    secureTextEntry: true,
    validation: {
      required: true,
      minLength: 6
    }
  }
];

export const REGISTRATION_FORM_FIELDS = [
  // Personal Information Row 1
  {
    key: 'surname',
    label: 'Surname',
    placeholder: 'Surname',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'words',
    secureTextEntry: false,
    row: 1,
    flex: 1,
    marginRight: 5,
    validation: {
      required: true,
      minLength: 2
    }
  },
  {
    key: 'firstName',
    label: 'First name',
    placeholder: 'First name',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'words',
    secureTextEntry: false,
    row: 1,
    flex: 1,
    marginLeft: 5,
    validation: {
      required: true,
      minLength: 2
    }
  },
  // Contact Information Row 2
  {
    key: 'contact',
    label: 'Contact',
    placeholder: 'Contact',
    type: 'text',
    keyboardType: 'phone-pad',
    autoCapitalize: 'none',
    secureTextEntry: false,
    row: 2,
    flex: 1,
    marginRight: 5,
    validation: {
      required: true,
      phone: true
    }
  },
  {
    key: 'dob',
    label: 'Date of Birth',
    placeholder: 'Date of Birth',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'none',
    secureTextEntry: false,
    row: 2,
    flex: 1,
    marginLeft: 5,
    validation: {
      required: true,
      date: true
    }
  },
  // Address Row 3
  {
    key: 'houseNo',
    label: 'House No.',
    placeholder: 'House No.',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'none',
    secureTextEntry: false,
    row: 3,
    flex: 1,
    marginRight: 5,
    validation: {
      required: true
    }
  },
  {
    key: 'street',
    label: 'Street',
    placeholder: 'Street',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'words',
    secureTextEntry: false,
    row: 3,
    flex: 1,
    marginHorizontal: 2.5,
    validation: {
      required: true
    }
  },
  {
    key: 'barangay',
    label: 'Barangay',
    placeholder: 'Barangay',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'words',
    secureTextEntry: false,
    row: 3,
    flex: 1,
    marginLeft: 5,
    validation: {
      required: true
    }
  },
  // Address Row 4
  {
    key: 'city',
    label: 'City',
    placeholder: 'City',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'words',
    secureTextEntry: false,
    row: 4,
    flex: 1,
    marginRight: 5,
    validation: {
      required: true
    }
  },
  {
    key: 'province',
    label: 'Province',
    placeholder: 'Province',
    type: 'text',
    keyboardType: 'default',
    autoCapitalize: 'words',
    secureTextEntry: false,
    row: 4,
    flex: 1,
    marginLeft: 5,
    validation: {
      required: true
    }
  },
  // Account Information - Full Width
  {
    key: 'email',
    label: 'Email',
    placeholder: 'Email',
    type: 'email',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    secureTextEntry: false,
    row: 5,
    fullWidth: true,
    validation: {
      required: true,
      email: true
    }
  },
  {
    key: 'password',
    label: 'Password',
    placeholder: 'Password',
    type: 'password',
    keyboardType: 'default',
    autoCapitalize: 'none',
    secureTextEntry: true,
    row: 6,
    fullWidth: true,
    validation: {
      required: true,
      minLength: 6
    }
  },
  {
    key: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Confirm Password',
    type: 'password',
    keyboardType: 'default',
    autoCapitalize: 'none',
    secureTextEntry: true,
    row: 7,
    fullWidth: true,
    validation: {
      required: true,
      matches: 'password'
    }
  }
];

export const ACTION_BUTTONS = {
  login: [
    {
      key: 'forgotPassword',
      text: 'Forgot password?',
      style: 'text',
      onPress: () => {}
    },
    {
      key: 'login',
      text: 'Login',
      style: 'primary',
      onPress: () => {}
    }
  ],
  registration: [
    {
      key: 'createAccount',
      text: 'Create Account',
      style: 'primary',
      onPress: () => {}
    }
  ]
};

// Navigation configuration
export const NAVIGATION_CONFIG = {
  initialRoute: 'Login',
  screenOptions: { 
    headerShown: false 
  },
  screens: [
    {
      name: 'Login',
      component: 'Login',
      options: {
        title: 'Login'
      }
    },
    // Responder screens
    {
      name: 'ResponderDashboard',
      component: 'ResponderDashboard',
      options: { title: 'Responder Dashboard' }
    },
    {
      name: 'ResponderEditProfile',
      component: 'ResponderEditProfile',
      options: { title: 'Responder Edit Profile' }
    },
    {
      name: 'ResponderNotification',
      component: 'ResponderNotification',
      options: { title: 'Responder Notification' }
    },
    {
      name: 'ResponderProfile',
      component: 'ResponderProfile',
      options: { title: 'Responder Profile' }
    },
    {
      name: 'ResponderReports',
      component: 'ResponderReports',
      options: { title: 'Responder Reports' }
    },
    {
      name: 'ResponderViewReport',
      component: 'ResponderViewReport',
      options: { title: 'Report Details' }
    },
    {
      name: 'Registration',
      component: 'Registration',
      options: {
        title: 'Registration'
      }
    },
    {
      name: 'Dashboard',
      component: 'Dashboard',
      options: {
        title: 'Dashboard'
      }
    },
    {
      name: 'Profile',
      component: 'Profile',
      options: {
        title: 'Profile'
      }
    },
    {
      name: 'Notification',
      component: 'Notification',
      options: {
        title: 'Notification'
      }
    },
    {
      name: 'Report',
      component: 'Report',
      options: {
        title: 'Report'
      }
    },
    {
      name: 'WitnessReport',
      component: 'WitnessReport',
      options: {
        title: 'Witness Report'
      }
    },
    {
      name: 'History',
      component: 'History',
      options: {
        title: 'History'
      }
    },
    {
      name: 'Announcement',
      component: 'Announcement',
      options: {
        title: 'Announcement'
      }
    },
    {
      name: 'EditProfile',
      component: 'EditProfile',
      options: {
        title: 'Edit Profile'
      }
    },
    {
      name: 'Call',
      component: 'Call',
      options: {
        title: 'Emergency Call'
      }
    },
    {
      name: 'Waiting',
      component: 'Waiting',
      options: {
        title: 'Waiting'
      }
    },
    {
      name: 'Arrived',
      component: 'Arrived',
      options: {
        title: 'Responder Arrived'
      }
    },
    {
      name: 'Complete',
      component: 'Complete',
      options: {
        title: 'Emergency Complete'
      }
    },
    {
      name: 'EmergencyTips',
      component: 'EmergencyTips',
      options: {
        title: 'Emergency Tips'
      }
    }
  ]
};

// Form validation functions
export const validateField = (value, validation) => {
  if (validation.required && (!value || value.trim() === '')) {
    return 'This field is required';
  }
  
  if (validation.minLength && value.length < validation.minLength) {
    return `Minimum length is ${validation.minLength} characters`;
  }
  
  if (validation.email && !/\S+@\S+\.\S+/.test(value)) {
    return 'Please enter a valid email address';
  }
  
  if (validation.phone && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
    return 'Please enter a valid phone number';
  }
  
  return null;
}; 