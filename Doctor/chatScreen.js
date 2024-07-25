import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Alert, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';

// Import the images for the send, delete, and attachment buttons
import sendIcon from '../Src/images/send.png'; // Replace with your image path
import deleteIcon from '../Src/images/delete.png'; // Replace with your image path
import attachmentIcon from '../Src/images/attachment.png'; // Replace with your image path

const SenderChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    // Fetch the bookings collection and set the doctorId
    const fetchDoctorId = async () => {
      const bookingsSnapshot = await firestore().collection('Bookings').get();
      if (!bookingsSnapshot.empty) {
        const bookingData = bookingsSnapshot.docs[0].data();
        setDoctorId(bookingData.doctorId);
      }
    };

    fetchDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId) {
      const unsubscribe = firestore()
        .collection('chats')
        .doc(doctorId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(messages);
        });

      return () => unsubscribe();
    }
  }, [doctorId]);

  const sendMessage = async () => {
    if (message.length > 0 || attachment) {
      await firestore().collection('chats').doc(doctorId).collection('messages').add({
        text: message,
        attachment: attachment,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: 'Sender'
      });
      setMessage('');
      setAttachment(null);
    }
  };

  const handleLongPress = (messageId) => {
    setSelectedMessages(prev =>
      prev.includes(messageId) ? prev.filter(id => id !== messageId) : [...prev, messageId]
    );
  };

  const handleDelete = async (option) => {
    if (selectedMessages.length === 0) {
      Alert.alert('No messages selected');
      return;
    }

    const batch = firestore().batch();
    selectedMessages.forEach(id => {
      const docRef = firestore().collection('chats').doc(doctorId).collection('messages').doc(id);
      if (option === 'deleteForEveryone') {
        batch.update(docRef, { deletedForEveryone: true, text: '🚫 Message deleted', attachment: null });
      } else if (option === 'deleteForMe') {
        batch.update(docRef, { deletedBy: firestore.FieldValue.arrayUnion('Sender') });
      }
    });
    await batch.commit();
    setSelectedMessages([]);
    setModalVisible(false);
  };

  const showDeleteOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete for Everyone', 'Delete for Me'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 1:
              handleDelete('deleteForEveryone');
              break;
            case 2:
              handleDelete('deleteForMe');
              break;
            default:
              break;
          }
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  const selectAttachment = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
      cropping: true
    }).then(image => {
      setAttachment(image);
    }).catch(error => {
      console.error(error);
    });
  };

  const openImageViewer = (uri) => {
    setSelectedImage(uri);
    setImageModalVisible(true);
  };

  const renderItem = ({ item }) => {
    // Check if the message should be displayed
    if (item.deletedBy && item.deletedBy.includes('Sender') && item.user === 'Sender') {
      return null; // Skip rendering if deleted by the current user
    }

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        style={[
          item.user === 'Sender' ? styles.receiverMessage : styles.senderMessage,
          selectedMessages.includes(item.id) && styles.selectedMessage
        ]}
      >
        {item.deletedForEveryone ? (
          <Text>🚫 Message deleted</Text>
        ) : (
          <>
            {item.text ? <Text>{item.text}</Text> : null}
            {item.attachment && (
              <TouchableOpacity onPress={() => openImageViewer(item.attachment.path)}>
                <Image source={{ uri: item.attachment.path }} style={styles.messageImage} />
              </TouchableOpacity>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chat',
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={showDeleteOptions} style={styles.headerRight}>
            <Image source={deleteIcon} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    });
  }, [navigation, selectedMessages]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputInnerContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            multiline
          />
          <TouchableOpacity onPress={selectAttachment} style={styles.attachmentButton}>
            <Image source={attachmentIcon} style={styles.attachmentIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image source={sendIcon} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
      {Platform.OS === 'android' && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Messages ?</Text>
              <TouchableOpacity onPress={() => handleDelete('deleteForEveryone')} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Delete for Everyone</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete('deleteForMe')} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Delete for Me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity style={styles.imageModalContainer} onPress={() => setImageModalVisible(false)}>
          <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerRight: {
    padding: 10,
  },
  deleteIcon: {
    width: 24,
    height: 24
  },
  attachmentButton: {
    padding: 5,
  },
  attachmentIcon: {
    width: 30,
    height: 30,
    borderRadius:3
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    padding: 10,
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingRight: 10,
  },
  sendButton: {
    padding: 10,
  },
  sendIcon: {
    width: 40,
    height: 40,
    borderRadius:10,
    width:50
  },
  senderMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 25,
    padding: 10,
    margin: 5,
    maxWidth: '80%',
  },
  receiverMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 25,
    padding: 10,
    margin: 5,
    maxWidth: '80%',
  },
  selectedMessage: {
    backgroundColor: '#D3D3D3'
  },
  messageImage: {
    width: 200,
    height: 250,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'flex-end',
  },
  modalButtonText: {
    color: '#0D4744',
    fontSize: 16,
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});

export default SenderChatScreen;
