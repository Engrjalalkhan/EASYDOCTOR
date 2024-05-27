import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Calendar from '../Doctor/Calendar';

const MyCalendarScreen = () => {
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
      const scheduleData = {
        morning: {
          enabled: morningEnabled,
          fromTime: morningFromTime,
          toTime: morningToTime,
          slots: morningEnabled ? parseInt(morningSlots) : 0,
        },
        evening: {
          enabled: eveningEnabled,
          fromTime: eveningFromTime,
          toTime: eveningToTime,
          slots: eveningEnabled ? parseInt(eveningSlots) : 0,
        },
        allDays: allEnabled,
      };
  
      await firestore().collection('Schedules').doc('schedule1').set(scheduleData);
      console.log('Schedule saved successfully!');
    } catch (error) {
      console.error('Error saving schedule: ', error);
    }
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
          <Calendar />
          <TouchableOpacity style={styles.closeButton} onPress={toggleCalendar}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
                placeholder="08:00"
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={styles.label}>TO</Text>
              <TextInput
                style={styles.input}
                value={morningToTime}
                onChangeText={setMorningToTime}
                placeholder="12:00"
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={styles.label}>SLOTS</Text>
              <TextInput
                style={styles.input}
                value={morningSlots}
                onChangeText={setMorningSlots}
                placeholder="4"
                keyboardType="numeric"
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
                placeholder="17:00"
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={styles.label}>TO</Text>
              <TextInput
                style={styles.input}
                value={eveningToTime}
                onChangeText={setEveningToTime}
                placeholder="21:00"
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={styles.label}>SLOTS</Text>
              <TextInput
                style={styles.input}
                value={eveningSlots}
                onChangeText={setEveningSlots}
                placeholder="4"
                keyboardType="numeric"
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
