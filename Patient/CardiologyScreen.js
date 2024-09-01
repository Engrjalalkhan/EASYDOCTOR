import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PatientHome = ({ route }) => {
  const [doctors, setDoctors] = useState([]);
  const specialtyFilter = 'Cardiology'; // Replace this with the desired specialty
  const navigation = useNavigation();
  const { profileImage, userName } = route.params;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let query = firestore().collection('Doctor');

        // Apply specialty filter if provided
        if (specialtyFilter) {
          query = query.where('specialty', '==', specialtyFilter);
        }

        const doctorsSnapshot = await query.get();
        const doctorsData = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors: ', error);
      }
    };

    fetchDoctors();

    // Cleanup function
    return () => {};
  }, [specialtyFilter]);

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
  


  const renderDoctorCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
        <TouchableOpacity onPress={() => handleViewProfile(item.id)}>
          <Text style={styles.viewProfileButton}>View Feedback</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.doctorDetails}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Text style={styles.experience}>Experience: {item.experience} year</Text>
        <Text style={styles.experience}>Location: {item.clinicAddress}</Text>
        <Text style={styles.experience}>Rasst: {item.rasst}</Text>
        {/* Add more doctor details here */}
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.bookmarkContainer}>
          <TouchableOpacity onPress={() => handleBookmarkDoctor(item)} style={styles.bookmarkButton}>
            <Text style={[styles.bookmarkText, { color: bookmarkedDoctors.includes(item.id) ? 'gold' : 'gray' }]}>⭐</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookAppointment} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCallDoctor} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  
  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            paddingBottom: -30,
          }}>
          EASY + DOCTOR
        </Text>
        <View style={styles.profileContainer1}>
          <Text style={styles.userName}>{userName}</Text>
          <Image source={{ uri: profileImage }} style={styles.profileImage1} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            paddingTop:20,
          }}>
         <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={item => item.id}
      /> 
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#0D4744',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width:350,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'gray'
  },
  specialty: {
    fontSize: 16,
    fontStyle: 'italic',
    color:'gray'
  },
  experience: {
    fontSize: 14,
    marginTop: 5,
    color:'gray'
  },
  viewProfileButton: {
    color: '#0D4744',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
    color:'gray'
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
  profileContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 1,
    paddingTop: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  profileImage1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingRight: 150,
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

export default PatientHome;
