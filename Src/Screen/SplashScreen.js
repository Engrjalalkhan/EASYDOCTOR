import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const checkDoctorExistence = async () => {
    setLoading(true);
    try {
      const doctorSnapshot = await firestore().collection('Doctor').limit(1).get();
      if (!doctorSnapshot.empty) {
        navigation.navigate('DoctorLogin');
      } else {
        navigation.navigate('DoctorProfile');
      }
    } catch (error) {
      console.error('Error checking doctor existence: ', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkPatientsExistence = async () => {
    setLoading(true);
    try {
      const patientSnapshot = await firestore().collection('Patients').limit(1).get();
      if (!patientSnapshot.empty) {
        navigation.navigate('PatientLogin');
      } else {
        navigation.navigate('PatientProfile');
      }
    } catch (error) {
      console.error('Error checking patient existence: ', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
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
      <View style={styles.container1}>
        <Image source={require('../images/Logo.png')} style={styles.logo} />
        <Text style={styles.logoText}>EASY + DOCTOR</Text>
      </View>
      <Text style={styles.choiceText}>Choose Your Profile !!</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={checkDoctorExistence}>
          <Text style={styles.buttonText}>Doctor</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.orText}> OR </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={checkPatientsExistence}>
          <Text style={styles.buttonText}>Patient</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 180,
  },
  container1: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#0D4744',
    height: '80%',
    width: '120%',
    marginBottom: 40,
    borderBottomEndRadius: 500,
    borderBottomStartRadius: 500,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  choiceText: {
    fontSize: 24,
    marginBottom: 30,
    color:"gray"
  },
  buttonsContainer: {
    marginBottom: 20,
    width: '50%',
  },
  button: {
    backgroundColor: '#0D4744',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
