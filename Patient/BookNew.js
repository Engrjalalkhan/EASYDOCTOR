import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const NewAppointment = ({ route, navigation }) => {
  // Extract profile image URL and user name from navigation parameters
  const { profileImage, userName } = route.params;

  return (
    <View style={styles.container1}>
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
        <View style={styles.profileContainer}>
          {/* Navigate back to PatientHome when back button is clicked */}
          <TouchableOpacity onPress={() => navigation.navigate('PatientHome', {
            profileImage: profileImage,
            userName: userName,
          })}>
            <Image
              source={require('../Src/images/back.png')}
              style={{ width: 25, height: 25, paddingLeft: 30 }}
            />
          </TouchableOpacity>

          <Text style={styles.userName}>{userName}</Text>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 40,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
          }}>
          {/* Search bar */}
          <View style={styles.searchBar}>
            <Image source={require('../Src/images/search.png')} style={{width:25,height:25,marginVertical:10 }}/>
            <TextInput
              placeholder="Search specialties"
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>

          {/* Title for specialties */}
          <Text style={styles.specialtiesTitle}>Specialties</Text>

          {/* Additional content of the NewAppointment screen */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}>
            {/* Example specialties with circular shapes */}
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/Dental.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Dental</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/heart.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Cardiology</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/bon.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Orthopedic</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/Dental.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Dental</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/heart.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Cardiology</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/bon.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Orthopedic</Text>
            </TouchableOpacity>
            {/* Add more specialties as needed */}
          </ScrollView>
          {/* Title for symptoms */}
          <Text style={styles.specialtiesTitle}>Symptoms</Text>

          {/* ScrollView for symptoms */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}>
            {/* Example symptoms with circular shapes */}
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/fever.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Fever</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/cough.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Cough</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialty}>
              <Image
                source={require('../Src/images/headache.png')}
                style={styles.specialtyIcon}
              />
              <Text style={styles.specialtyText}>Headache</Text>
            </TouchableOpacity>
            {/* Add more symptoms as needed */}
          </ScrollView>
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
    paddingRight: 200,
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Border color
    marginTop:20,
    flexDirection:'row'
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  
  specialtiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf:"flex-start"
  },
  specialtiesContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  specialty: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginStart:10
  },
  specialtyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  specialtyText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
