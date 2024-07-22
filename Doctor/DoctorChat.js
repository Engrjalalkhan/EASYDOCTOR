import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DoctorChatListScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingSnapshot = await firestore().collection('Bookings').get();
        const filteredBookings = bookingSnapshot.docs.map(doc => {
          const data = doc.data();
          // Extract only the required fields
          return {
            id: doc.id,
            name: data.name || 'N/A',
            age: data.age || 'N/A',
            gender: data.gender || 'N/A',
            paymentStatus: data.paymentStatus || 'N/A'
          };
        });

        setBookings(filteredBookings);
      } catch (error) {
        console.error('Error fetching bookings: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <Text style={{textAlign:'center', paddingTop: 5350}}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>Name: {item.name}</Text>
            <Text style={styles.text}>Age: {item.age}</Text>
            <Text style={styles.text}>Gender: {item.gender}</Text>
            <Text style={styles.text}>Payment Status: {item.paymentStatus}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default DoctorChatListScreen;
