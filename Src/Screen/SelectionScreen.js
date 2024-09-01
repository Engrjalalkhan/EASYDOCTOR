import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

const SelctionScreen = ({ navigation }) => {
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const user = auth().currentUser;
    if (user) {
      // User is authenticated, navigate to SplashScreen
      navigation.navigate('Splash');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Image source={require('../images/Logo.png')} style={styles.logo} />
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
      <Text style={{fontSize: 24, color: 'black', marginBottom: 30}}>
        Welcome Back !
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('SignIn')}>
          <Text style={{color: '#599CA5', fontSize: 18}}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
  signInText: {
    fontSize: 18,
    color:'black'
  },
});

export default SelctionScreen;
