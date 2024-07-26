import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import firestore from '@react-native-firebase/firestore';

const FeedbackCard = ({ feedback }) => {
  useEffect(() => {
    const fetchDoctorIdAndStoreFeedback = async () => {
      try {
        // Fetch the booking document from the Bookings collection
        const bookingDoc = await firestore().collection('Bookings').doc(feedback.bookingId).get();

        if (bookingDoc.exists) {
          const bookingData = bookingDoc.data();
          const doctorId = bookingData.doctorId;

          // Store the feedback in the Feedback collection with the doctorId
          await firestore().collection('Feedback').doc(feedback.id).set({
            ...feedback,
            doctorId: doctorId,
          });

          console.log('Feedback stored successfully with doctorId');
        } else {
          console.log('No such booking document found!');
        }
      } catch (error) {
        console.error('Error fetching doctorId and storing feedback: ', error);
      }
    };

    fetchDoctorIdAndStoreFeedback();
  }, [feedback]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: feedback.patientImageUrl }} style={styles.image} />
        <Text style={styles.patientName}>{feedback.patientName}</Text>
      </View>
      <Text style={styles.feedbackText}>{feedback.feedback}</Text>
      <Rating
        type="star"
        ratingCount={5}
        imageSize={20}
        readonly
        startingValue={feedback.rating}
        style={styles.rating}
      />
      <Text style={styles.timestamp}>{new Date(feedback.timestamp.toDate()).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackText: {
    marginBottom: 5,
  },
  rating: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default FeedbackCard;
