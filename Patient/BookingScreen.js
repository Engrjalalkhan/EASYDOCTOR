import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const BookingScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      const scheduleSnapshot = await firestore().collection('Schedules').get();
      const scheduleList = scheduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchedules(scheduleList);
    };

    fetchSchedules();
  }, []);

  const bookAppointment = async () => {
    if (!selectedSchedule || !patientName || !patientPhone) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await firestore().collection('Appointments').add({
        scheduleId: selectedSchedule.id,
        patientName,
        patientPhone,
        status: 'pending',
        doctorNotified: false,
      });
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment: ', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book an Appointment</Text>
      <FlatList
        data={schedules}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.scheduleItem}
            onPress={() => setSelectedSchedule(item)}
          >
            <Text style={styles.scheduleText}>
              {item.morning.enabled ? `Morning: ${item.morning.fromTime} - ${item.morning.toTime}` : 'No morning schedule'}
            </Text>
            <Text style={styles.scheduleText}>
              {item.evening.enabled ? `Evening: ${item.evening.fromTime} - ${item.evening.toTime}` : 'No evening schedule'}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={patientName}
        onChangeText={setPatientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Phone"
        value={patientPhone}
        onChangeText={setPatientPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.bookButton} onPress={bookAppointment}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scheduleItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  scheduleText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#0D4744',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default BookingScreen;
