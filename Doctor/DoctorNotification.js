import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DoctorNotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleDelete = async (notificationId) => {
    try {
      await firestore().collection('Notifications').doc(notificationId).delete();
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
      Alert.alert('Deleted', 'Notification removed successfully');
    } catch (err) {
      console.log('Error deleting notification:', err);
      Alert.alert('Error deleting notification. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Image
          source={require('../Src/images/red.png')} // Replace with your delete icon image
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
      <Image source={{ uri: item.attachmentUrl }} style={styles.attachmentImage} />
      <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            setSelectedImage(item.attachmentUrl);
            setModalVisible(true);
          }}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => handleVerifyAttachment(item.id, item.doctorId)}
          disabled={item.verified}
        >
          <Text style={styles.verifyButtonText}>
            {item.verified ? 'Verified' : 'Verify'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      {/* Modal for viewing image */}
      {selectedImage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    position: 'relative',
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
    marginTop: 10,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#0D4744',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 5,
  },
  deleteIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  modalImage: {
    width: '100%',
    height: 400,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DoctorNotificationScreen;
