import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const MyAppointmentsScreen = ({ route, navigation }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsSnapshot = await firestore()
          .collection('Bookings')
          .get();

        const bookingsData = [];
        for (const bookingDoc of bookingsSnapshot.docs) {
          const bookingData = bookingDoc.data();
          const doctorId = bookingData.doctorId;

          const doctorDoc = await firestore()
            .collection('Doctor')
            .doc(doctorId)
            .get();

          if (doctorDoc.exists) {
            const doctorData = doctorDoc.data();
            bookingsData.push({ bookingId: bookingDoc.id, bookingData, doctorData });
          } else {
            console.log(`Doctor with ID ${doctorId} does not exist.`);
          }
        }

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleViewProfile = (doctorId) => {
    navigation.navigate('FeedbackScreen', { doctorId });
  };

  const handleCancelAppointment = async (bookingId) => {
    try {
      const bookingDoc = await firestore().collection('Bookings').doc(bookingId).get();

      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data();
        
        if (bookingData.paymentStatus === 'unpaid') {
          Alert.alert(
            'Cancel Appointment',
            'Are you sure you want to cancel the appointment?',
            [
              {
                text: 'No',
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: async () => {
                  try {
                    await firestore().collection('Bookings').doc(bookingId).delete();
                    setBookings(prevBookings =>
                      prevBookings.filter(booking => booking.bookingId !== bookingId)
                    );
                    console.log('Booking cancelled successfully');
                  } catch (error) {
                    console.error('Error cancelling booking:', error);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert('Alert', 'This appointment cannot be canceled because it is already paid.');
        }
      } else {
        Alert.alert('Error', 'Booking not found.');
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
    }
  };

  const handleRescheduleAppointment = async (bookingId) => {
    try {
      const bookingDoc = await firestore().collection('Bookings').doc(bookingId).get();
      
      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data();
        
        if (bookingData.paymentStatus === 'paid') {
          navigation.navigate('UpdateBook', { bookingId, isRescheduling: true });
        } else {
          Alert.alert('Alert', 'This appointment cannot be rescheduled because it is unpaid.');
        }
      } else {
        Alert.alert('Error', 'Booking not found.');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      Alert.alert('Error', 'Failed to fetch booking details.');
    }
  };

  const renderBooking = ({ item: { bookingId, bookingData, doctorData } }) => (
    <View key={bookingId} style={styles.card}>
      {doctorData && doctorData.imageUrl && (
        <View style={styles.profileContainer1}>
          <Image
            source={{ uri: doctorData.imageUrl }}
            style={styles.profileImage1}
          />
          <TouchableOpacity onPress={() => handleViewProfile(doctorData.id)}>
            <Text style={styles.viewProfileButton}>Feedback</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.doctorDetails}>
        <Text style={{ color: 'gray' }}>{doctorData?.name}</Text>
        <Text style={{ color: 'gray' }}>{doctorData?.specialty}</Text>
        <Text style={{ color: 'gray' }}>Experience: {doctorData?.experience} years</Text>
        <Text style={{ color: 'gray' }}>Location: {doctorData?.clinicAddress}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Doctor Fee: {doctorData?.price}</Text>
        <Text style={{ color: 'gray' }}>Rasst: {doctorData?.rasst}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleCancelAppointment(bookingId)}
          style={[styles.actionButton, styles.cancelButton]}>
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRescheduleAppointment(bookingId)}
          style={[styles.actionButton, styles.rescheduleButton]}>
          <Text style={styles.actionButtonText}>Reschedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.bookingId}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 50,
    width: 320,
    justifyContent: 'space-between',
    alignSelf:'center'
  },
  profileContainer1: {
    alignItems: 'center',
    paddingTop:5
  },
  profileImage1: {
    width: 65,
    height: 65,
    borderRadius: 40,
    marginBottom: 10,
  },
  viewProfileButton: {
    color: '#0D4744',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
    fontSize:12
  },
  doctorDetails: {
    // flex: 1,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    // maxWidth:80
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  rescheduleButton: {
    backgroundColor: 'green',
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default MyAppointmentsScreen;
