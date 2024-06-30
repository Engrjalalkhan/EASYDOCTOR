import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
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
      <Calendar
        style={{ borderRadius: 15, borderWidth: 2, borderColor: 'gray' }}
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
  const [existingBookings, setExistingBookings] = useState([]);
  const [showProceedButton, setShowProceedButton] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
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

  const handleProceed = async () => {
    if (selectedDate || (selectedMorningSlot || selectedEveningSlot)) {
      const bookingsRef = firestore().collection('Bookings');
      const querySnapshot = await bookingsRef
        .where('date', '==', selectedDate)
        .where('morningSlot', '==', selectedMorningSlot ? selectedMorningSlot + ' AM' : null)
        .where('eveningSlot', '==', selectedEveningSlot ? selectedEveningSlot + ' PM' : null)
        .get();

      if (!querySnapshot.empty) {
        const bookings = querySnapshot.docs.map(doc => doc.data());
        setExistingBookings(bookings);
        setShowProceedButton(false);
      } else {
        firestore()
          .collection('Bookings')
          .add({
            date: selectedDate,
            morningSlot: selectedMorningSlot ? selectedMorningSlot + ' AM' : null,
            eveningSlot: selectedEveningSlot ? selectedEveningSlot + ' PM' : null,
            name: "John Doe",
            age: 30,
            gender: "Male",
            symptom: "Cough",
            complication: "None"
          })
          .then(() => {
            console.log('Booking saved successfully!');
            navigation.navigate('Proceed');
          })
          .catch((error) => {
            console.error('Error saving booking: ', error);
          });
      }
    } else {
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
            {slot.startTime} {period === 'morning' ? 'AM' : 'PM'}
          </Text>
        </TouchableOpacity>
      ));
    } else {
      return <Text>No slots available</Text>;
    }
  };

  const renderBookingCard = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingText}>Date: {item.date}</Text>
      <Text style={styles.bookingText}>Morning Slot: {item.morningSlot}</Text>
      <Text style={styles.bookingText}>Evening Slot: {item.eveningSlot}</Text>
      <Text style={styles.bookingText}>Name: {item.name}</Text>
      <Text style={styles.bookingText}>Age: {item.age}</Text>
      <Text style={styles.bookingText}>Gender: {item.gender}</Text>
      <Text style={styles.bookingText}>Symptom: {item.symptom}</Text>
      <Text style={styles.bookingText}>Complication: {item.complication}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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

      {existingBookings.length > 0 && (
        <FlatList
          data={existingBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item, index) => index.toString()}
          style={styles.bookingList}
        />
      )}

      {showProceedButton && (
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>PROCEED</Text>
        </TouchableOpacity>
      )}
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
    color: '#000',
  },
  selectedSlotText: {
    color: '#fff',
  },
  bookingCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookingText: {
    fontSize: 16,
  },
  bookingList: {
    marginTop: 10,
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
