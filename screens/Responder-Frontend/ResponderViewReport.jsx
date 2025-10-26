import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Modal, 
  Pressable, 
  Image, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';
import { apiFetch } from '../../utils/apiFetch';
import config from '../../utils/config';
import { reverseGeocode } from '../../utils/hereApi';

const ResponderViewReport = ({ navigation, route }) => {
  const { report: routeReport } = route?.params || {};
  const [report, setReport] = useState(routeReport || null);
  const [status, setStatus] = useState('En Route');
  const [shareLocation, setShareLocation] = useState(true);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupType, setBackupType] = useState('');
  const [backupReason, setBackupReason] = useState('');
  const [showRequestSent, setShowRequestSent] = useState(false);
  const [responderLocation, setResponderLocation] = useState(null);
  const [arrived, setArrived] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  // Refs for location tracking
  const locationSubscriptionRef = useRef(null);
  const lastPublishedRef = useRef(0);
  const lastSentRef = useRef(null);

  // Fetch report details if not provided via route params
  useEffect(() => {
    if (!report && route?.params?.id) {
      const fetchReport = async () => {
        try {
          const data = await apiFetch(`${config.API_BASE_URL}/api/responder/report/${route.params.id}`);
          if (data.success) {
            setReport(data.report);
            setStatus(data.report.status === 'assigned' ? 'En Route' : data.report.status);

            if (data.report.latitude && data.report.longitude) {
              const address = await reverseGeocode(data.report.latitude, data.report.longitude);
              setResolvedAddress(address || 'Unknown Location');
            } else {
              setResolvedAddress('—');
            }
          } else {
            console.error('Failed to fetch report:', data);
            Alert.alert('Error', 'Failed to fetch report details');
          }
        } catch (err) {
          console.error('Failed to load report:', err);
          Alert.alert('Error', 'Failed to load report details');
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    } else if (report) {
      setLoading(false);
      if (report.latitude && report.longitude) {
        reverseGeocode(report.latitude, report.longitude).then(address => {
          setResolvedAddress(address || 'Unknown Location');
        });
      }
    }
  }, [report, route?.params?.id]);

  // Location tracking effect
  useEffect(() => {
    if (!report?.id || !shareLocation) return;

    let isActive = true;

    const startLocationTracking = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to track your position');
          return;
        }

        // Start watching position
        locationSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 3,
          },
          (location) => {
            if (!isActive) return;

            const newLocation = {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              accuracy: location.coords.accuracy,
              timestamp: location.timestamp,
            };

            setResponderLocation(newLocation);

            // Check if arrived at scene
            if (newLocation.accuracy <= 80 && report?.latitude && report?.longitude) {
              const distance = calculateDistance(
                { lat: newLocation.lat, lng: newLocation.lng },
                { lat: parseFloat(report.latitude), lng: parseFloat(report.longitude) }
              );

              if (distance <= 50 && report.status !== 'On Scene' && !arrived) {
                updateStatus('On Scene');
                setArrived(true);
              }
            }

            // Publish location (throttled)
            const now = Date.now();
            const last = lastSentRef.current;
            let shouldPublish = false;

            if (!last) {
              shouldPublish = true;
            } else {
              const moved = calculateDistance(last, newLocation);
              if (moved > 3) shouldPublish = true;
              if (Math.abs((last.acc || 0) - newLocation.accuracy) > 10) shouldPublish = true;
              if (now - lastPublishedRef.current >= 3000) shouldPublish = true;
            }

            if (shouldPublish) {
              publishLocation(newLocation);
            }
          }
        );
      } catch (error) {
        console.error('Location tracking error:', error);
      }
    };

    startLocationTracking();

    return () => {
      isActive = false;
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
    };
  }, [report?.id, shareLocation, arrived]);

  // Helper functions
  const calculateDistance = (a, b) => {
    if (!a || !b) return Infinity;
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDlat = Math.sin(dLat / 2) * Math.sin(dLat / 2);
    const sinDlon = Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon), Math.sqrt(1 - (sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon)));
    return R * c;
  };

  const publishLocation = async (loc) => {
    try {
      // Hook into your realtime channel if needed
      // e.g., Ably/Pusher publish. For now we log and throttle refs.
      console.log('Publishing location:', loc);
      lastPublishedRef.current = Date.now();
      lastSentRef.current = { lat: loc.lat, lng: loc.lng, acc: loc.accuracy, ts: Date.now() };
    } catch (err) {
      console.warn('Location publish failed:', err);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const statusToSend = newStatus === 'assigned' ? 'En Route' : newStatus;
      await apiFetch(`${config.API_BASE_URL}/api/responder/report/${report.id}/update-status`, {
        method: 'POST',
        body: JSON.stringify({ status: statusToSend })
      });

      setReport(prev => ({ ...prev, status: newStatus }));
      setStatus(newStatus);
      Alert.alert('Success', 'Status updated successfully!');
    } catch (err) {
      console.error('Failed to update status:', err);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleUpdateStatus = () => {
    updateStatus(status);
  };

  const handleRequestBackup = async () => {
    try {
      let bpType = backupType;
      if (backupType === 'Medical Service') bpType = 'medic';
      else if (backupType === 'LGU') bpType = 'lgu';

      await apiFetch(`${config.API_BASE_URL}/api/responder/report/${report.id}/request-backup`, {
        method: 'POST',
        body: JSON.stringify({ backup_type: bpType, reason: backupReason })
      });

      setShowBackupModal(false);
      setShowRequestSent(true);
      setStatus('Requesting Backup');
      setReport(prev => ({ ...prev, status: 'Requesting Backup' }));
    } catch (err) {
      console.error('Failed to request backup:', err);
      Alert.alert('Error', 'Failed to send backup request');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading report details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.viewReportContainer}>
      <NewHeader navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title Row */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImg} />
          </TouchableOpacity>
          <Text style={styles.title}>Report Details</Text>
        </View>

        {/* Map Section Placeholder */}
        <View style={styles.mapSection}>
          <View style={[styles.mapPlaceholder, !shareLocation && styles.mapBlurred]}>
            <Text style={styles.mapPlaceholderText}>
              {shareLocation ? 'Map View' : 'Location Sharing Off'}
            </Text>
            {responderLocation && (
              <Text style={styles.locationInfo}>
                GPS: {responderLocation.lat.toFixed(6)}, {responderLocation.lng.toFixed(6)}
                {'\n'}Accuracy: ±{Math.round(responderLocation.accuracy)}m
              </Text>
            )}
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={[styles.row, styles.topRow]}>
            <Text style={styles.reportDatetime}>{report?.dateTime || report?.date || ''}</Text>
            <View style={styles.toggleWrap}>
              <Switch value={shareLocation} onValueChange={setShareLocation} />
              <Text style={styles.toggleLabel}>Location</Text>
            </View>
          </View>

          <View style={styles.detailsPlaceholder} />

          <View style={styles.detailsBody}>
            <Text style={styles.reportLocation}>{resolvedAddress}</Text>
            {report?.landmark && <Text style={styles.reportLandmark}>Landmark: {report.landmark}</Text>}
            <Text style={styles.reportName}>{report?.reporterName || ''}</Text>
            <Text style={styles.reportIncident}>
              Incident Type: <Text style={styles.incidentType}>{report?.type || ''}</Text>
            </Text>
            {report?.description && (
              <Text style={styles.reportDescription}>
                Description: <Text style={styles.descriptionText}>{report.description}</Text>
              </Text>
            )}

            <Text style={styles.reportAccuracy}>
              GPS: {responderLocation ? `${responderLocation.lat.toFixed(6)}, ${responderLocation.lng.toFixed(6)}` : '—'}{' '}
              {responderLocation?.accuracy ? `(±${Math.round(responderLocation.accuracy)} m)` : ''}
            </Text>
            <Text style={styles.reportTimestamp}>
              Last seen: {responderLocation?.timestamp ? new Date(responderLocation.timestamp).toLocaleTimeString() : '-'}
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Current Report Status:</Text>
            <View style={styles.statusRow}>
              {['En Route', 'On Scene', 'Resolved'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.statusChip, status === option && styles.statusChipActive]}
                  onPress={() => setStatus(option)}
                  disabled={status === 'Resolved'}
                >
                  <Text style={[styles.statusChipText, status === option && styles.statusChipTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnBackup]} onPress={() => setShowBackupModal(true)}>
              <Text style={styles.btnText}>Request Backup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleUpdateStatus}>
              <Text style={styles.btnText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Backup Request Modal */}
      <Modal
        transparent
        visible={showBackupModal}
        animationType="fade"
        onRequestClose={() => setShowBackupModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowBackupModal(false)}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Backup Request</Text>
            <View style={styles.modalContent}>
              <Text style={styles.modalLabel}>Select Backup Type</Text>
              <View style={styles.choiceRow}>
                {['Medical Service', 'LGU'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.choiceChip, backupType === t && styles.choiceChipActive]}
                    onPress={() => {
                      setBackupType(t);
                      if (t === 'Medical Service') setBackupReason('medical');
                      else if (t === 'LGU') setBackupReason('escalation');
                    }}
                  >
                    <Text style={[styles.choiceChipText, backupType === t && styles.choiceChipTextActive]}>
                      {t === 'Medical Service' ? 'Emergency Medical Service' : t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Reason for Backup:</Text>
              <View style={styles.choiceRow}>
                {[
                  { value: 'overwhelmed', label: 'Insufficient manpower' },
                  { value: 'injury', label: 'Responder injury or fatigue' },
                  { value: 'escalation', label: 'Large-scale incident' },
                  { value: 'medical', label: 'Medical assistance required' }
                ].map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.choiceChip, backupReason === r.value && styles.choiceChipActive]}
                    onPress={() => setBackupReason(r.value)}
                  >
                    <Text style={[styles.choiceChipText, backupReason === r.value && styles.choiceChipTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalRequestBtn} onPress={handleRequestBackup}>
                <Text style={styles.modalRequestBtnText}>Request</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Request Sent Modal */}
      <Modal
        transparent
        visible={showRequestSent}
        animationType="fade"
        onRequestClose={() => setShowRequestSent(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowRequestSent(false)}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.successIcon} />
            {backupType === 'Medical Service' || backupType === 'medic' ? (
              <Text style={styles.successText}>
                The <Text style={styles.boldText}>Medical Team</Text> has been automatically assigned to this incident.{'\n'}
                They are now preparing to assist your team.
              </Text>
            ) : (
              <Text style={styles.successText}>
                Your request has been sent.{'\n'}
                Please wait for backup.
              </Text>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalRequestBtn} onPress={() => setShowRequestSent(false)}>
                <Text style={styles.modalRequestBtnText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <NewBottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  viewReportContainer: {
    minHeight: '100%',
    backgroundColor: '#f5f7fb',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backButtonImg: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  mapSection: {
    marginTop: 8,
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: '#e5eefb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapBlurred: {
    backgroundColor: '#d1d5db',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 8,
  },
  locationInfo: {
    fontSize: 12,
    color: '#3498db',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRow: {
    marginBottom: 12,
  },
  reportDatetime: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  toggleWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  toggleLabel: { 
    fontSize: 12, 
    color: '#666', 
    marginLeft: 6 
  },
  detailsPlaceholder: { 
    height: 12, 
    marginBottom: 8 
  },
  detailsBody: { 
    marginBottom: 16 
  },
  reportLocation: { 
    fontWeight: '600', 
    marginBottom: 4, 
    color: '#111' 
  },
  reportLandmark: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  reportName: { 
    fontWeight: '600', 
    marginBottom: 4, 
    color: '#111' 
  },
  reportIncident: { 
    color: '#2c3e50',
    marginBottom: 4,
  },
  incidentType: { 
    color: '#e11d48', 
    fontWeight: '700' 
  },
  reportDescription: {
    color: '#2c3e50',
    marginBottom: 4,
  },
  descriptionText: {
    color: '#6b7280',
  },
  reportAccuracy: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  reportTimestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  formGroup: { 
    marginTop: 8 
  },
  fieldLabel: { 
    fontWeight: '600', 
    marginBottom: 8 
  },
  statusRow: { 
    flexDirection: 'row', 
    gap: 8 
  },
  statusChip: {
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#f9fbff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusChipActive: {
    backgroundColor: '#1f4ed8',
    borderColor: '#1f4ed8',
  },
  statusChipText: { 
    color: '#1f2937', 
    fontWeight: '600' 
  },
  statusChipTextActive: { 
    color: '#fff' 
  },
  actions: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 16 
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnBackup: { 
    backgroundColor: '#f59e0b' 
  },
  btnPrimary: { 
    backgroundColor: '#1f4ed8' 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  modalTitle: { 
    textAlign: 'center', 
    marginVertical: 8, 
    fontWeight: '700' 
  },
  modalContent: { 
    paddingVertical: 8 
  },
  modalLabel: { 
    fontWeight: '600', 
    fontSize: 14, 
    marginVertical: 6 
  },
  choiceRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  choiceChip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  choiceChipActive: {
    backgroundColor: '#1f4ed8',
    borderColor: '#1f4ed8',
  },
  choiceChipText: { 
    color: '#1f2937' 
  },
  choiceChipTextActive: { 
    color: '#fff' 
  },
  modalActions: { 
    alignItems: 'center', 
    marginTop: 12 
  },
  modalRequestBtn: {
    backgroundColor: '#1f4ed8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalRequestBtnText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#22c55e',
    borderStyle: 'dashed',
    alignSelf: 'center',
    marginVertical: 10,
  },
  successText: { 
    textAlign: 'center', 
    marginVertical: 8, 
    fontWeight: '600' 
  },
  boldText: {
    fontWeight: '700',
  },
});

export default ResponderViewReport;