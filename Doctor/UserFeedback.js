import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';

const DoctorHomeScreen = () => {
  const navigation = useNavigation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackSnapshot = await firestore().collection('feedback').get();
        const feedbackList = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(feedbackList);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Unable to fetch feedbacks. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.feedbackCard}>
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>{item.feedback}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating:</Text>
          <Text style={styles.ratingValue}>{item.rating}</Text>
          <AirbnbRating
            count={1}
            defaultRating={item.rating} // Set the initial rating from the feedback
            size={20}
            showRating={false} // Hide the rating text from the star
            selectedColor="#FFD700" // Color for the filled star
            isDisabled
          />
        </View>
      </View>
    </TouchableOpacity>
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
  },
  feedbackCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    paddingTop:350
  },
    feedbackText: {
      fontSize: 16,
      marginBottom: 5,
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
});

export default DoctorHomeScreen;
