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

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messages);
      });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.length > 0 || attachment) {
      await firestore().collection('chats').add({
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
      const docRef = firestore().collection('chats').doc(id);
      if (option === 'deleteForEveryone') {
        batch.update(docRef, { deletedForEveryone: true });
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
    if (item.deletedBy && item.deletedBy.includes('Sender') && item.user === 'Sender') {
      return null;
    }

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        style={[
          item.user === 'Sender' ? styles.senderMessage : styles.receiverMessage,
          selectedMessages.includes(item.id) && styles.selectedMessage
        ]}
      >
        <Text>{item.deletedForEveryone ? '🚫 You deleted this message' : item.text}</Text>
        {item.attachment && (
          <TouchableOpacity onPress={() => openImageViewer(item.attachment.path)}>
            <Image source={{ uri: item.attachment.path }} style={styles.messageImage} />
          </TouchableOpacity>
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
        <TouchableOpacity onPress={selectAttachment} style={styles.attachmentButton}>
          <Image source={attachmentIcon} style={styles.attachmentIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          multiline
        />
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
              <Text style={styles.modalTitle}>Delete Messages</Text>
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
    flexDirection: 'row',
    padding: 10,
  },
  attachmentButton: {
    padding: 10,
    marginRight: 5,
  },
  attachmentIcon: {
    width: 24,
    height: 24,
  },
  deleteIcon: {
    width: 24,
    height: 24
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    maxHeight: 100,
    backgroundColor: '#F0F0F0',
    color: '#000'
  },
  sendButton: {
    padding: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 20,
    marginVertical: 5,
    padding: 10,
    maxWidth: '70%',
    marginHorizontal: 7
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 20,
    marginVertical: 5,
    padding: 10,
    maxWidth: '70%',
    marginHorizontal: 7
  },
  selectedMessage: {
    backgroundColor: '#e0e0e0',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center'
  },
  modalButtonText: {
    fontSize: 16,
    color: '#0D4744'
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10
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

export default SenderChatScreen;
