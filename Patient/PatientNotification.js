import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Image, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PatientNotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await firestore().collection('Notifications').orderBy('createdAt', 'desc').get();
        const notificationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (notificationId) => {
    try {
      await firestore().collection('Notifications').doc(notificationId).delete();
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
      Alert.alert('Deleted', 'Notification removed successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const renderNotificationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          {selectedNotification && (
            <>
              <Text style={styles.modalTitle}>Notification Details</Text>
              <Text style={styles.modalDetail}>Name: {selectedNotification.name}</Text>
              <Text style={styles.modalDetail}>Age: {selectedNotification.age}</Text>
              <Text style={styles.modalDetail}>Gender: {selectedNotification.gender}</Text>
              <Text style={styles.modalDetail}>Symptom: {selectedNotification.symptom}</Text>
              <Text style={styles.modalDetail}>Date: {selectedNotification.date}</Text>
              <Text style={styles.modalDetail}>Time: {selectedNotification.time}</Text>
            </>
          )}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  

  return (
    <ScrollView style={styles.container}>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.notificationCard}>
          <TouchableOpacity onPress={() => { setSelectedNotification(notification); setModalVisible(true); }}>
            <Text style={styles.notificationDetail}>Name: {notification.name}</Text>
            <Text style={styles.notificationDetail}>Date: {notification.date}</Text>
            <Text style={styles.notificationDetail}>Time: {notification.time}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(notification.id)}
          >
            <Image
              source={require('../Src/images/red.png')} // Replace with the path to your delete icon image
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      ))}
      {renderNotificationModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationCard: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    position: 'relative', // Required for positioning the delete button
  },
  notificationDetail: {
    fontSize: 16,
    marginBottom: 5,
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
    borderRadius: 15
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
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0D4744',
    borderRadius: 10,
    padding: 10,
  },
  closeButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PatientNotificationScreen;
