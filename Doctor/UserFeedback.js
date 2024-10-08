import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorHomeScreen = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Step 1: Fetch the current doctor's ID from the Bookings collection
        const bookingsSnapshot = await firestore().collection('Bookings').limit(1).get(); // Adjust as needed
        if (bookingsSnapshot.empty) {
          Alert.alert('No Bookings Found', 'No bookings found for the current doctor.');
          setLoading(false);
          return;
        }

        // Assuming that the doctorId is the same for all bookings
        const doctorId = bookingsSnapshot.docs[0].data().doctorId;

        // Step 2: Fetch feedbacks from the Feedback collection where doctorId matches
        const feedbackSnapshot = await firestore().collection('feedback').where('doctorId', '==', doctorId).get();
        const feedbackList = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(feedbackList);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Unable to fetch feedbacks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await firestore().collection('feedback').doc(feedbackId).delete();
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
      Alert.alert('Deleted', 'Feedback has been deleted.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to delete feedback. Please try again later.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.feedbackCard}>
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>{item.feedback}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating:</Text>
          <Text style={styles.ratingValue}>{item.rating}</Text>
          <AirbnbRating
            count={1}
            defaultRating={item.rating}
            size={20}
            showRating={false}
            selectedColor="#FFD700"
            isDisabled
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDeleteFeedback(item.id)} style={styles.deleteButton}>
      <Icon name="delete" size={30} color="#dc3d3d" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D4744" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feedbacks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyListText}>No feedback available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  feedbackCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 5,
    color:"gray"
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    paddingTop: 350,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginRight: 5,
    fontSize: 16,
    color: '#888',
  },
  ratingValue: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  deleteButton: {
    paddingTop: 5,
    alignSelf:'baseline',
    
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
});

export default DoctorHomeScreen;
