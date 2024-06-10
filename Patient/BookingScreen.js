import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Calendar } from 'react-native-calendars';

// Calendar Card Component
const CalendarCard = ({ selectedDate, setSelectedDate }) => {
  // Function to handle date selection
  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  return (
    <View>
      {/* Your calendar UI here */}
      <Calendar
        style={{ borderRadius: 15, borderWidth: 2, borderColor: "gray" }}
        onDayPress={(day) => handleDateSelection(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#0D4744' }
        }}
      />
    </View>
  );
};

const BookingScreen = ({ navigation }) => {
  const [morningSlots, setMorningSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMorningSlot, setSelectedMorningSlot] = useState(null);
  const [selectedEveningSlot, setSelectedEveningSlot] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      // Fetching slots from Firestore
      const docRef = firestore().collection('Schedules').doc('doctorSchedule');
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data();
        setMorningSlots(data.morning || []);
        setEveningSlots(data.evening || []);
      }
    };

    fetchSlots();
  }, []);

  const handleProceed = () => {
    if (selectedDate || (selectedMorningSlot || selectedEveningSlot)) {
      // Storing selected date and time slots in Firestore
      firestore()
        .collection('Bookings')
        .add({
          date: selectedDate,
          morningSlot: selectedMorningSlot ? selectedMorningSlot + ' PM' : null,
          eveningSlot: selectedEveningSlot ? selectedEveningSlot + ' AM' : null,
        })
        .then(() => {
          console.log('Booking saved successfully!');
          navigation.navigate('Proceed');
        })
        .catch((error) => {
          console.error('Error saving booking: ', error);
        });
    } else {
      // Display alert if date or time slot is not selected
      Alert.alert('Error', 'Please select a date and at least one time slot.');
    }
  };
  

  const handleSlotClick = (slot, period) => {
    if (period === 'morning') {
      setSelectedMorningSlot(slot.startTime);
    } else {
      setSelectedEveningSlot(slot.startTime);
    }
    console.log(`Slot ${slot.startTime} clicked`);
  };

  const renderSlotCard = (slots, period) => {
    if (slots.length > 0) {
      return slots.map((slot, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.slotButton,
            (period === 'morning' && selectedMorningSlot === slot.startTime) ||
            (period === 'evening' && selectedEveningSlot === slot.startTime)
              ? styles.selectedSlotButton
              : null,
          ]}
          onPress={() => handleSlotClick(slot, period)}
        >
          <Text
            style={[
              styles.slotText,
              (period === 'morning' && selectedMorningSlot === slot.startTime) ||
              (period === 'evening' && selectedEveningSlot === slot.startTime)
                ? styles.selectedSlotText
                : null,
            ]}
          >
            {slot.startTime} {period === 'morning' ? 'PM' : 'AM'}
          </Text>
        </TouchableOpacity>
      ));
    } else {
      return <Text>No slots available</Text>;
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Calendar Card */}
      <CalendarCard selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>MORNING</Text>
          <View style={styles.slotRow}>{renderSlotCard(morningSlots, 'morning')}</View>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>EVENING</Text>
          <View style={styles.slotRow}>{renderSlotCard(eveningSlots, 'evening')}</View>
        </View>
      </View>
      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedButtonText}>PROCEED</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D4744',
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  slotButton: {
    backgroundColor: 'lightgray',
    padding: 6,
    margin: 3,
    borderRadius: 5,
  },
  selectedSlotButton: {
    backgroundColor: '#0D4744',
  },
  slotText: {
    fontSize: 14,
    color: '#000', // default text color
  },
  selectedSlotText: {
    color: '#fff', // selected text color
  },
  proceedButton: {
    height: 50,
    width: '60%',
    backgroundColor: '#0D4744',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  proceedButtonText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
  },
});

export default BookingScreen;
