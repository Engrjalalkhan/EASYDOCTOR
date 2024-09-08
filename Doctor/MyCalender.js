import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Calendar from '../Doctor/Calendar';
import { useNavigation } from '@react-navigation/native';

const MyCalendarScreen = () => {
  const navigation = useNavigation();

  const [showCalendar, setShowCalendar] = useState(false);
  const [morningEnabled, setMorningEnabled] = useState(false);
  const [eveningEnabled, setEveningEnabled] = useState(false);
  const [allEnabled, setAllEnabled] = useState(false);
  const [morningFromTime, setMorningFromTime] = useState('');
  const [morningToTime, setMorningToTime] = useState('');
  const [morningSlots, setMorningSlots] = useState('');
  const [eveningFromTime, setEveningFromTime] = useState('');
  const [eveningToTime, setEveningToTime] = useState('');
  const [eveningSlots, setEveningSlots] = useState('');

  // Toggle calendar visibility only when specifically requested
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const toggleMorning = () => {
    setMorningEnabled(!morningEnabled);
  };

  const toggleEvening = () => {
    setEveningEnabled(!eveningEnabled);
  };

  const toggleAll = () => {
    setAllEnabled(!allEnabled);
  };

  const handleSave = async () => {
    try {
      const doctorQuerySnapshot = await firestore().collection('Doctor').limit(1).get();

      if (doctorQuerySnapshot.empty) {
        throw new Error('No doctor found');
      }

      const doctorDoc = doctorQuerySnapshot.docs[0];
      const doctorId = doctorDoc.id;
      const doctorData = doctorDoc.data();

      // Calculate slots for morning and evening
      const saveMorningSlots = await saveSlots(
        morningEnabled,
        morningFromTime,
        morningToTime,
        morningSlots
      );

      const saveEveningSlots = await saveSlots(
        eveningEnabled,
        eveningFromTime,
        eveningToTime,
        eveningSlots
      );

      // Save schedule data to Firestore
      await firestore().collection('Schedules').doc(doctorId).set({
        morning: saveMorningSlots,
        evening: saveEveningSlots,
        allDays: allEnabled,
      });

      console.log('Schedule saved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule: ', error);
    }
  };

  // Function to calculate and save time slots
  const saveSlots = async (enabled, fromTime, toTime, slots) => {
    if (!enabled || !fromTime || !toTime || !slots) {
      return [];
    }

    const slotsData = [];
    const fromTimeParts = fromTime.split(':').map(part => parseInt(part));
    const toTimeParts = toTime.split(':').map(part => parseInt(part));
    const fromTimeInMinutes = fromTimeParts[0] * 60 + fromTimeParts[1];
    const toTimeInMinutes = toTimeParts[0] * 60 + toTimeParts[1];
    const slotDuration = 15;

    let currentTimeInMinutes = fromTimeInMinutes;

    while (currentTimeInMinutes < toTimeInMinutes) {
      const slotStartHour = Math.floor(currentTimeInMinutes / 60);
      const slotStartMinute = currentTimeInMinutes % 60;

      const slotStart = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMinute.toString().padStart(2, '0')}`;
      currentTimeInMinutes += slotDuration;

      const slotEndHour = Math.floor(currentTimeInMinutes / 60);
      const slotEndMinute = currentTimeInMinutes % 60;

      const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;

      slotsData.push({
        startTime: slotStart,
        endTime: slotEnd,
      });
    }

    return slotsData;
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

      {showCalendar && <Calendar />}

      <View style={styles.morningToggle}>
        <Text style={styles.sectionTitle}>Morning</Text>
        <Switch
          value={morningEnabled}
          onValueChange={toggleMorning}
          style={{ paddingStart: 20, marginTop: 10 }}
        />
      </View>

      {morningEnabled && (
        <View style={styles.timeInputRow}>
          <View>
            <Text style={styles.label}>FROM</Text>
            <TextInput
              style={styles.input}
              value={morningFromTime}
              onChangeText={setMorningFromTime}
              placeholder="08:00 PM"
              placeholderTextColor="gray"
            />
          </View>
          <View>
            <Text style={styles.label}>TO</Text>
            <TextInput
              style={styles.input}
              value={morningToTime}
              onChangeText={setMorningToTime}
              placeholder="09:00 PM"
              placeholderTextColor="gray"
            />
          </View>
          <View>
            <Text style={styles.label}>SLOTS</Text>
            <TextInput
              style={styles.input}
              value={morningSlots}
              onChangeText={setMorningSlots}
              placeholder="4"
              placeholderTextColor="gray"
            />
          </View>
        </View>
      )}

      <View style={styles.eveningToggle}>
        <Text style={styles.sectionTitle}>Evening</Text>
        <Switch
          value={eveningEnabled}
          onValueChange={toggleEvening}
          style={{ paddingStart: 20, marginTop: 10 }}
        />
      </View>

      {eveningEnabled && (
        <View style={styles.timeInputRow}>
          <View>
            <Text style={styles.label}>FROM</Text>
            <TextInput
              style={styles.input}
              value={eveningFromTime}
              onChangeText={setEveningFromTime}
              placeholder="05:00 PM"
              placeholderTextColor="gray"
            />
          </View>
          <View>
            <Text style={styles.label}>TO</Text>
            <TextInput
              style={styles.input}
              value={eveningToTime}
              onChangeText={setEveningToTime}
              placeholder="09:00 PM"
              placeholderTextColor="gray"
            />
          </View>
          <View>
            <Text style={styles.label}>SLOTS</Text>
            <TextInput
              style={styles.input}
              value={eveningSlots}
              onChangeText={setEveningSlots}
              placeholder="4"
              placeholderTextColor="gray"
            />
          </View>
        </View>
      )}

      <Text style={styles.sectionSubtitle}>RECURRING ON</Text>
      <View style={styles.allToggle}>
        <Text style={styles.sectionTitle}>All days</Text>
        <Switch
          value={allEnabled}
          onValueChange={toggleAll}
          style={{ paddingStart: 20, marginTop: 10 }}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 24,
    color: '#136b66',
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
  },
  morningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    width: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#136b66',
  },
  eveningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  allToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#136b66',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MyCalendarScreen;
