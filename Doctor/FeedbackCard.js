// FeedbackCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Rating } from 'react-native-ratings';

const FeedbackCard = ({ feedback }) => {
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
