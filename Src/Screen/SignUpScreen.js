import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpWithMobileScreen = ({ navigation }) => {
  const [country, setCountry] = useState({
    name: 'United States',
    cca2: 'US',
    callingCode: '1',
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false); // State to track if the user is signed up

  useEffect(() => {
    // Check if the user is signed up
    checkIfSignedUp();
  }, []);

  const checkIfSignedUp = async () => {
    try {
      const value = await AsyncStorage.getItem('isSignedUp');
      if (value !== null) {
        setIsSignedUp(true);
      }
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      // Additional logic like sending verification email can be added here
      Alert.alert('Success', 'User registered successfully!');
      navigation.navigate('SignIn'); // Navigate to sign in screen after successful registration
      // Store signup status
      await AsyncStorage.setItem('isSignedUp', 'true');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
          EASY + DOCTOR
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#888888"
            value={name}
            onChangeText={text => setName(text)}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888888"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <Text style={styles.label}>Mobile Number</Text>
          <View
            style={{flexDirection: 'row', paddingLeft: 30, paddingRight: 40}}>
            <CountryPicker
              {...{
                onSelect: country => setCountry(country),
                countryCode: country.cca2,
                withCallingCode: true,
                withFilter: true,
                withCallingCodeButton: true,
                withFlag: true,
                withAlphaFilter: true,
                withModal: true,
                withEmoji: true,
                onSelect: country => setCountry(country),
              }}
              containerButtonStyle={styles.countryPicker}
            />

            <TextInput
              style={styles.input}
              placeholder=" Phone Number"
              placeholderTextColor="#888888"
              keyboardType="numeric"
              value={phone}
              onChangeText={text => setPhone(text)}
            />
          </View>

          <Text style={[styles.label, {marginTop: 20}]}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={{flex: 1,color:'gray'}}
              placeholder="Enter your password"
              placeholderTextColor="#888888"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={{flex: 1,color:'gray'}}
              placeholder="Confirm your password"
              placeholderTextColor="#888888"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpWithMobileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container1: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#0D4744',
    height: 250,
    width: '120%',
    marginBottom: 30,
    borderBottomEndRadius: 500,
    borderBottomStartRadius: 500,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 30,
    color: 'gray',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'gray',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#0D4744',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countryPicker: {
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
  },
});
