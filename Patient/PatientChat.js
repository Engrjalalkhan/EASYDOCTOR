import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <ScrollView style={styles.scrollContainer}>
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
                  <Text style={styles.viewProfileButton}>Feedback</Text>
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
                <Icon name="delete" size={30} color="#dc3d3d" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChat(doctorId)}
                style={styles.actionButton}>
                <Icon name="comment" size={25} color="#dc3d3d" style={styles.logo} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
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
    padding:10
  },
  profileImage1: {
    width: 70,
    height: 70,
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
    color:'gray'
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
    marginBottom: 5,
    padding: 5,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
  },
});

export default MyAppointmentsScreen;
