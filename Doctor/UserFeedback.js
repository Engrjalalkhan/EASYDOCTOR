import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const DoctorHome = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctorId = 'logged_in_doctor_id'; // Replace with the actual logged-in doctor's ID

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackSnapshot = await firestore()
          .collection('feedback')
          .where('doctorId', '==', doctorId)
          .get();

        const feedbackList = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(feedbackList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback: ', error);
        setLoading(false);
      }
    };

    fetchFeedbacks();

    // Cleanup function
    return () => {};
  }, [doctorId]);

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.feedbackText}>Feedback: {item.feedback}</Text>
      <Text style={styles.ratingText}>Rating: {item.rating}</Text>
      <Text style={styles.dateText}>Date: {item.createdAt?.toDate().toLocaleDateString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Received Feedback</Text>
      <FlatList
        data={feedbacks}
        renderItem={renderFeedbackItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.noFeedbackText}>No feedback available.</Text>}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 5,
  },
  noFeedbackText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DoctorHome;
