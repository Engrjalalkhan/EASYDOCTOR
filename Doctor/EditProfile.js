import React, { useState, useEffect } from 'react';
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
  Alert
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userData = await firestore().collection('users').doc(currentUser.uid).get();
          if (userData.exists) {
            const { name, email, experience, imageUrl } = userData.data();
            setName(name);
            setEmail(email);
            setExperience(experience);
            setSelectedImage(imageUrl);
            setUserId(currentUser.uid);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true, // Enable circular crop
    })
      .then(image => {
        setSelectedImage(image.path);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSaveProfile = async () => {
    try {
      // Upload profile image to Firebase Storage
      let imageUrl = selectedImage;
      if (selectedImage !== null) {
        const imageRef = storage().ref().child('profile_images/' + userId);
        await imageRef.putFile(selectedImage);
        imageUrl = await imageRef.getDownloadURL();
      }

      // Update user data in Firestore
      await firestore().collection('users').doc(userId).update({
        name,
        email,
        experience,
        imageUrl,
      });

      // Navigate back to profile screen
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleImagePicker}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.profileImage} />
          ) : (
            <Image source={require('../Src/images/ProfilePlaceholder.png')} style={styles.profileImage} />
          )}
          <Image source={require('../Src/images/edit-icon.png')} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Experience"
        value={experience}
        onChangeText={setExperience}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default EditProfile;
