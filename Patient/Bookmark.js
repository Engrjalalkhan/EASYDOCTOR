import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const BookmarkScreen = () => {
  const [bookmarkedDoctors, setBookmarkedDoctors] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBookmarkedDoctors = async () => {
      try {
        const bookmarksSnapshot = await firestore().collection('BookmarkedDoctors').get();
        const bookmarksData = bookmarksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookmarkedDoctors(bookmarksData);
      } catch (error) {
        console.error('Error fetching bookmarked doctors: ', error);
      }
    };

    fetchBookmarkedDoctors();
  }, []);

  const handleViewProfile = (doctorId) => {
    navigation.navigate('FeedbackScreen', { doctorId });
  };
  const handleBookAppointment = () => {
    // Implement booking functionality here
  };

  const handleCallDoctor = () => {
    // Implement calling functionality here
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
        <Text style={styles.experience}>Years of Experience: {item.experience}</Text>
      </View>
      <View style={styles.buttonContainer}>
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
      <FlatList
        data={bookmarkedDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
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
    alignSelf:"center"
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
  },
  specialty: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  experience: {
    fontSize: 14,
    marginTop: 5,
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

export default BookmarkScreen;
