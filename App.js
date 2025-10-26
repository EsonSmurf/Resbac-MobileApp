import { StatusBar } from 'expo-status-bar';
import NavigationListener from "./utils/NavigationListener";
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { requestNotificationPermissions, createNotificationChannel } from './utils/expoNotification';
import Login from './screens/LoginScreen/Login';
import Registration from './screens/Resident-Frontend/Registration';
import ForgotPassword from './screens/LoginScreen/ForgotPassword';

import Dashboard from './screens/Resident-Frontend/Dashboard';
import Profile from './screens/Resident-Frontend/Profile';
import Notification from './screens/Resident-Frontend/Notification';
import Report from './screens/Resident-Frontend/Report';
import WitnessReport from './screens/Resident-Frontend/WitnessReport';
import History from './screens/Resident-Frontend/History';
import Announcement from './screens/Resident-Frontend/Announcement';
import EditProfile from './screens/Resident-Frontend/EditProfile';
import Call from './screens/Resident-Frontend/Call';
import Waiting from './screens/Resident-Frontend/Waiting';
import Arrived from './screens/Resident-Frontend/Arrived';
import Complete from './screens/Resident-Frontend/Complete';
import EmergencyTips from './screens/Resident-Frontend/EmergencyTips';
// Responder screens
import ResponderDashboard from './screens/Responder-Frontend/ResponderDashboard';
import ResponderEditProfile from './screens/Responder-Frontend/ResponderEditProfile';
import ResponderNotification from './screens/Responder-Frontend/ResponderNotification';
import ResponderProfile from './screens/Responder-Frontend/ResponderProfile';
import ResponderReports from './screens/Responder-Frontend/ResponderReports';
import ResponderViewReport from './screens/Responder-Frontend/ResponderViewReport';
import { NAVIGATION_CONFIG } from './utils/formConfig';
import React from 'react';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const Stack = createNativeStackNavigator();

  // Initialize notifications
  React.useEffect(() => {
    const initializeNotifications = async () => {
      await requestNotificationPermissions();
      await createNotificationChannel();
    };
    
    initializeNotifications();
  }, []);

  // Component mapping for dynamic navigation
  const componentMap = {
    'Login': Login,
    'Registration': Registration,
    'Dashboard': Dashboard,
    'Profile': Profile,
    'Notification': Notification,
    'Report': Report,
    'WitnessReport': WitnessReport,
    'History': History,
    'Announcement': Announcement,
    'EditProfile': EditProfile,
    'Call': Call,
    'Waiting': Waiting,
    'Arrived': Arrived,
    'Complete': Complete,
    'EmergencyTips': EmergencyTips,
    // Responder mappings
    'ResponderDashboard': ResponderDashboard,
    'ResponderEditProfile': ResponderEditProfile,
    'ResponderNotification': ResponderNotification,
    'ResponderProfile': ResponderProfile,
    'ResponderReports': ResponderReports,
    'ResponderViewReport': ResponderViewReport
  };

  return (
    <NavigationContainer>
       <NavigationListener />
       
      <Stack.Navigator 
        initialRouteName={NAVIGATION_CONFIG.initialRoute} 
        screenOptions={NAVIGATION_CONFIG.screenOptions}
      >
        {NAVIGATION_CONFIG.screens.map((screen) => (
          <Stack.Screen 
            key={screen.name}
            name={screen.name} 
            component={componentMap[screen.component]}
            options={screen.options}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
