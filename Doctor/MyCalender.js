import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput, StyleSheet, Modal } from 'react-native';
import Calendar from'../Doctor/Calendar'

const MyCalendarScreen = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [morningEnabled, setMorningEnabled] = useState(false);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [slots, setSlots] = useState('');

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const toggleMorning = () => {
    setMorningEnabled(!morningEnabled);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.calendarButton} onPress={toggleCalendar}>
        <Text style={styles.iconText}>Calendar</Text>
        <Text style={styles.icon}>{showCalendar ? 'X' : '!'}</Text>
      </TouchableOpacity>
      <Modal visible={showCalendar} transparent={true}>
        <View style={styles.modalContainer}>
          
            <Calendar/>
          
          <TouchableOpacity style={styles.closeButton} onPress={toggleCalendar}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.morningToggle}>
        <Text>Morning</Text>
        <Switch value={morningEnabled} onValueChange={toggleMorning} />
      </View>
      <Text style={styles.label}>From:</Text>
      <TextInput
        style={styles.input}
        value={fromTime}
        onChangeText={setFromTime}
        placeholder="Enter From Time"
      />
      <Text style={styles.label}>To:</Text>
      <TextInput
        style={styles.input}
        value={toTime}
        onChangeText={setToTime}
        placeholder="Enter To Time"
      />
      <Text style={styles.label}>Slots:</Text>
      <TextInput
        style={styles.input}
        value={slots}
        onChangeText={setSlots}
        placeholder="Enter Number of Slots"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  calendarButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#0D4744',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    fontSize: 20,
    color: 'white',
    marginLeft: 5,
  },
  iconText: {
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarCard: {
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#0D4744',
  },
  morningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
});

export default MyCalendarScreen;
