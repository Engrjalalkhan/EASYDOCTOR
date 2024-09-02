import React, { useEffect, useState } from 'react';
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

const NewAppointment = ({ route, navigation }) => {
  const { profileImage, userName } = route.params;
  const [topDoctors, setTopDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        // Fetch top doctor IDs from TopDoctor collection
        const topDoctorSnapshot = await firestore()
          .collection('TopDoctor')
          .get();
        const doctorIds = topDoctorSnapshot.docs.map(
          doc => doc.data().doctorId,
        );

        // Fetch detailed doctor data from Doctor collection
        const doctorPromises = doctorIds.map(async id => {
          const doctorDoc = await firestore()
            .collection('Doctor')
            .doc(id)
            .get();
          return { id: doctorDoc.id, ...doctorDoc.data() };
        });

        const doctorsList = await Promise.all(doctorPromises);
        setTopDoctors(doctorsList);
        setFilteredDoctors(doctorsList); // Initialize filteredDoctors
      } catch (error) {
        console.error('Error fetching top doctors:', error);
      }
    };

    fetchTopDoctors();
  }, []);

  useEffect(() => {
    // Filter doctors based on search query
    const filtered = topDoctors.filter(doctor => {
      const query = searchQuery.toLowerCase();
      return (
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.clinicAddress.toLowerCase().includes(query)
      );
    });
    setFilteredDoctors(filtered);
  }, [searchQuery, topDoctors]);

  const handlePress = option => {
    navigation.navigate(option, {
      profileImage: profileImage,
      userName: userName,
    });
  };

  const handleViewProfile = (doctorId) => {
    navigation.navigate('FeedbackScreen', { doctorId });
  };

  const handleBookAppointment = () => {
    // Implement booking functionality here
    navigation.navigate("Book");
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
    <View style={styles.container1}>
      <View style={styles.content}>
        <Text style={styles.headerText}>EASY + DOCTOR</Text>
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>
        <View style={styles.mainContent}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search name, specialty, location"
              style={styles.searchInput}
              placeholderTextColor="#999"
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
            />
            <Image
              source={require('../Src/images/search.png')}
              style={styles.searchIcon}
            />
          </View>
          <Text style={styles.specialtiesTitle}>Specialties</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}>
            <TouchableOpacity
              style={styles.specialty}
              onPress={() => handlePress('DentalScreen')}>
              <Image
                source={require('../Src/images/Dental.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Dentistry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.specialty}
              onPress={() => handlePress('CardiologyScreen')}>
              <Image
                source={require('../Src/images/heart.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Cardiology</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.specialty}
              onPress={() => handlePress('PediatricsScreen')}>
              <Image
                source={require('../Src/images/children.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Pediatrics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.specialty}
              onPress={() => handlePress('DermatologyScreen')}>
              <Image
                source={require('../Src/images/skin.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Dermatology</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.specialty}
              onPress={() => handlePress('BrainScreen')}>
              <Image
                source={require('../Src/images/brain.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Brain</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.specialty}
              onPress={() => handlePress('OrthopedicScreen')}>
              <Image
                source={require('../Src/images/bon.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Orthopedic</Text>
            </TouchableOpacity>
          </ScrollView>
          <Text style={styles.topDoctorsTitle}>Top Doctors</Text>
          {filteredDoctors.map(doctor => (
            <View key={doctor.id} style={styles.card}>
              <View style={styles.profileContainer1}>
                <Image
                  source={{ uri: doctor.imageUrl }}
                  style={styles.profileImage1}
                />
                <TouchableOpacity onPress={() => handleViewProfile(doctor.id)}>
                  <Text style={styles.viewProfileButton}>View Feedback</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.doctorDetails}>
                <Text style={{color:'gray'}}>{doctor.name}</Text>
                <Text style={{color:'gray'}}>{doctor.specialty}</Text>
                <Text style={{color:'gray'}}>
                  Experience: {doctor.experience} year
                </Text>
                <Text style={{color:'gray'}}>
                  Location: {doctor.clinicAddress}
                </Text>
                <Text style={{color:'gray'}}>Rasst: {doctor.rasst}</Text>
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
                      ⭐
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={handleBookAppointment}
                  style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Book</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={handleCallDoctor}
                  style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NewAppointment;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#0D4744',
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: -30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 1,
    paddingTop: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  profileImage: {
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
  mainContent: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    height:650
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 20,
    flexDirection: 'row',
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginVertical: 10,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  specialtiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  specialtiesContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  specialty: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginStart: 10,
  },
  specialtyIcon: {
    width: 60,
    height: 65,
    borderRadius: 30,
    marginBottom: 10,
  },
  specialtyText: {
    color: 'black',
    fontWeight: 'bold',
  },
  topDoctorsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'flex-start',
    color:'gray'
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
