// IncomingCallNotification.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';

// Load sound file (ensure 'ringtone.mp3' is in your project's asset directory)
const ringingSound = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE);

export default function IncomingCallNotification({ onAnswer, onReject }) {
    useEffect(() => {
        // Play ringtone when component is mounted
        ringingSound.play((success) => {
            if (!success) {
                console.log('Sound did not play');
            }
        });

        // Stop ringtone when component unmounts
        return () => {
            ringingSound.stop();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Incoming Call...</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={onAnswer} style={styles.button}>
                    <Text style={styles.buttonText}>Answer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onReject} style={styles.button}>
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
    },
});
