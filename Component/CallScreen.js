import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';

export default function VoiceCallPage(props) {
    // const userID = '121212'; // Replace with dynamic user ID
    // const userName = 'user_12345'; // Replace with dynamic user name
    const callID = 'group123'; // Replace with dynamic call ID
    const userID= String(Math.floor(Math.random()*100000));

    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={361838410}
                appSign={"3cc9885240d99c7998a6c5188d38e562722f42061dc3e7acd95ec6b5084c27be"}
                userID={userID}
                userName={`user_${userID}`}
                callID={callID}
                config={{
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onCallEnd: (callID, reason, duration) => {
                        console.log(`Call ended. CallID: ${callID}, Reason: ${reason}, Duration: ${duration}`);
                    },
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
