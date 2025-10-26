import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, PermissionsAndroid } from 'react-native';
import RtcEngine, { ChannelProfile, ClientRole } from 'react-native-agora';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';
import endCallIcon from '../../assets/endcall.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Call({ navigation, route }) {
  const { incidentType, incidentId } = route.params || {};
  const [callStatus, setCallStatus] = useState('calling');
  const [callDuration, setCallDuration] = useState(0);
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);
  const [residentId, setResidentId] = useState(null);
  const [engine, setEngine] = useState(null);

  const timerRef = useRef(null);

  // 🧠 Load current user
  useEffect(() => {
    (async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      setResidentId(user?.id);
    })();
  }, []);

  // 🎙 Request microphone permission (Android)
  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
  }, []);

  // 🧩 Setup Agora engine
  const initAgoraEngine = async (appID) => {
    const agoraEngine = await RtcEngine.create(appID);
    await agoraEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await agoraEngine.setClientRole(ClientRole.Broadcaster);

    // Handle events
    agoraEngine.addListener('JoinChannelSuccess', () => {
      console.log('✅ Joined channel successfully');
      setCallStatus('connected');
    });

    agoraEngine.addListener('UserOffline', () => {
      console.log('🚪 Dispatcher left the call');
      handleCallEnded();
    });

    setEngine(agoraEngine);
    return agoraEngine;
  };

  // 🔄 Poll API for call acceptance
  useEffect(() => {
    let interval;
    if (callStatus === 'calling') {
      interval = setInterval(async () => {
        try {
          const res = await apiFetch(`${config.API_BASE_URL}/api/incidents/${incidentId}/status`);
          if (res.status === 'accepted') {
            clearInterval(interval);
            handleCallAccepted(res.agora);
          } else if (res.status === 'ended') {
            clearInterval(interval);
            handleCallEnded();
          }
        } catch (err) {
          console.log('Status check error:', err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // 🎧 When dispatcher accepts call
  const handleCallAccepted = async (agoraData) => {
    try {
      setCallStatus('connecting');
      const { appID, token, channelName, uid } = agoraData;
      if (!appID || !channelName || uid == null) {
        Alert.alert('Call Error', 'Missing Agora connection info.');
        return;
      }

      const agoraEngine = await initAgoraEngine(appID);
      await agoraEngine.joinChannel(token, channelName, null, uid);
      console.log('🎙 Joined Agora voice channel');
    } catch (err) {
      console.error('Agora connect error:', err);
      Alert.alert('Error', 'Failed to connect audio.');
    }
  };

  // ⏱ Timer
  useEffect(() => {
    if (callStatus === 'connected') startTimer();
    else clearTimer();
    return () => clearTimer();
  }, [callStatus]);

  const startTimer = () => {
    clearTimer();
    timerRef.current = setInterval(() => setCallDuration((p) => p + 1), 1000);
  };
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 🚪 End call manually
  const handleEndCall = async () => {
    try {
      await apiFetch(`${config.API_BASE_URL}/api/incidents/calls/${incidentId}/end`, {
        method: 'POST',
        body: JSON.stringify({ endedBy: residentId }),
      });
    } catch (err) {
      console.warn('Failed to notify backend:', err);
    }

    await cleanupAgora();
    setCallStatus('ended');
  };

  // 🧹 Clean up Agora
  const cleanupAgora = async () => {
    if (engine) {
      await engine.leaveChannel();
      engine.destroy();
      setEngine(null);
    }
  };

  const handleCallEnded = async () => {
    await cleanupAgora();
    setCallStatus('ended');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MDRRMO</Text>
      {callStatus === 'calling' && <Text style={styles.status}>Calling...</Text>}
      {callStatus === 'connected' && <Text style={styles.timer}>{formatTime(callDuration)}</Text>}
      {callStatus === 'ended' && <Text style={styles.status}>Call Ended</Text>}

      {callStatus !== 'ended' && (
        <TouchableOpacity style={styles.endButton} onPress={handleEndCall}>
          <Image source={endCallIcon} style={styles.endIcon} />
          <Text style={styles.endText}>End Call</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showUnansweredModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Call Unanswered</Text>
            <Text style={styles.modalText}>
              The dispatcher failed to accept your call. You can try again or wait for updates.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.primary]}
                onPress={() => {
                  setShowUnansweredModal(false);
                  navigation.navigate('Report');
                }}
              >
                <Text style={styles.modalButtonText}>Call Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.secondary]}
                onPress={() => {
                  setShowUnansweredModal(false);
                  navigation.navigate('Dashboard');
                }}
              >
                <Text style={styles.modalButtonText}>Wait for Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  callContainer: {
    flex: 1,
    backgroundColor: '#25597c',
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
  controlButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  controlIcon: {
    backgroundColor: '#d6dbe6',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlImg: {
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