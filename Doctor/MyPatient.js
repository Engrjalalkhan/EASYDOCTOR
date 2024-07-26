import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PatientScreen = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const fetchDoctorId = async () => {
      const user = auth().currentUser;
      if (user) {
        const doctorSnapshot = await firestore().collection('Doctor').where('email', '==', user.email).get();
        if (!doctorSnapshot.empty) {
          setDoctorId(doctorSnapshot.docs[0].id);
        }
      }
    };

    fetchDoctorId();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await firestore().collection('Bookings').where('doctorId', '==', doctorId).get();
        const patientsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,  // Booking document ID
            patientId: data.patientId, // patientId field from Booking document
            ...data.patient, // Patient data if present
            phone: data.phone,
            date: data.date,
            morningSlot: data.morningSlot,
            eveningSlot: data.eveningSlot,
            paymentStatus: data.paymentStatus
          };
        }).filter(patient => patient.patientId); // Ensure we only include valid patientId
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId]);

  const handlePing = async (patient) => {
    if (!patient.patientId) {
      console.error('Patient ID is missing');
      return;
    }

    try {
      await firestore().collection('Notifications').add({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        symptom: patient.symptom,
        date: patient.date,
        paymentStatus: patient.paymentStatus,
        complications: patient.complications,
        time: patient.morningSlot || patient.eveningSlot,
        patientId: patient.patientId, // Store patientId from Booking collection
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Ping', `Notification sent to ${patient.phone} for appointment on ${patient.date} at ${patient.morningSlot || patient.eveningSlot}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleDelete = async (patientId) => {
    try {
      await firestore().collection('Bookings').doc(patientId).delete();
      setPatients(patients.filter(patient => patient.id !== patientId));
      Alert.alert('Deleted', 'Patient record removed successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        {patients.map((patient, index) => (
          <View key={index} style={styles.patientCard}>
            <TouchableOpacity onPress={() => { setSelectedPatient(patient); setModalVisible(true); }}>
              <Text style={styles.patientDetail}>Name: {patient.name}</Text>
              <Text style={styles.patientDetail}>Age: {patient.age}</Text>
              <Text style={styles.patientDetail}>Gender: {patient.gender}</Text>
              <Text style={styles.patientDetail}>Status: {patient.paymentStatus}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(patient.id)}
            >
              <Image
                source={require('../Src/images/red.png')} // Replace with the path to your delete icon image
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {selectedPatient && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Patient Details</Text>
              <Text style={styles.modalDetail}>Name: {selectedPatient.name}</Text>
              <Text style={styles.modalDetail}>Age: {selectedPatient.age}</Text>
              <Text style={styles.modalDetail}>Gender: {selectedPatient.gender}</Text>
              <Text style={styles.modalDetail}>Symptom: {selectedPatient.symptom}</Text>
              <Text style={styles.modalDetail}>Complication: {selectedPatient.complications}</Text>
              <Text style={styles.modalDetail}>Appointment Date: {selectedPatient.date}</Text>
              <Text style={styles.patientDetail}>Status: {selectedPatient.paymentStatus}</Text>
              <Text style={styles.modalDetail}>Time: {selectedPatient.morningSlot || selectedPatient.eveningSlot}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => { handlePing(selectedPatient); setModalVisible(false); }}
                >
                  <Text style={styles.buttonText}>Ping</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    marginTop: 10,
    padding: 10,
  },
  patientCard: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  patientDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 5,
  },
  deleteIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0D4744',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  closeButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PatientScreen;
