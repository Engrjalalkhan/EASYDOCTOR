import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PatientLoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const lastLoginTime = await AsyncStorage.getItem('lastLoginTime');
        const currentTime = Date.now();
        const oneHourInMilliseconds = 60 * 60 * 1000;

        if (lastLoginTime && currentTime - parseInt(lastLoginTime, 10) < oneHourInMilliseconds) {
          const patientEmail = await AsyncStorage.getItem('patientEmail');
          const patientSnapshot = await firestore().collection('Patients').where('email', '==', patientEmail).get();

          if (!patientSnapshot.empty) {
            const patientData = patientSnapshot.docs[0].data();
            navigation.navigate('PatientHome', {
              phone: patientData.phone,
              profileImage: patientData.imageUrl,
              userName: patientData.name,
            });
          }
        }
      } catch (error) {
        console.error('Error checking login status: ', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      const patientSnapshot = await firestore().collection('Patients').where('email', '==', email).get();
      if (!patientSnapshot.empty) {
        const patientData = patientSnapshot.docs[0].data();

        await AsyncStorage.setItem('lastLoginTime', Date.now().toString());
        await AsyncStorage.setItem('patientEmail', email);

        navigation.navigate('PatientHome', {
          phone: patientData.phone,
          profileImage: patientData.imageUrl,
          userName: patientData.name,
        });
      } else {
        Alert.alert('Error', 'Patient profile not found.');
        navigation.navigate('PatientProfile')
      }
    } catch (error) {
      console.error('Login error: ', error);
      Alert.alert('Error', 'Failed to login. Please check your credentials and try again.');
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
      <Text style={styles.title}>Patient Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          height: 40,
          width: '50%',
          backgroundColor: '#0D4744',
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"#0D4744"
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default PatientLoginScreen;
