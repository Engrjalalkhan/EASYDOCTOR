import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, RTCView } from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';

const CallScreen = ({ route, navigation }) => {
  const { userType, doctorId, patientId } = route.params; // Pass userType (doctor/patient) and IDs through route params
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callerId, setCallerId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const pc = useRef(null);

  useEffect(() => {
    const init = async () => {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);

      pc.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendToServer('candidate', event.candidate);
        }
      };

      pc.current.onaddstream = (event) => {
        setRemoteStream(event.stream);
      };

      pc.current.addStream(stream);
    };

    init();

    const callDoc = firestore().collection('calls').doc(userType === 'doctor' ? doctorId : patientId);

    const unsubscribe = callDoc.onSnapshot((doc) => {
      const data = doc.data();
      if (data) {
        switch (data.type) {
          case 'offer':
            if (userType === 'doctor') {
              setIsReceivingCall(true);
              setCallerId(data.from);
            }
            break;
          case 'answer':
            pc.current.setRemoteDescription(new RTCSessionDescription(data.payload));
            break;
          case 'candidate':
            pc.current.addIceCandidate(new RTCIceCandidate(data.payload));
            break;
          case 'reject':
            setIsCalling(false);
            Alert.alert('Call Rejected');
            break;
          case 'end':
            endCall();
            break;
          default:
            break;
        }
      }
    });

    return () => {
      pc.current && pc.current.close();
      unsubscribe();
    };
  }, []);

  const sendToServer = (type, payload) => {
    const callDoc = firestore().collection('calls').doc(userType === 'doctor' ? doctorId : patientId);
    callDoc.set({ type, from: userType === 'doctor' ? doctorId : patientId, payload }, { merge: true });
  };

  const startCall = async () => {
    setIsCalling(true);
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(new RTCSessionDescription(offer));
    sendToServer('offer', offer);
  };

  const acceptCall = async () => {
    setIsReceivingCall(false);
    const callDoc = firestore().collection('calls').doc(doctorId);
    const callData = (await callDoc.get()).data();
    await pc.current.setRemoteDescription(new RTCSessionDescription(callData.payload));
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(new RTCSessionDescription(answer));
    sendToServer('answer', answer);
  };

  const rejectCall = () => {
    setIsReceivingCall(false);
    sendToServer('reject', {});
  };

  const toggleMute = () => {
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsCameraOn(!isCameraOn);
  };

  const toggleSpeaker = () => {
    // Note: This is a simple toggle for demonstration purposes.
    // You may need to use a native module for actual speaker toggling.
    setIsSpeakerOn(!isSpeakerOn);
  };

  const endCall = () => {
    setIsCalling(false);
    pc.current && pc.current.close();
    setLocalStream(null);
    setRemoteStream(null);
    sendToServer('end', {});
  };

  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
      )}
      {!isCalling && !isReceivingCall && (
        <TouchableOpacity onPress={startCall} style={styles.callButton}>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      )}
      {isReceivingCall && (
        <View style={styles.callActions}>
          <Text style={styles.callText}>Incoming Call...</Text>
          <TouchableOpacity onPress={acceptCall} style={styles.acceptButton}>
            <Text style={styles.callButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={rejectCall} style={styles.rejectButton}>
            <Text style={styles.callButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {isCalling && (
        <View style={styles.callControls}>
          <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
            <Image source={isMuted ? require('../Src/images/munteon.png') : require('../Src/images/muteoff.png')} style={styles.controlImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCamera} style={styles.controlButton}>
            <Image source={isCameraOn ? require('../Src/images/turnone.png') : require('../Src/images/turnof.png')} style={styles.controlImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSpeaker} style={styles.controlButton}>
            <Image source={isSpeakerOn ? require('../Src/images/unmute.png') : require('../Src/images/mute.png')} style={styles.controlImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={styles.controlButton}>
            <Image source={require('../Src/images/consultation.png')} style={styles.controlImage} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  localVideo: {
    width: 150,
    height: 200,
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  callButton: {
    backgroundColor: '#0D4744',
    padding: 20,
    borderRadius: 10,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 100,
  },
  callText: {
    color: '#fff',
    fontSize: 18,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 10,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  controlButton: {
    padding: 10,
  },
  controlImage: {
    width: 50,
    height: 50,
  },
});

export default CallScreen;
