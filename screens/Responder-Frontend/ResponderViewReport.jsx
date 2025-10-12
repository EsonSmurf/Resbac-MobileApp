import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Pressable, Image } from 'react-native';
import NewHeader from '../Components/ResponderComponents/NewHeader';
import NewBottomNav from '../Components/ResponderComponents/NewBottomNav';

const ResponderViewReport = ({ navigation, route }) => {
  const { id } = route?.params || {};

  const [report] = useState(null);
  const [status, setStatus] = useState('En Route');
  const [shareLocation, setShareLocation] = useState(true);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupType, setBackupType] = useState('');
  const [backupReason, setBackupReason] = useState('');
  const [showRequestSent, setShowRequestSent] = useState(false);

  return (
    <View style={styles.viewReportContainer}>
      {/* Header */}
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
          <View style={styles.mapPlaceholder} />
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={[styles.row, styles.topRow]}>
            <Text style={styles.reportDatetime}>{report?.dateTime || ''}</Text>
            <View style={styles.toggleWrap}>
              <Switch value={shareLocation} onValueChange={setShareLocation} />
              <Text style={styles.toggleLabel}>Location</Text>
            </View>
          </View>

          <View style={styles.detailsPlaceholder} />

          <View style={styles.detailsBody}>
            <Text style={styles.reportName}>{report?.reporterName || ''}</Text>
            <Text style={styles.reportAddress}>{report?.address || ''}</Text>
            <Text style={styles.reportIncident}>Incident Type : <Text style={styles.incidentType}>{report?.incidentType || ''}</Text></Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Current Report Status:</Text>
            <View style={styles.statusRow}>
              {['En Route', 'On Scene', 'Resolved'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.statusChip, status === option && styles.statusChipActive]}
                  onPress={() => setStatus(option)}
                >
                  <Text style={[styles.statusChipText, status === option && styles.statusChipTextActive]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnBackup]} onPress={() => setShowBackupModal(true)}>
              <Text style={styles.btnText}>Request Backup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
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
                {['Emergency Medical Service', 'LGU'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.choiceChip, backupType === t && styles.choiceChipActive]}
                    onPress={() => setBackupType(t)}
                  >
                    <Text style={[styles.choiceChipText, backupType === t && styles.choiceChipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Reason for Backup:</Text>
              <View style={styles.choiceRow}>
                {['Insufficient manpower', 'Responder injury or fatigue', 'Large-scale incident', 'Others'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.choiceChip, backupReason === r && styles.choiceChipActive]}
                    onPress={() => setBackupReason(r)}
                  >
                    <Text style={[styles.choiceChipText, backupReason === r && styles.choiceChipTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalRequestBtn}
                onPress={() => { setShowBackupModal(false); setShowRequestSent(true); }}
              >
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
            <Text style={styles.successText}>Your request has been sent,{"\n"}Please wait for backup.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalRequestBtn} onPress={() => setShowRequestSent(false)}>
                <Text style={styles.modalRequestBtnText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Bottom Navigation */}
      <NewBottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: '#e5eefb',
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
  toggleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { fontSize: 12, color: '#666', marginLeft: 6 },
  detailsPlaceholder: { height: 12, marginBottom: 8 },
  detailsBody: { marginBottom: 16 },
  reportName: { fontWeight: '600', marginBottom: 4, color: '#111' },
  reportAddress: { color: '#6b7280', fontSize: 14, marginBottom: 6 },
  reportIncident: { color: '#2c3e50' },
  incidentType: { color: '#e11d48', fontWeight: '700' },
  formGroup: { marginTop: 8 },
  fieldLabel: { fontWeight: '600', marginBottom: 8 },
  statusRow: { flexDirection: 'row', gap: 8 },
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
  statusChipText: { color: '#1f2937', fontWeight: '600' },
  statusChipTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnBackup: { backgroundColor: '#f59e0b' },
  btnPrimary: { backgroundColor: '#1f4ed8' },
  btnText: { color: '#fff', fontWeight: '700' },
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
  modalTitle: { textAlign: 'center', marginVertical: 8, fontWeight: '700' },
  modalContent: { paddingVertical: 8 },
  modalLabel: { fontWeight: '600', fontSize: 14, marginVertical: 6 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  choiceChipText: { color: '#1f2937' },
  choiceChipTextActive: { color: '#fff' },
  modalActions: { alignItems: 'center', marginTop: 12 },
  modalRequestBtn: {
    backgroundColor: '#1f4ed8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalRequestBtnText: { color: '#fff', fontWeight: '700' },
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
  successText: { textAlign: 'center', marginVertical: 8, fontWeight: '600' },
});

export default ResponderViewReport;
