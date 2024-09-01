import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const DoctorLoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const lastLoginTime = await AsyncStorage.getItem('lastLoginTime');
        const currentTime = Date.now();
        const oneHourInMilliseconds = 60 * 60 * 1000;

        if (
          lastLoginTime &&
          currentTime - parseInt(lastLoginTime, 10) < oneHourInMilliseconds
        ) {
          const doctorEmail = await AsyncStorage.getItem('doctorEmail');
          const doctorSnapshot = await firestore()
            .collection('Doctor')
            .where('email', '==', doctorEmail)
            .get();

          if (!doctorSnapshot.empty) {
            const doctorData = doctorSnapshot.docs[0].data();
            navigation.navigate('Home', {
              specialtyFilter: doctorData.specialty,
              profileImage: doctorData.imageUrl,
              userName: doctorData.name,
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
      const doctorSnapshot = await firestore()
        .collection('Doctor')
        .where('email', '==', email)
        .get();
      if (!doctorSnapshot.empty) {
        const doctorData = doctorSnapshot.docs[0].data();

        await AsyncStorage.setItem('lastLoginTime', Date.now().toString());
        await AsyncStorage.setItem('doctorEmail', email);

        navigation.navigate('Home', {
          specialtyFilter: doctorData.specialty,
          profileImage: doctorData.imageUrl,
          userName: doctorData.name,
        });
      } else {
        navigation.navigate('DoctorProfile');
        Alert.alert('Error', 'Doctor profile not found.');
      }
    } catch (error) {
      console.error('Login error: ', error);
      Alert.alert(
        'Error',
        'Failed to login. Please check your credentials and try again.',
      );
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
      <Text style={styles.title}>Doctor Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor={"gray"}
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={"gray"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible} // Toggle secureTextEntry based on state
          style={[styles.input, {paddingRight: 40}]}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

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
    color:"gray"
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: -5,
    height: '100%',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default DoctorLoginScreen;
