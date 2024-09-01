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
                appID={1707879943}
                appSign={"0ff6f967a32834d22c4ec294ba0e33083f2cf1b0ba06589930926b5b90f622bf"}
                userID={userID}
                userName={`user_${userID}`}
                callID={callID}
                config={{
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onCallEnd: (callID, reason, duration) => {props.navigation.navigate('PatientVideo Consultation')},
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
