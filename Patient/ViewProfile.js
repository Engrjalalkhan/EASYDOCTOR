// FeedbackScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import firestore from '@react-native-firebase/firestore';

const FeedbackScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [patientName, setPatientName] = useState(''); // Add patient's name
  const [patientImageUrl, setPatientImageUrl] = useState(''); // Add patient's image URL

  const handleSubmitFeedback = async () => {
    try {
      const feedbackData = {
        feedback,
        rating,
        timestamp: firestore.FieldValue.serverTimestamp(),
        patientName,
        patientImageUrl,
      };
  
      await firestore()
        .collection('Doctors')
        .doc(doctorId)
        .collection('Feedback')
        .add(feedbackData);
  
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting feedback: ', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback for Doctor</Text>
      <Text style={styles.label}>Feedback:</Text>
      <TextInput
        style={styles.input}
        multiline
        value={feedback}
        onChangeText={setFeedback}
      />
      <Text style={styles.label}>Rate:</Text>
      <Rating
        type="star"
        ratingCount={5}
        imageSize={40}
        showRating
        onFinishRating={setRating}
        style={{ paddingVertical: 10 }}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: '#0D4744',
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FeedbackScreen;
