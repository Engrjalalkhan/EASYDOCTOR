import React, {useState} from 'react';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const DeleteAccountScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const deleteAllAccounts = async () => {
    setLoading(true);
    try {
      // Fetch all documents from the Doctor collection
      const doctorSnapshot = await firestore().collection('Doctor').get();
      const doctorDocs = doctorSnapshot.docs;

      // Fetch all documents from the TopDoctor collection
      const topDoctorSnapshot = await firestore().collection('TopDoctor').get();
      const topDoctorDocs = topDoctorSnapshot.docs;

      // Create a map of doctorId from TopDoctor collection
      const topDoctorIds = new Set(topDoctorDocs.map(doc => doc.data().doctorId));

      // Find matching documents in Doctor collection and delete from both collections
      const deletePromises = doctorDocs
        .filter(doc => topDoctorIds.has(doc.id))  // Check if document ID exists in TopDoctor collection
        .flatMap(doc => [
          doc.ref.delete(),  // Delete from Doctor collection
          firestore().collection('TopDoctor').doc(doc.id).delete(),  // Delete from TopDoctor collection
        ]);

      await Promise.all(deletePromises);

      Alert.alert('Success', 'The accounts have been deleted successfully.', [
        {text: 'OK', onPress: () => navigation.navigate('Splash')},
      ]);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the accounts.');
      console.error('Error deleting accounts:', error);
    }
    setLoading(false);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', color: "black"}}>
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
          borderRadius: 15,
          marginTop: 20,
        }}>
        <Text style={{color: 'white', fontSize: 18}}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccountScreen;
