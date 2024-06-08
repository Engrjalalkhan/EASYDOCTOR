import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const MyPatientsScreen = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch patients data from Firestore
    const unsubscribe = firestore()
      .collection('Patients')
      .onSnapshot(snapshot => {
        const patientsData = [];
        snapshot.forEach(doc => {
          patientsData.push({ id: doc.id, ...doc.data() });
        });
        setPatients(patientsData);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
      
      </View>
      <View style={styles.patientDetails}>
        <Text style={styles.text}>Name: {item.name}</Text>
        <Text style={styles.text}>Symptom: {item.symptom}</Text>
        <Text style={styles.text}>Age: {item.age}</Text>
        <Text style={styles.text}>Complications: {item.complications}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  patientDetails: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default MyPatientsScreen;
