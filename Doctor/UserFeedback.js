import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DoctorHomeScreen = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch feedback data from Firestore
    const unsubscribe = firestore().collection('Feedback').onSnapshot(snapshot => {
      const feedbackList = [];
      snapshot.forEach(doc => {
        const { doctorId, feedback, rating, timestamp } = doc.data();
        feedbackList.push({
          id: doc.id,
          doctorId,
          feedback,
          rating,
          timestamp
        });
      });
      setFeedbacks(feedbackList);
    });

    // Unsubscribe from snapshot listener when component unmounts
    return () => unsubscribe();
  }, []);

  const renderFeedbackCard = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.patientName}>Patient ID: {item.id}</Text>
          <Text style={styles.feedback}>Rating: {item.rating}</Text>
          <Text style={styles.feedback}>Feedback: {item.feedback}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient Feedback</Text>
      <FlatList
        data={feedbacks}
        renderItem={renderFeedbackCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    marginBottom: 15,
  },
  cardContent: {
    padding: 15,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  feedback: {
    fontSize: 16,
  },
});

export default DoctorHomeScreen;