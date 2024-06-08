import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const MyAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments data from Firestore
    const unsubscribe = firestore()
      .collection('Appointments')
      .onSnapshot(snapshot => {
        const appointmentsData = [];
        snapshot.forEach(doc => {
          appointmentsData.push({ id: doc.id, ...doc.data() });
        });
        setAppointments(appointmentsData);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Doctor ID: {item.doctorId}</Text>
      <Text style={styles.text}>Patient ID: {item.patientId}</Text>
      <Text style={styles.text}>Date: {item.appointmentDate}</Text>
      <Text style={styles.text}>Time: {item.appointmentTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
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
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default MyAppointmentsScreen;
