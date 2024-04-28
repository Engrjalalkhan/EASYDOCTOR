import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDateChange = (date) => {
    // Function to handle the date change
    setSelectedDate(date);
  };
  const NextButton = () => (
    <Image
      source={require('../Src/images/right.png')} // Change the path to your "Next" button image
      style={{ width: 24, height: 24 }} // Adjust the width and height as needed
    />
  );

  // Custom component for the "Previous" button
  const PreviousButton = () => (
    <Image
      source={require('../Src/images/left.png')} // Change the path to your "Previous" button image
      style={{ width: 24, height: 24 }} // Adjust the width and height as needed
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={false} // Only allow single date selection
          minDate={new Date(2018, 1, 1)}
          maxDate={new Date(2050, 6, 3)}
          weekdays={[
            'Mon',
            'Tue',
            'Wed',
            'Thur',
            'Fri',
            'Sat',
            'Sun'
          ]}
          months={[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ]}
          nextComponent={<NextButton />} // Use custom component for Next button
          previousComponent={<PreviousButton />} // Use custom component for Previous button
          todayBackgroundColor="gray"
          selectedDayColor="#0D4744"
          selectedDayTextColor="white" // Change selected date text color to white
          scaleFactor={375}
          textStyle={{
            color: 'black',
          }}
          // customDayHeaderStyles={{ textStyle: { color: 'black' } }} // Customize day header text color
          customDatesStyles={[{ // Add style for selected date circle
            date: selectedDate,
            dateNameStyle: { color: 'white' }, // Text color of selected date
            dateNumberStyle: { color: 'white' }, // Text color of selected date
            style: { backgroundColor: '#0D4744', borderRadius: 20 }, // Background color and circle shape
          }]}
          onDateChange={onDateChange}
        />
      </View>
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#ffffff',
    padding: 16,
    maxHeight: 400,
    maxWidth: 400,
    borderRadius: 15,
  },
});
