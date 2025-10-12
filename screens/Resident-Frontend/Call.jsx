import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import config from '../../utils/config';

const Call = ({ navigation, route }) => {
  const [incidentType, setIncidentType] = useState(route?.params?.incidentType || '');
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected, ended
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [echo, setEcho] = useState(null);
  const timerRef = useRef(null);

  // Setup Laravel Echo for realtime communication
useEffect(() => {
  const setupEcho = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user'); // make sure you save this on login
    const user = userData ? JSON.parse(userData) : null;

    if (!token || !user) {
      console.warn('Missing token or user for Echo');
      return;
    }

    window.Pusher = Pusher;
    const echoInstance = new Echo({
      broadcaster: 'pusher',
      key: process.env.EXPO_PUBLIC_ABLY_KEY || 'Z7uLMg.REYhzw:hof5nkSunzzn7bPHjogkZ47jPiSHlAZwZ1Sm5gIFxUU',
      wsHost: 'realtime-pusher.ably.io',
      wsPort: 443,
      wssPort: 443,
      forceTLS: true,
      disableStats: true,
      cluster: 'mt1',
      authEndpoint: `${config.API_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    });

    setEcho(echoInstance);

    // 🔥 Listen to private resident channel (for this logged-in user)
    echoInstance.private(`resident.${user.id}`)
      .listen('.CallAccepted', (data) => {
        console.log('Call accepted:', data);
        setCallStatus('connected');
        Alert.alert('Call Accepted', 'Dispatcher has joined the call!');
        startCallTimer();
      })
      .listen('.CallEnded', (data) => {
        console.log('Call ended:', data);
        handleEndCall();
        Alert.alert('Call Ended', 'Dispatcher has ended the call.');
      });
  };

  setupEcho();

  return () => {
    if (echo) echo.disconnect();
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);


   2

  const handleEndCall = async () => {
    try {
      if (callStatus !== 'connected' && callStatus !== 'calling') return;

      const token = await AsyncStorage.getItem('token');
      await fetch(`${config.API_BASE_URL}/api/emergency-call/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          duration: callDuration,
          endTime: new Date().toISOString(),
        }),
      });

      setCallStatus('ended');
      clearInterval(timerRef.current);
      setCallDuration(0);

      setTimeout(() => {
        navigation.navigate('Waiting', {
          incidentType,
          callDuration,
          timestamp: new Date().toISOString(),
        });
      }, 2000);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const startCallTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.callContainer}>
      <View style={styles.contentScroll}>
        <View style={styles.callInterface}>
          <View style={styles.callMenu}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuDots}>⋮</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.callInfo}>
            <Text style={styles.callerName}>MDRRMO</Text>
            {callStatus === 'connected' && (
              <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
            )}
            {callStatus === 'calling' && (
              <Text style={styles.callStatusText}>Connecting...</Text>
            )}
            {callStatus === 'idle' && (
              <Text style={styles.callStatusText}>Ready to call</Text>
            )}
          </View>

          <View style={styles.callControls}>
            <View style={styles.singleControlRow}>
              <View style={styles.endCallWrapper}>
                <TouchableOpacity
                  style={[styles.endCallButton]}
                  onPress={callStatus === 'idle' ? handleStartCall : handleEndCall}
                >
                  <Image
                    source={require('../../assets/endcall.png')}
                    style={styles.controlImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={styles.controlLabel}>
                  {callStatus === 'idle' ? 'Start Call' : 'End Call'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  callContainer: {
    backgroundColor: '#1a237e',
    minHeight: '100%',
    position: 'relative',
  },
  contentScroll: {
    paddingTop: 40,
    paddingBottom: 60,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  callInterface: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  callMenu: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  menuButton: {
    padding: 10,
  },
  menuDots: {
    color: '#e53935',
    fontSize: 28,
    fontWeight: 'bold',
  },
  callInfo: {
    alignItems: 'center',
    marginBottom: 200,
  },
  callerName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  callDuration: {
    fontSize: 20,
    color: '#e3f2fd',
    fontFamily: 'monospace',
  },
  callStatusText: {
    fontSize: 18,
    color: '#e3f2fd',
    opacity: 0.8,
  },
  callControls: {
    width: '100%',
    gap: 30,
  },
  singleControlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  endCallWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  endCallButton: {
    backgroundColor: '#d6dbe6',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlImage: {
    width: 26,
    height: 26,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
    lineHeight: 14,
    marginTop: 10,
  },
});

export default Call;