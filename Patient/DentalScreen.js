import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PatientHome = ({ route }) => {
  const [doctors, setDoctors] = useState([]);
  const { specialtyFilter } = route.params;
  const navigation = useNavigation();

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
  };

  const handleCallDoctor = () => {
    // Implement calling functionality here
  };

  const renderDoctorCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={{uri: item.imageUrl}} style={styles.profileImage} />
        <TouchableOpacity onPress={() => handleViewProfile(item.id)}>
          <Text style={styles.viewProfileButton}>View Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.doctorDetails}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Text style={styles.experience}>Years of Experience: {item.experience}</Text>
        {/* Add more doctor details here */}
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
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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

export default PatientHome;
