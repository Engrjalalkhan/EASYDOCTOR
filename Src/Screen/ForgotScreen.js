import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
const ForgotScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return; // Exit the function if email is empty
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions on how to reset your password.',
      );
      navigation.navigate('SignIn');
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
      <View style={styles.container2}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={"gray"}
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Reset password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ForgotScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  container1: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#0D4744',
    height: 350,
    width: '120%',
    borderBottomEndRadius: 500,
    borderBottomStartRadius: 500,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 30,
    color:'gray'
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
    color:"gray"
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
