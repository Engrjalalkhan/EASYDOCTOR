import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PatientProfile = () => {

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
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
    if (!name || !email || !password || !age || !phone || !selectedImage) {
      Alert.alert('Error', 'Please fill out all fields and select a profile image.');
      return;
    }

    try {
      // Upload profile image to Firebase Storage
      const imageRef = storage().ref().child('Patient/' + name);
      await imageRef.putFile(selectedImage);
      const imageUrl = await imageRef.getDownloadURL();
    
      // Save profile data to Firestore in 'patients' collection
      await firestore().collection('Patients').add({
        name,
        email,
        password,
        age,
        phone,
        imageUrl, // URL of the uploaded profile image
      });
      
      // Navigate to Home screen after saving profile
      // Replace 'Home' with the name of your home screen route
      navigation.navigate('PatientHome', {
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
          marginTop: 100,
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
            marginTop: 60,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold',color:'gray'}}>
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
            placeholderTextColor={"gray"}
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
              color:'gray'
            }}
          />
          <TextInput
            placeholder="Age"
            placeholderTextColor={"gray"}
            value={age}
            onChangeText={setAge}
            style={{
              width: 300,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              paddingHorizontal: 10,
              borderRadius: 10,
              color:'gray'
            }}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={"gray"}
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
              color:'gray'
            }}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={"gray"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={"gray"}
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
            style={{
              width: 300,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 20,
              paddingHorizontal: 10,
              borderRadius: 10,
              color:'gray'
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
              marginTop: 20,
            }}
            onPress={handleSaveProfile}>
            <Text style={{color: 'white', fontSize: 18}}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientProfile;
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
    margin: 20,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    width: 300,
    marginBottom: 20,
  },
  passwordInput: {
    width: '90%',
    height: 40,
    paddingHorizontal: 10,
    color: 'gray',
  },
  eyeIcon: {
    padding: -5,
  },
});
