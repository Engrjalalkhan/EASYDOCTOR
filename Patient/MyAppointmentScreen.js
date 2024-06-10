import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
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
            bookingsData.push({ bookingId: bookingDoc.id, doctorData });
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

  const handleBookAppointment = () => {
    navigation.navigate('Book');
  };

  const handleCallDoctor = () => {
    // Implement calling functionality here
  };

  return (
    <View style={styles.container}>
      {bookings.map(({ bookingId, doctorData }) => (
        <View key={bookingId} style={styles.card}>
          {doctorData && doctorData.imageUrl && (
            <View style={styles.profileContainer1}>
              <Image
                source={{ uri: doctorData.imageUrl }}
                style={styles.profileImage1}
              />
              <TouchableOpacity onPress={() => handleViewProfile(doctorData.id)}>
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
            {/* Add more doctor details here */}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleBookAppointment}
              style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Book</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCallDoctor}
              style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Call</Text>
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#0D4744',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default MyAppointmentsScreen;
