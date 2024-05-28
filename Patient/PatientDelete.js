import React, { useState } from 'react';
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const DeleteAccountScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const deleteAllAccounts = async () => {
    setLoading(true);
    try {
      // Query all documents from the Doctor collection
      const querySnapshot = await firestore().collection('Patients').get();

      // Delete each document
      const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);

      Alert.alert(
        'Success',
        'All accounts have been deleted successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate('Splash') }]
      );
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the accounts.');
      console.error('Error deleting accounts:', error);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontSize: 18, fontWeight: 'bold', color:"black"}}>
        Are you sure you want to delete accounts?
      </Text>
      <TouchableOpacity
        onPress={deleteAllAccounts}
        style={{
          width: '50%',
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D4744',
          borderRadius:15,
          marginTop:20
        }}>
        <Text style={{color: 'white', fontSize: 18}}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccountScreen;
