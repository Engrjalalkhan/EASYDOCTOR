import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const EditProfile = ({ navigation, route }) => {
  const [selectedImage, setSelectedImage] = useState(route.params?.profileImage || null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          setUserId(userId);
          const userDataSnapshot = await firestore().collection('users').doc(userId).get();
          if (userDataSnapshot.exists) {
            const userData = userDataSnapshot.data();
            setName(userData.name);
            setEmail(userData.email);
            setExperience(userData.experience);
            setSelectedImage(userData.imageUrl || null);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };
    fetchUserData();
  }, []);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
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
      let imageUrl = selectedImage;
      if (selectedImage !== null) {
        // Use the updated name to save the image with the correct filename
        const imageRef = storage().ref().child('profile_images/' + name);
        await imageRef.putFile(selectedImage);
        imageUrl = await imageRef.getDownloadURL();
      }

      const userDocRef = firestore().collection('users').doc(userId);
      const userDocSnapshot = await userDocRef.get();

      if (userDocSnapshot.exists) {
        await userDocRef.update({
          name,
          email,
          experience,
          imageUrl,
        });
      } else {
        await userDocRef.set({
          name,
          email,
          experience,
          imageUrl,
        });
      }

      navigation.navigate('Home', {
        profileImage: imageUrl,
        userName: name,
      });
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
      <Image
        source={require('../Src/images/ProfilePlaceholder.png')}
        style={styles.profileImage}
      />
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
    bottom: 5,
    left: 30,
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: 1,
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
