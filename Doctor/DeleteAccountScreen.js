import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DeleteAccountScreen = ({ navigation }) => {
  const handleDeleteAccount = async () => {
    try {
      // Delete the doctor profile from Firebase Firestore
      await firestore().collection('users').doc('doctorProfileId').delete(); // Replace 'doctorProfileId' with the actual ID of the doctor profile
      // Navigate to the splash screen upon successful deletion
      navigation.navigate('Splash');
    } catch (error) {
      console.error('Error deleting account: ', error);
      Alert.alert('Error', 'Failed to delete account. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.description}>
        Are you sure you want to delete your account? This action cannot be
        undone.
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeleteAccountScreen;
