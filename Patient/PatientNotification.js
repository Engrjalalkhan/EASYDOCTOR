import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PatientNotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkBookings = async () => {
      const bookingsRef = firestore().collection('bookings');

      const snapshot = await bookingsRef.get();

      const currentTime = new Date();

      const newNotifications = [];

      snapshot.forEach((doc) => {
        const bookingData = doc.data();
        const eveningSlot = bookingData.eveningslot;
        const morningSlot = bookingData.morningslot;

        if (eveningSlot) {
          const appointmentTimestamp = eveningSlot.toDate(); // Convert Firestore timestamp to JavaScript Date object

          // Calculate time difference in milliseconds
          const timeDifference = appointmentTimestamp.getTime() - currentTime.getTime();

          // Convert time difference to hours
          const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

          // Check if less than or equal to 1 hour
          if (timeDifferenceInHours <= 1 && timeDifferenceInHours >= 0) {
            let message = `Your evening appointment is in one hour.`;
            newNotifications.push({ message });
          }
        }

        if (morningSlot) {
          const appointmentTimestamp = morningSlot.toDate(); // Convert Firestore timestamp to JavaScript Date object

          // Calculate time difference in milliseconds
          const timeDifference = appointmentTimestamp.getTime() - currentTime.getTime();

          // Convert time difference to hours
          const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

          // Check if less than or equal to 1 hour
          if (timeDifferenceInHours <= 1 && timeDifferenceInHours >= 0) {
            let message = `Your morning appointment is in one hour.`;
            newNotifications.push({ message });
          }
        }
      });

      setNotifications(newNotifications);
    };

    checkBookings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No notifications</Text>
      )}
    </View>
  );
};

export default PatientNotificationScreen;
