import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AirbnbRating } from 'react-native-ratings';
import { useNavigation } from '@react-navigation/native';

const FeedbackScreen = ({ route }) => {
  const navigation = useNavigation();
  const { doctorId: initialDoctorId, profileImage, userName } = route.params;
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorSnapshot = await firestore().collection('Doctor').get();
        const doctorList = doctorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(doctorList);
        setLoading(false);

        if (initialDoctorId) {
          const doctorExists = doctorList.some(doctor => doctor.id === initialDoctorId);
          if (!doctorExists) {
            Alert.alert('Error', 'Selected doctor does not exist.');
            setSelectedDoctor('');
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Unable to fetch doctors. Please try again later.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [initialDoctorId]);

  const submitFeedback = async () => {
    if (!selectedDoctor) {
      Alert.alert('Error', 'Please select a doctor.');
      return;
    }
  
    if (!feedback || rating === 0) {
      Alert.alert('Error', 'Please provide feedback and a rating.');
      return;
    }
  
    try {
      // Add feedback to the 'feedback' collection with doctorId as the document ID
      const feedbackDocRef = firestore().collection('feedback').doc(selectedDoctor);
      await feedbackDocRef.set({
        doctorId: selectedDoctor,
        feedback: feedback,
        rating: rating,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Check if the rating is positive (greater than 3)
      if (rating > 3) {
        // Add the doctor to the 'TopDoctor' collection
        await firestore().collection('TopDoctor').doc(selectedDoctor).set({
          doctorId: selectedDoctor,
          feedback: feedback,
          rating: rating,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }
  
      Alert.alert('Success', 'Thank you for your feedback!');
      setFeedback('');
      setRating(0);
      setSelectedDoctor(initialDoctorId || '');
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D4744" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>
          EASY + DOCTOR
        </Text>
        <View style={styles.profileContainer1}>
          {/* <Text style={styles.userName}>{userName}</Text>
          <Image source={{ uri: profileImage }} style={styles.profileImage} /> */}
        </View>
        <View style={styles.feedbackContainer}>
          <Text style={styles.title}>Submit Feedback</Text>
          <AirbnbRating
            count={5}
            reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
            defaultRating={0}
            size={30}
            onFinishRating={setRating}
          />
          <TextInput
            style={styles.input}
            placeholder="Write your feedback here"
            placeholderTextColor={"gray"}
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />
          <TouchableOpacity
            onPress={submitFeedback}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#0D4744',
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: -30,
  },
  profileContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 1,
    paddingTop: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  profileImage1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingRight: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"gray"
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    width: "80%",
    borderRadius: 10,
    color:"gray"
  },
  submitButton: {
    height: 40,
    width: '50%',
    backgroundColor: '#0D4744',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  }
});

export default FeedbackScreen;
