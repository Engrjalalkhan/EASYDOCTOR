import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card, Button, ActivityIndicator } from 'react-native-paper';

const PaymentScreen = ({ route }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsList = [];
      const snapshot = await firestore().collection('Doctors').get();
      snapshot.forEach(doc => {
        doctorsList.push({ id: doc.id, ...doc.data() });
      });
      setDoctors(doctorsList);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <ActivityIndicator animating={true} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Doctor for Payment</Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.specialty} />
            <Card.Content>
              <Text>Experience: {item.experience} years</Text>
              <Text>Contact: {item.contact}</Text>
            </Card.Content>
            <Card.Cover source={{ uri: item.profileImage }} />
            <Card.Actions>
              <Button mode="contained" onPress={() => console.log('Paying for', item.name)}>
                Pay
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 10,
  },
});

export default PaymentScreen;
