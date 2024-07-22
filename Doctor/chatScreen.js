import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ route }) => {
  const { patientData } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!patientData?.id) {
      console.error('Invalid patient data');
      return;
    }

    const unsubscribe = firestore()
      .collection('Chats')
      .where('doctorId', '==', patientData.id)
      .orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
        const messagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });

    return () => unsubscribe();
  }, [patientData]);

  const handleSend = async () => {
    if (message.trim()) {
      try {
        await firestore().collection('Chats').add({
          doctorId: patientData.id,
          sender: 'doctor',
          message,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'doctor' ? styles.sentMessage : styles.receivedMessage
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#0D4744',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChatScreen;
