import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

const DoctorVideoScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Fetch the doctor's document using the logged-in user's ID
          const doctorSnapshot = await firestore().collection('Doctor').where('userId', '==', user.uid).get();
          
          if (!doctorSnapshot.empty) {
            const doctorData = doctorSnapshot.docs[0].data();
            setDoctorId(doctorData.doctorId);
          } else {
            Alert.alert('Error', 'Doctor profile not found.');
          }
        } else {
          Alert.alert('Error', 'User is not logged in.');
        }
      } catch (error) {
        console.error('Error fetching doctor ID:', error);
        Alert.alert('Error', 'There was an issue fetching doctor details.');
      }
    };

    fetchDoctorId();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (doctorId) {
        try {
          const querySnapshot = await firestore()
            .collection('Bookings')
            .where('doctorId', '==', doctorId)
            .get();

          const bookingsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setBookings(bookingsData);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          Alert.alert('Error', 'There was an issue fetching bookings.');
        }
      }
    };

    fetchBookings();
  }, [doctorId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Patient Name: {item.patientName}</Text>
      <Text style={styles.cardDetail}>Date: {item.date}</Text>
      <Text style={styles.cardDetail}>Time: {item.time}</Text>
      <Text style={styles.cardDetail}>Symptom: {item.symptom}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Booking Details', `Patient Name: ${item.patientName}\nDate: ${item.date}\nTime: ${item.time}\nSymptom: ${item.symptom}`)}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#0D4744',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DoctorVideoScreen;
