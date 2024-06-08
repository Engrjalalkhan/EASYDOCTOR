import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  ScrollView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';

const specialties = [
  'Cardiology',
  'Dermatology',
  'Dentistry',
  'Brain',
  'Orthopedics',
  'Pediatrics',
  // Add more specialties as needed
];

const clinicAddresses = [
  'Islamabad',
  'Peshawar',
  'Lahore',
  'Karachi',
  'Bannu',
  'Rawalpindi',
  'Gujranwala',
  'Faisalabad',
  'Quetta',
  'Bahawalpur',
  'DI Khan',
  // Add more addresses as needed
];

const DoctorProfile = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [rasst, setRasst] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePicker = source => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true, // Enable circular crop
    })
      .then(image => {
        setSelectedImage(image.path);
        setModalVisible(false);
      })
      .catch(error => {
        console.log(error);
        setModalVisible(false);
      });
  };

  const handleCameraPicker = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true, // Enable circular crop
    })
      .then(image => {
        setSelectedImage(image.path);
        setModalVisible(false);
      })
      .catch(error => {
        console.log(error);
        setModalVisible(false);
      });
  };

  const handleSaveProfile = async () => {
    // Validate input fields
    if (
      !name ||
      !email ||
      !password ||
      !specialty ||
      !experience ||
      !clinicAddress ||
      !rasst||
      !selectedImage
    ) {
      Alert.alert(
        'Error',
        'Please fill out all fields and select a profile image.',
      );
      return;
    }

    try {
      // Upload profile image to Firebase Storage
      const imageRef = storage()
        .ref()
        .child('Doctors/' + name);
      await imageRef.putFile(selectedImage);
      const imageUrl = await imageRef.getDownloadURL();

      // Save profile data to Firestore
      await firestore().collection('Doctor').add({
        name,
        email,
        password,
        specialty,
        experience,
        clinicAddress,
        rasst,
        imageUrl, // URL of the uploaded profile image
      });

      // Navigate to Patient Home screen after saving profile
      navigation.navigate('HomeScreen', {
        specialtyFilter: specialty, // Pass the selected specialty as navigation parameter
        profileImage: imageUrl, // Pass profile image URL as navigation parameter
        userName: name, // Pass user's name as navigation parameter
      });
    } catch (error) {
      console.error('Error saving profile: ', error);
      Alert.alert('Error', 'Failed to save profile. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 40,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
          EASY + DOCTOR
        </Text>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            width: 380,
            marginTop: 20,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Please Provide Your Details !!
          </Text>
          {/* Profile image placeholder */}
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => setModalVisible(true)}>
            {selectedImage ? (
              <Image
                source={{uri: selectedImage}}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require('../Src/images/ProfilePlaceholder.png')}
                style={styles.profileImage}
              />
            )}
            
          </TouchableOpacity>

          {/* Modal with options */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleImagePicker('gallery')}>
                  <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleCameraPicker}>
                  <Text style={styles.optionText}>Take a Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{
              width: 300,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{
              width: 300,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={{
              width: 300,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              width: 300,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 20,
              borderRadius: 10,
            }}>
            <Picker
              selectedValue={specialty}
              onValueChange={itemValue => setSpecialty(itemValue)}
              style={{height: '8%', width: '100%'}}>
              <Picker.Item label="Select Specialty" value="" />
              {specialties.map(spec => (
                <Picker.Item label={spec} value={spec} key={spec} />
              ))}
            </Picker>
          </View>
          <View
            style={{
              width: 300,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 20,
              borderRadius: 10,
            }}>
            <Picker
              selectedValue={clinicAddress}
              onValueChange={itemValue => setClinicAddress(itemValue)}
              style={{height: '8%', width: '100%'}}>
              <Picker.Item label="Select Clinic Address" value="" />
              {clinicAddresses.map(address => (
                <Picker.Item label={address} value={address} key={address} />
              ))}
            </Picker>
          </View>
          <TextInput
            placeholder="Years of Experience"
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            style={{
              width: 300,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 20,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          />
          <TextInput
            placeholder="Rasst ID for Payment"
            value={rasst}
            onChangeText={setRasst}
            keyboardType="numeric"
            style={{
              width: 300,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 20,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#0D4744',
              width: '50%',
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
            }}
            onPress={handleSaveProfile}>
            <Text style={{color: 'white', fontSize: 18}}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D4744',
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    color: 'black',
  },
});
