import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignInWithMobileScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Check if the user is already authenticated
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                // User is authenticated, navigate to the splash screen
                navigation.navigate('Splash');
            }
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        try {
            await auth().signInWithEmailAndPassword(email, password);
            // User is signed in
            // Navigate to the splash screen
            navigation.navigate('Splash');
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

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={text => setEmail(text)}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <TouchableOpacity style={styles.showPasswordContainer} onPress={() => setShowPassword(!showPassword)}>
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

            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('Forgot')}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signInText}>Don't have an account?</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}>
                    <Text style={{ color: '#599CA5', fontSize: 18, marginTop: 20 }}>

                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default SignInWithMobileScreen;
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom:180
    },
    container1: {
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#0D4744',
        height: 450,
        width: '120%',
        marginBottom: 50,
        borderBottomEndRadius: 500,
        borderBottomStartRadius: 500,
        paddingTop:50
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
    signInText: {
        fontSize: 18,
        marginTop: 20,
    },
    forgotPassword: {
        paddingLeft: "50%"
    },
    forgotPasswordText: {
        color: '#599CA5',
        fontSize: 16,
        textAlign: 'center',
    },
});
