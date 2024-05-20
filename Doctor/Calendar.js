import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const MyPatientScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Function to handle date selection
  const handleDateSelection = (date) => {
    setSelectedDate(date);
    // Add your logic for fetching appointments for the selected date
  };

  return (
    <View style={styles.container}>
      {/* Calendar component for date selection */}
      <Calendar
        style={styles.calendar}
        onDayPress={(day) => handleDateSelection(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true } }}
        theme={{
          calendarBackground: '#ffffff', // Background color of the calendar
          textSectionTitleColor: '#b6c1cd', // Color of section title
          selectedDayBackgroundColor: '#0D4744', // Background color of selected day
          todayTextColor: '#136b66', // Text color of today's date
          dayTextColor: '#2d4150', // Text color of day
          textDisabledColor: '#d9e1e8', // Text color of disabled date
          dotColor: '#00adf5', // Color of dots in the calendar
          selectedDotColor: '#ffffff', // Color of selected dots
          arrowColor: 'black', // Color of arrows in the header
          monthTextColor: '#136b66', // Text color of month name
          textMonthFontWeight:"bold",
          textDayFontSize: 16, // Font size for day text
          textMonthFontSize: 16, // Font size for month text
          textDayHeaderFontSize: 16, // Font size for day header text
        }}
      />
      
      {/* Add rest of your UI components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    
  },
  calendar: {
    width: 400, // Adjust the width of the calendar
    height: 400, // Adjust the height of the calendar
    alignSelf:'center',
    borderRadius:15,
    borderWidth:1,
  },
});

export default MyPatientScreen;
