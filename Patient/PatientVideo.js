import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
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
            bookingsData.push({ bookingId: bookingDoc.id, doctorId, doctorData });
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

  const handleDelete = async (bookingId) => {
    try {
      await firestore().collection('Bookings').doc(bookingId).delete();
      setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
      Alert.alert('Deleted', 'Booking removed successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleChat = async (doctorId) => {
    try {
      const doctorDoc = await firestore()
        .collection('Doctor')
        .doc(doctorId)
        .get();

      if (doctorDoc.exists) {
        const doctorData = doctorDoc.data();
        const messagesRef = firestore().collection('Messages').doc(doctorId);

        messagesRef.onSnapshot((snapshot) => {
          if (snapshot.exists) {
            const messages = snapshot.data();
            navigation.navigate('PatientChat', { doctorId, doctorData, messages });
          } else {
            navigation.navigate('PatientChat', { doctorId, doctorData, messages: [] });
          }
        });
      } else {
        Alert.alert('Error', 'Doctor not found.');
      }
    } catch (error) {
      console.error('Error checking bookings:', error);
    }
  };

  return (
    <View style={styles.container}>
      {bookings.map(({ bookingId, doctorId, doctorData }) => (
        <View key={bookingId} style={styles.card}>
          {doctorData && doctorData.imageUrl && (
            <View style={styles.profileContainer1}>
              <Image
                source={{ uri: doctorData.imageUrl }}
                style={styles.profileImage1}
              />
              <TouchableOpacity onPress={() => handleViewProfile(doctorId)}>
                <Text style={styles.viewProfileButton}>View Feedback</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctorData?.name}</Text>
            <Text style={styles.specialty}>{doctorData?.specialty}</Text>
            <Text style={styles.experience}>
              Experience: {doctorData?.experience} year
            </Text>
            <Text style={styles.experience}>
              Location: {doctorData?.clinicAddress}
            </Text>
            <Text style={styles.experience}>Rasst: {doctorData?.rasst}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleDelete(bookingId)}
              style={styles.actionButton}>
              <Image
                source={require('../Src/images/red.png')} // Replace with the path to your delete icon image
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleChat(doctorId)}
              style={styles.actionButton}>
              <Image
                source={require('../Src/images/consultation.png')} // Replace with the path to your chat icon image
                style={styles.chatIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 50,
    width: 350,
    justifyContent: 'space-between',
  },
  profileContainer1: {
    alignItems: 'center',
  },
  profileImage1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  viewProfileButton: {
    color: '#0D4744',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialty: {
    fontSize: 14,
    color: '#777',
  },
  experience: {
    fontSize: 14,
    color: '#777',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
  },
  deleteIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  chatIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 5
  },
});

export default MyAppointmentsScreen;
