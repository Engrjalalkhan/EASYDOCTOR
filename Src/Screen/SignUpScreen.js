import React, {useState} from 'react';
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
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const SignUpWithMobileScreen = ({navigation}) => {
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
            value={name}
            onChangeText={text => setName(text)}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
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
              keyboardType="numeric"
              value={phone}
              onChangeText={text => setPhone(text)}
            />
          </View>

          <Text style={[styles.label, {marginTop: 20}]}>Password</Text>
          <TouchableOpacity
            style={styles.showPasswordContainer}
            onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showPasswordText}>
              {showPassword ? 'Hide' : 'Show'} password
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => setPassword(text)}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
          />

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
  },
  showPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 5,
    paddingHorizontal: 30,
  },
  showPasswordText: {
    color: '#599CA5',
    fontSize: 16,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
