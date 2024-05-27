import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Calendar from '../Doctor/Calendar';

const BookingScreen = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [morningSlots, setMorningSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const morningSnapshot = await firestore().collection('Schedules').doc('morning').get();
        const eveningSnapshot = await firestore().collection('Schedules').doc('evening').get();
  
        if (morningSnapshot.exists) {
          setMorningSlots(morningSnapshot.data().slots);
        } else {
          console.log('No morning slots available');
        }
  
        if (eveningSnapshot.exists) {
          setEveningSlots(eveningSnapshot.data().slots);
        } else {
          console.log('No evening slots available');
        }
      } catch (error) {
        console.error('Error fetching slots: ', error);
      }
    };
  
    fetchSlots();
  }, []);
  

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleSlotBooking = async (slot, period) => {
    try {
      const booking = {
        date: selectedDate,
        slot,
        period,
      };

      await firestore().collection('Bookings').add(booking);
      Alert.alert('Success', 'Slot booked successfully!');
    } catch (error) {
      console.error('Error booking slot: ', error);
      Alert.alert('Error', 'Failed to book the slot.');
    }
  };

  const renderSlots = (slots, period) => {
    return slots.map((slot, index) => (
      <TouchableOpacity
        key={index}
        style={styles.slotButton}
        onPress={() => handleSlotBooking(slot, period)}
      >
        <Text style={styles.slotText}>{slot}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.calendarButton} onPress={toggleCalendar}>
        <Text style={styles.iconText}>Calendar</Text>
        <Image
          source={require('../Src/images/description.png')}
          style={{ width: 24, height: 24, justifyContent: 'flex-end' }}
        />
      </TouchableOpacity>
      <Modal visible={showCalendar} transparent={true}>
        <View style={styles.modalContainer}>
          <Calendar onDateSelected={setSelectedDate} />
          <TouchableOpacity style={styles.closeButton} onPress={toggleCalendar}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Morning Slots</Text>
        <View style={styles.slotContainer}>
          {renderSlots(morningSlots, 'morning')}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Evening Slots</Text>
        <View style={styles.slotContainer}>
          {renderSlots(eveningSlots, 'evening')}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  calendarButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#136b66',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '40%',
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 150,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#0D4744',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotButton: {
    backgroundColor: '#0D4744',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  slotText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BookingScreen;
