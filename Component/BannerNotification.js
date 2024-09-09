import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Sound from 'react-native-sound';

// Initialize sound
const beepSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the beep sound', error);
  }
});

const BannerNotification = ({ title, description, onClick, onDismiss, isSender }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (!isSender) {
      // Play beep sound when banner appears
      beepSound.play();

      // Slide down the banner when it appears
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // Automatically hide the banner after 5 seconds
      const timer = setTimeout(() => {
        dismissBanner();
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [slideAnim, isSender]);

  const dismissBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 500,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onDismiss && onDismiss();
    });
  };

  if (isSender) {
    return null; // Do not render the banner for the sender
  }

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}
    >
      <TouchableOpacity style={styles.bannerContent} onPress={onClick}>
        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerDescription}>{description}</Text>
        </View>
        <TouchableOpacity onPress={dismissBanner} style={styles.dismissButton}>
          <Text style={styles.dismissButtonText}>✖</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ffedcc',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15, // Updated border radius
    shadowColor: '#000', // Added shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bannerContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bannerDescription: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  dismissButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  dismissButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

export default BannerNotification;
