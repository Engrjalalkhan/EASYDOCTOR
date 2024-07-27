import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Alert, Platform, ActionSheetIOS } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';

// Import the images for the send, delete, and attachment buttons
import sendIcon from '../Src/images/send.png'; // Replace with your image path
import deleteIcon from '../Src/images/delete.png'; // Replace with your image path
import attachmentIcon from '../Src/images/attachment.png'; // Replace with your image path

const ReceiverChatScreen = ({ route, navigation }) => {
  const { doctorId } = route.params; // Assuming you pass the doctorId through route params
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(doctorId) // Use doctorId to target the specific chat
      .collection('messages') // Use a subcollection for messages
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messages);
      });

    return () => unsubscribe();
  }, [doctorId]);

  const sendMessage = async () => {
    if (message.length > 0 || attachment) {
      await firestore().collection('chats')
        .doc(doctorId) // Target the specific chat
        .collection('messages') // Use a subcollection for messages
        .add({
          text: message,
          attachment: attachment,
          createdAt: firestore.FieldValue.serverTimestamp(),
          user: 'Receiver'
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
      const docRef = firestore().collection('chats')
        .doc(doctorId) // Target the specific chat
        .collection('messages') // Use a subcollection for messages
        .doc(id);

      if (option === 'deleteForEveryone') {
        batch.update(docRef, { deletedForEveryone: true, text: '🚫 Message deleted', attachment: null });
      } else if (option === 'deleteForMe') {
        batch.update(docRef, { deletedBy: firestore.FieldValue.arrayUnion('Receiver') });
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
    if (item.deletedBy && item.deletedBy.includes('Receiver') && item.user === 'Receiver') {
      return null; // Skip rendering if deleted by the current user
    }

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        style={[
          item.user === 'Receiver' ? styles.receiverMessage : styles.senderMessage,
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
        <TouchableOpacity onPress={showDeleteOptions} style={styles.headerRight}>
          <Image source={deleteIcon} style={styles.deleteIcon} />
        </TouchableOpacity>
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
              <Text style={styles.modalTitle}>Delete Messages?</Text>
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
    padding: 10,
    marginRight: 5,
  },
  attachmentIcon: {
    width: 30,
    height: 30,
    borderRadius: 3
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center'
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5
  },
  input: {
    flex: 1,
    padding: 5,
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
    marginLeft: 10
  },
  sendIcon: {
    width: 30,
    height: 30,
  },
  receiverMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 10
  },
  senderMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    color: '#fff'
  },
  selectedMessage: {
    backgroundColor: '#c0c0c0',
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalButton: {
    padding: 10,
    width: '100%',
    alignItems: 'center'
  },
  modalButtonText: {
    fontSize: 16
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  }
});

export default ReceiverChatScreen;
