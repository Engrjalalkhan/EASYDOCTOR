import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import IncomingCallNotification from './IncomingCallNotification'; // Import the notification component

export default function VoiceCallPage(props) {
    const [showNotification, setShowNotification] = useState(false);

    const callID = 'group123'; // Replace with dynamic call ID
    const userID = String(Math.floor(Math.random() * 100000));

    // Handler for when an incoming call is detected
    const handleIncomingCall = () => {
        setShowNotification(true);
    };

    // Handler for answering the call
    const handleAnswer = () => {
        setShowNotification(false);
        // Implement logic to join the call
    };

    // Handler for rejecting the call
    const handleReject = () => {
        setShowNotification(false);
        // Implement logic to reject the call
    };

    return (
        <View style={styles.container}>
            {showNotification && (
                <IncomingCallNotification
                    onAnswer={handleAnswer}
                    onReject={handleReject}
                />
            )}
            <ZegoUIKitPrebuiltCall
                appID={1707879943}
                appSign={"0ff6f967a32834d22c4ec294ba0e33083f2cf1b0ba06589930926b5b90f622bf"}
                userID={userID}
                userName={`user_${userID}`}
                callID={callID}
                config={{
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onCallEnd: (callID, reason, duration) => {
                        props.navigation.goBack();
                    },
                    onIncomingCall: handleIncomingCall, // Update this line based on your SDK documentation
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
});
