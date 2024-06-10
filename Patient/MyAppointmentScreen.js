import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const MyAppointmentsScreen = ({route, navigation}) => {
  const {profileImage, userName} = route.params;
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch top doctor IDs from TopDoctor collection
        const bookingsSnapshot = await firestore()
          .collection('Bookings')
          .get();
        const doctorId = bookingsSnapshot.docs.map(
          doc => doc.data().doctorId,
        );

        // Fetch detailed doctor data from Doctor collection
        const doctorPromises = doctorId.map(async id => {
          const doctorDoc = await firestore()
            .collection('Doctor')
            .doc(id)
            .get();
          return {id: doctorDoc.id, ...doctorDoc.data()};
        });

        const doctorsList = await Promise.all(doctorPromises);
        setBookings(doctorsList);
      } catch (error) {
        console.error('Error fetching top doctors:', error);
      }
    };

    fetchBookings();
  }, []);

  // const handlePress = option => {
  //   navigation.navigate(option, {
  //     profileImage: profileImage,
  //     userName: userName,
  //   });
  // };
  const handleViewProfile = (doctorId) => {
    navigation.navigate('FeedbackScreen', { doctorId });
  };

  const handleBookAppointment = () => {
    // Implement booking functionality here
    navigation.navigate("Book")
  };

  const handleCallDoctor = () => {
    // Implement calling functionality here
  };
  const [bookmarkedDoctors, setBookmarkedDoctors] = useState([]);

  const handleBookmarkDoctor = async (doctor) => {
    try {
      // Check if the doctor is already bookmarked
      const bookmarkSnapshot = await firestore()
        .collection('BookmarkedDoctors')
        .where('id', '==', doctor.id)
        .get();
  
      if (!bookmarkSnapshot.empty) {
        // Doctor is already bookmarked, remove it
        const docId = bookmarkSnapshot.docs[0].id;
        await firestore().collection('BookmarkedDoctors').doc(docId).delete();
        setBookmarkedDoctors(prevBookmarkedDoctors =>
          prevBookmarkedDoctors.filter(bookmarkedDoctor => bookmarkedDoctor.id !== doctor.id)
        );
      } else {
        // Doctor is not bookmarked, add it
        await firestore().collection('BookmarkedDoctors').add(doctor);
        setBookmarkedDoctors(prevBookmarkedDoctors => [...prevBookmarkedDoctors, doctor]);
      }
    } catch (error) {
      console.error('Error toggling bookmark for doctor: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {bookings.map(doctor => (
            <View key={doctor.id} style={styles.card}>
              <View style={styles.profileContainer1}>
                <Image
                  source={{uri: doctor.imageUrl}}
                  style={styles.profileImage1}
                />
                <TouchableOpacity onPress={() => handleViewProfile(doctor.id)}>
                  <Text style={styles.viewProfileButton}>View Feedback</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
                <Text style={styles.experience}>
                  Experience: {doctor.experience} year
                </Text>
                <Text style={styles.experience}>
                  Location: {doctor.clinicAddress}
                </Text>
                <Text style={styles.experience}>Rasst: {doctor.rasst}</Text>
                {/* Add more doctor details here */}
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.bookmarkContainer}>
                  <TouchableOpacity
                    onPress={() => handleBookmarkDoctor(doctor)}
                    style={styles.bookmarkButton}>
                    <Text
                      style={[
                        styles.bookmarkText,
                        {
                          color: bookmarkedDoctors.includes(doctor.id)
                            ? 'gold'
                            : 'gray',
                        },
                      ]}>
                      🔖
                    </Text>
                  </TouchableOpacity>
                </View>
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
    width:350,
    justifyContent:'space-between',
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
  bookmarkButton: {
    alignItems: 'center',
    width: 50,
    height: 50,
    top: 10,
    right: 10,
    paddingLeft:20
  },
  bookmarkText: {
    fontSize: 24,
  },
});

export default MyAppointmentsScreen;
