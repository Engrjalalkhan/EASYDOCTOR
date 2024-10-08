import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons

const SignInWithMobileScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const lastLogin = await AsyncStorage.getItem('lastLogin');
            const currentTime = new Date().getTime();

            if (lastLogin && (currentTime - parseInt(lastLogin) <= 3600000)) {
                navigation.navigate('Splash');
            } else {
                await auth().signOut();
            }

            const unsubscribe = auth().onAuthStateChanged(user => {
                if (user) {
                    navigation.navigate('Splash');
                }
            });

            return () => unsubscribe();
        };

        checkAuth();
    }, []);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        try {
            await auth().signInWithEmailAndPassword(email, password);
            const currentTime = new Date().getTime();
            await AsyncStorage.setItem('lastLogin', currentTime.toString());
            navigation.navigate('Splash');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                <Text style={styles.title}>EASY + DOCTOR</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} >
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#888888"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />

                <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={{flex: 1,color:"gray"}}
                        placeholder="Enter your password"
                        placeholderTextColor="#888888"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('Forgot')}>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signInText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};
export default SignInWithMobileScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 180
    },
    container1: {
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#0D4744',
        height: 350,
        width: '120%',
        marginBottom: 50,
        borderBottomEndRadius: 500,
        borderBottomStartRadius: 500,
        paddingTop: 50
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20, // Padding at the bottom to ensure elements are not cut off
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        alignSelf: 'flex-start',
        paddingHorizontal: 30,
        color: "gray"
    },
    input: {
        height: 40,
        width: '85%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: "gray"
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '85%',
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
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    forgotPassword: {
        paddingLeft: "50%"
    },
    forgotPasswordText: {
        color: '#599CA5',
        fontSize: 16,
        textAlign: 'center',
    },
    signUpContainer: {
        flexDirection: 'row',
    },
    signInText: {
        fontSize: 18,
        marginTop: 20,
        color:"black"
    },
    signUpText: {
        color: '#599CA5',
        fontSize: 18,
        marginTop: 20,
    },
});
