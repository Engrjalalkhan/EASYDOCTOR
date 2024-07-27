// CallScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CallScreen = ({ route, navigation }) => {
  const { isCaller } = route.params; // Determine if the user is the caller or receiver
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const handleCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // Navigate back or perform any other action on end call
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isCaller ? 'Calling...' : 'Receiving Call...'}</Text>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={handleMute} style={styles.iconButton}>
          <Image
            source={isMuted ? require('../Src/images/munteon.png') : require('../Src/images/muteoff.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleVideo} style={styles.iconButton}>
          <Image
            source={isVideoOn ? require('../Src/images/turnone.png') : require('../Src/images/turnof.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>{isVideoOn ? 'Turn Off Video' : 'Turn On Video'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEndCall} style={styles.iconButton}>
          <Image
            source={require('../Src/images/consultation.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconImage: {
    width: 30,
    height: 30,
    borderRadius:20,
    resizeMode: 'contain',
  },
  iconText: {
    color: '#fff',
    marginTop: 5,
  },
});

export default CallScreen;
