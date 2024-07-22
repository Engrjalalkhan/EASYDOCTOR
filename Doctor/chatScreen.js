import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Import the image for the send button
import sendIcon from '../Src/images/send.png'; // Replace with your image path

const SenderChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

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
    if (message.length > 0) {
      await firestore().collection('chats').add({
        text: message,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: 'Sender'
      });
      setMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.user === 'Sender' ? styles.senderMessage : styles.receiverMessage}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image source={sendIcon} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20
  },
  sendButton: {
    padding: 10,
  },
  sendIcon: {
    width: 50,
    height: 40,
    borderRadius:7
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 20,
    marginVertical: 5,
    padding: 10
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 20,
    marginVertical: 5,
    padding: 10
  }
});

export default SenderChatScreen;
