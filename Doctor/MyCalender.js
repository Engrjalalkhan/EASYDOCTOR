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

      console.log('Morning slots:', saveMorningSlots);
      console.log('Evening slots:', saveEveningSlots);

      // Save data to Firestore
      await firestore().collection('Schedules').doc('doctorSchedule').set({
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
  
    const slotsCount = parseInt(slots);
    const fromTimeParts = fromTime.split(':').map(part => parseInt(part));
    const toTimeParts = toTime.split(':').map(part => parseInt(part));
  
    const fromHour = fromTimeParts[0];
    const fromMinute = fromTimeParts[1];
    const toHour = toTimeParts[0];
    const toMinute = toTimeParts[1];
  
    const fromTimeInMinutes = fromHour * 60 + fromMinute;
    const toTimeInMinutes = toHour * 60 + toMinute;
  
    const slotDuration = 15; // 15-minute slot duration
  
    const slotsData = [];
  
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
      
      <Calendar />
      
      <View style={styles.morningToggle}>
        <Text style={styles.sectionTitle}>Morning</Text>
        <Switch
          value={morningEnabled}
          onValueChange={toggleMorning}
          style={{ paddingStart: 20, marginTop: 10 }}
        />
      </View>
      {morningEnabled && (
        <>
          <View style={styles.timeInputRow}>
            <View>
              <Text style={styles.label}>FROM</Text>
              <TextInput
                style={styles.input}
                value={morningFromTime}
                onChangeText={setMorningFromTime}
                placeholder="08:00 AM"
                
              />
            </View>
            <View>
              <Text style={styles.label}>TO</Text>
              <TextInput
                style={styles.input}
                value={morningToTime}
                onChangeText={setMorningToTime}
                placeholder="9:00 AM"
                
              />
            </View>
            <View>
              <Text style={styles.label}>SLOTS</Text>
              <TextInput
                style={styles.input}
                value={morningSlots}
                onChangeText={setMorningSlots}
                placeholder="4"
                
              />
            </View>
          </View>
        </>
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
        <>
          <View style={styles.timeInputRow}>
            <View>
              <Text style={styles.label}>FROM</Text>
              <TextInput
                style={styles.input}
                value={eveningFromTime}
                onChangeText={setEveningFromTime}
                placeholder="05:00 PM"
                
              />
            </View>
            <View>
              <Text style={styles.label}>TO</Text>
              <TextInput
                style={styles.input}
                value={eveningToTime}
                onChangeText={setEveningToTime}
                placeholder="09:00 PM"
              />
            </View>
            <View>
              <Text style={styles.label}>SLOTS</Text>
              <TextInput
                style={styles.input}
                value={eveningSlots}
                onChangeText={setEveningSlots}
                placeholder="4"
              />
            </View>
          </View>
        </>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 150,
  },
  closeButton: {
    marginBottom: 210,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#0D4744',
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
  },
  morningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  eveningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  allToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    paddingRight: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: 100,
    height: 35,
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButton: {
    backgroundColor: '#0D4744',
    width: '60%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: 10,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MyCalendarScreen;
