import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PatientScreen = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await firestore().collection('Bookings').get();
        const patientsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return data.patient ? { ...data.patient, id: doc.id, date: data.date, morningSlot: data.morningSlot, eveningSlot: data.eveningSlot } : null;
        }).filter(patient => patient !== null);
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (patientId) => {
    try {
      await firestore().collection('Bookings').doc(patientId).delete();
      setPatients(patients.filter(patient => patient.id !== patientId));
      Alert.alert('Deleted', 'Patient record removed successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleChat = (patient) => {
    // Navigate to the ChatScreen and pass the selected patient information
    navigation.navigate('chatScreen', { patient });
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
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => handleChat(patient)}
            >
              <Image
                source={require('../Src/images/chat.png')} // Replace with the path to your chat icon image
                style={styles.chatIcon}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
    position: 'relative', // Required for positioning the buttons
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
  chatButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 5,
  },
  chatIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop:10
  },
});

export default PatientScreen;