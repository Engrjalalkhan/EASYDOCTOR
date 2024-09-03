import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Calendar } from 'react-native-calendars';

// Calendar Card Component
const CalendarCard = ({ selectedDate, setSelectedDate }) => {
  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  return (
    <View>
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
  const [doctorSlots, setDoctorSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMorningSlot, setSelectedMorningSlot] = useState(null);
  const [selectedEveningSlot, setSelectedEveningSlot] = useState(null);

  useEffect(() => {
    const fetchDoctorSlots = async () => {
      try {
        // Fetch all doctor documents
        const doctorSnapshot = await firestore().collection('Doctor').get();
        const doctorIds = doctorSnapshot.docs.map(doc => doc.id);

        const slots = {};

        // Fetch the schedule for each doctor
        await Promise.all(
          doctorIds.map(async (doctorId) => {
            const scheduleSnapshot = await firestore().collection('Schedules').doc(doctorId).get();
            if (scheduleSnapshot.exists) {
              slots[doctorId] = scheduleSnapshot.data();
            }
          })
        );

        setDoctorSlots(slots);
      } catch (error) {
        console.error('Error fetching schedules: ', error);
      }
    };

    fetchDoctorSlots();
  }, []);

  const handleProceed = () => {
    if (selectedDate && (selectedMorningSlot || selectedEveningSlot)) {
      firestore()
        .collection('Bookings')
        .add({
          date: selectedDate,
          morningSlot: selectedMorningSlot ? selectedMorningSlot + ' AM' : null,
          eveningSlot: selectedEveningSlot ? selectedEveningSlot + ' PM' : null,
        })
        .then(() => {
          console.log('Booking saved successfully!');
          navigation.navigate('Proceed');
        })
        .catch((error) => {
          console.error('Error saving booking: ', error);
        });
    } else {
      Alert.alert('Error', 'Please select a date and a time slot.');
    }
  };

  const handleSlotClick = (slot, period) => {
    if (period === 'morning') {
      setSelectedMorningSlot(slot.startTime);
      setSelectedEveningSlot(null);  // Clear evening slot selection
    } else {
      setSelectedEveningSlot(slot.startTime);
      setSelectedMorningSlot(null);  // Clear morning slot selection
    }
    console.log(`Slot ${slot.startTime} clicked in ${period}`);
  };

  const renderSlotCard = (slots, period) => {
    if (slots.length > 0) {
      return (
        <ScrollView horizontal>
          {slots.map((slot, index) => (
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
          ))}
        </ScrollView>
      );
    } else {
      return <Text>No slots available</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <CalendarCard selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {Object.keys(doctorSlots).map((doctorId) => {
        const { morning = [], evening = [] } = doctorSlots[doctorId];
        
        return (
          <View key={doctorId} style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>MORNING</Text>
              <View style={styles.slotRow}>{renderSlotCard(morning, 'morning')}</View>
            </View>
            <View >
              <View style={styles.card}>
                <Text style={styles.sectionHeader}>EVENING</Text>
                <View style={styles.slotRow}>{renderSlotCard(evening, 'evening')}</View>
              </View>
            </View>
          </View>
        );
      })}
      
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
    marginVertical: 5,
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
