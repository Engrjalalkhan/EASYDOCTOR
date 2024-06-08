import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CalendarScreen = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
        style={styles.dateTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  currentDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  dateTimePicker: {
    width: '100%',
    height: 150,
  },
});

export default CalendarScreen;
