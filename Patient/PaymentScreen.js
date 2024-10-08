import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [paymentOption, setPaymentOption] = useState('cash');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Doctor')
      .onSnapshot(snapshot => {
        const doctorsData = [];
        snapshot.forEach(doc => {
          doctorsData.push({ id: doc.id, ...doc.data() });
        });
        setDoctors(doctorsData);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = firestore().collection('Bookings');
        const snapshot = await bookingsRef.get();
        const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings: ', error);
      }
    };

    fetchBookings();
  }, []);

  const handleAddAttachment = async (doctorId) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (!res || !res[0].uri) {
        throw new Error("No file selected or invalid file.");
      }

      const uploadUri = res[0].uri;
      const fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(fileName);
      await storageRef.putFile(uploadUri);
      const downloadURL = await storageRef.getDownloadURL();

      await firestore().collection('Doctor').doc(doctorId).update({
        attachment: downloadURL,
        attachmentVerified: false,
      });

      await firestore().collection('Notifications').add({
        doctorId: doctorId,
        attachmentUrl: downloadURL,
        verified: false,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      sendNotificationToDoctor(doctorId, downloadURL);
      setSelectedDoctorId(doctorId);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the document picker');
      } else {
        console.log('Error while picking file:', err);
      }
    }
  };

  const sendNotificationToDoctor = (doctorId, downloadURL) => {
    console.log(`Notification sent to doctor ${doctorId} with attachment ${downloadURL}`);
  };

  useEffect(() => {
    if (selectedDoctorId) {
      const unsubscribe = firestore()
        .collection('Doctor')
        .doc(selectedDoctorId)
        .onSnapshot(doc => {
          const data = doc.data();
          if (data.attachmentVerified) {
            setVerificationMessage('Attachment verified');
          }
        });

      return () => unsubscribe();
    }
  }, [selectedDoctorId]);

  const handleBookAppointment = async (doctorId) => {
    try {
      let paymentStatus = paymentOption === 'cash' ? 'unpaid' : 'paid';

      if (paymentOption === 'online') {
        const notificationRef = firestore().collection('Notifications').where('doctorId', '==', doctorId).where('verified', '==', true);
        const notificationSnapshot = await notificationRef.get();

        if (notificationSnapshot.empty) {
          Alert.alert(
            'Unverified Attachment',
            'Please wait for the doctor to verify the attachment before booking an appointment.',
          );
          return;
        }
      }

      // Fetch booking document IDs
      const bookingRef = firestore().collection('Bookings');
      const snapshot = await bookingRef.get();
      const bookingIds = snapshot.docs.map(doc => doc.id);

      if (bookingIds.length === 0) {
        Alert.alert('No Bookings', 'There are no bookings available to update.');
        return;
      }

      // Select a random booking ID
      const randomIndex = Math.floor(Math.random() * bookingIds.length);
      const randomBookingId = bookingIds[randomIndex];

      const appointmentData = {
        doctorId: doctorId,
        paymentStatus: paymentStatus,
      };

      // Update the random booking document
      const bookingDocRef = bookingRef.doc(randomBookingId);
      await bookingDocRef.set(appointmentData, { merge: true });

      // Update local state
      const updatedBookings = bookings.map(booking => {
        if (booking.id === randomBookingId) {
          return { ...booking, ...appointmentData };
        }
        return booking;
      });
      setBookings(updatedBookings);

      // Show modal with image
      setModalImage(require('../Src/images/tik.png')); // Replace with your image path
      setModalVisible(true);

    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const renderItem = ({ item }) => {
    const doctorBookings = bookings.filter(booking => booking.doctorId === item.id);

    return (
      <View>
        <TouchableOpacity style={styles.card} onPress={() => setSelectedDoctorId(item.id)}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
            <Text style={styles.experience}>Experience: {item.experience} years</Text>
            <Text style={styles.experience}>Location: {item.clinicAddress}</Text>
            <Text style={{color:'black',fontWeight:'bold'}}>Doctor Fee: {item.price}</Text>
            <Text style={styles.experience}>Rasst: {item.rasst}</Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={doctorBookings}
          renderItem={({ item }) => (
            <View style={styles.bookingContainer}>
              <Text style={styles.booking}>Booking Date: {item.date}</Text>
              <Text style={styles.booking}>Booking Evening Time: {item.eveningSlot}</Text>
              <Text style={styles.booking}>Booking Morning Time: {item.morningSlot}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.paymentOptions}>
          <Text style={styles.paymentLabel}>Payment Options:</Text>
          <View style={styles.radioButton}>
            <RadioButton
              value="cash"
              status={paymentOption === 'cash' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentOption('cash')}
              color="#0D4744"
            />
            <Text style={{color:'gray'}}>Cash on Arrival</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="online"
              status={paymentOption === 'online' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentOption('online')}
              color="#0D4744"
            />
            <Text style={{color:"gray"}}>Online Payment</Text>
          </View>
        </View>
        {paymentOption === 'online' && (
          <View>
            <TouchableOpacity
              style={styles.addAttachmentButton}
              onPress={() => handleAddAttachment(item.id)}>
              <Text style={styles.addAttachmentText}>Add Attachment</Text>
            </TouchableOpacity>
            {verificationMessage !== '' && (
              <Text style={styles.verificationMessage}>{verificationMessage}</Text>
            )}
          </View>
        )}
        <TouchableOpacity
          style={styles.bookAppointmentButton}
          onPress={() => handleBookAppointment(item.id)}>
          <Text style={styles.bookAppointmentText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.navigate('Book'); // Replace with your actual route name
  };

  return (
    <View style={styles.container}>
      {selectedDoctorId ? (
        <FlatList
          data={doctors.filter(doc => doc.id === selectedDoctorId)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}

      {/* Modal for Image */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={modalImage} style={styles.modalImage} />
            <Pressable
              style={styles.closeButton}
              onPress={handleModalClose}>
              <Text style={styles.closeButtonText}>BOOKING SUCCESSFUL</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 340,
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  doctorDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D4744',
  },
  specialty: {
    fontSize: 16,
    color: '#555',
  },
  experience: {
    fontSize: 14,
    color: '#888',
  },
  paymentOptions: {
    marginTop: 10,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addAttachmentButton: {
    backgroundColor: '#0D4744',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addAttachmentText: {
    color: '#fff',
    fontSize: 16,
  },
  verificationMessage: {
    color: '#0D4744',
    marginTop: 10,
  },
  bookAppointmentButton: {
    backgroundColor: '#0D4744',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookAppointmentText: {
    color: '#fff',
    fontSize: 16,
  },
  bookingContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  booking: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    height:300,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius:50,
    resizeMode: 'contain',
    marginTop:70
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight:'bold'
  },
});

export default PaymentScreen;
