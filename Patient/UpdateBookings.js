import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Calendar } from 'react-native-calendars';

const BookScreen = ({ route, navigation }) => {
  const { bookingId, isRescheduling } = route.params || {};
  const [date, setDate] = useState('');
  const [morningSlot, setMorningSlot] = useState('');
  const [eveningSlot, setEveningSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (isRescheduling && bookingId) {
      // Fetch existing booking details
      const fetchBookingDetails = async () => {
        try {
          const bookingDoc = await firestore().collection('Bookings').doc(bookingId).get();
          if (bookingDoc.exists) {
            const bookingData = bookingDoc.data();
            setDate(bookingData.date || '');
            setMorningSlot(bookingData.morningSlot || '');
            setEveningSlot(bookingData.eveningSlot || '');
            setSelectedDate(bookingData.date || '');
          } else {
            Alert.alert('Error', 'Booking not found.');
          }
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      };

      fetchBookingDetails();
    }
  }, [isRescheduling, bookingId]);

  const handleSave = async () => {
    if (!selectedDate || !morningSlot || !eveningSlot) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      if (isRescheduling && bookingId) {
        // Update existing booking
        await firestore().collection('Bookings').doc(bookingId).update({
          date: selectedDate,
          morningSlot,
          eveningSlot,
        });
        Alert.alert('Success', 'Booking updated successfully');
      } else {
        // Handle new booking logic here if applicable
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Morning Slot:</Text>
      <TextInput
        style={styles.input}
        value={morningSlot}
        onChangeText={setMorningSlot}
        placeholder="Enter new morning slot"
      />
      <Text style={styles.label}>Evening Slot:</Text>
      <TextInput
        style={styles.input}
        value={eveningSlot}
        onChangeText={setEveningSlot}
        placeholder="Enter new evening slot"
      />
      <Text style={styles.label}>Select Date:</Text>
      <Calendar
        style={styles.calendar}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#0D4744', // Same color as the button
            selectedTextColor: 'white', // Optional: Text color of the selected date
          },
        }}
      />
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    color:"gray"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color:'gray'
  },
  calendar: {
    marginVertical: -5,
    height: 350,
  },
  saveButton: {
    backgroundColor: '#0D4744',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookScreen;
