import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DoctorNotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from Firestore
    const unsubscribe = firestore()
      .collection('Notifications')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const notificationsData = [];
        snapshot.forEach(doc => {
          notificationsData.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(notificationsData);
      });

    return () => unsubscribe();
  }, []);

  const handleVerifyAttachment = async (notificationId, doctorId) => {
    try {
      // Update notification and doctor's document in Firestore
      await firestore().collection('Notifications').doc(notificationId).update({
        verified: true,
      });

      await firestore().collection('Doctor').doc(doctorId).update({
        attachmentVerified: true,
      });

      Alert.alert('Attachment verified successfully!');
    } catch (err) {
      console.log('Error verifying attachment:', err);
      Alert.alert('Error verifying attachment. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Image source={{ uri: item.attachmentUrl }} style={styles.attachmentImage} />
      <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => handleVerifyAttachment(item.id, item.doctorId)}
        disabled={item.verified}>
        <Text style={styles.verifyButtonText}>
          {item.verified ? 'Verified' : 'Verify Attachment'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  notificationCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  attachmentImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: '#0D4744',
    padding: 10,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DoctorNotificationScreen;
