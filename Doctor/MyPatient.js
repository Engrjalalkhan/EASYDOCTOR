import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Calendar from '../Doctor/Calendar';

const MyPatientScreen = () => {



  return (
    <View style={styles.container}>
      {/* Calendar component */}
      <Calendar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 180,
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  selectedButton: {
    backgroundColor: '#0D4744', // Change background color for selected button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeSlotsContainer: {
    marginBottom:30,
  },
  timeSlot: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default MyPatientScreen;
