import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [paymentOption, setPaymentOption] = useState('cash');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
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
      if (paymentOption === 'online') {
        // Check if the notification for this doctor is verified
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
  
      // Book the appointment
      console.log(`Appointment booked with doctor ${doctorId}`);
  
      // Add the appointment to the 'Appointments' collection
      const appointmentData = {
        doctorId: doctorId,
        patientId: '', // replace with actual patient ID
        appointmentDate: 'June 15, 2024', // example appointment date
        appointmentTime: '10:00 AM', // example appointment time
      };
      await firestore().collection('Appointments').add(appointmentData);
  
      // Show success message with a tick mark image
      Alert.alert(
        'Appointment Booked',
        'Your appointment has been successfully booked!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to the patient home screen
              navigation.navigate('Book');
            },
          },
        ],
        { cancelable: false }
      );
  
    } catch (error) {
      console.error('Error booking appointment:', error);
      
    }
  };
  
  

  const renderItem = ({ item }) => (
    


    <View>
      <TouchableOpacity style={styles.card} onPress={() => setSelectedDoctorId(item.id)}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
        </View>
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <Text style={styles.experience}>
            Experience: {item.experience} year
          </Text>
          <Text style={styles.experience}>Location: {item.clinicAddress}</Text>
          <Text style={styles.experience}>Rasst: {item.rasst}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.appointment}>Appointment Date: June 15, 2024 </Text>
      <Text style={styles.appointment}>Appointment 10:00 AM</Text>
      <View style={styles.paymentOptions}>
        <Text style={styles.paymentLabel}>Payment Options:</Text>
        <View style={styles.radioButton}>
        <RadioButton
            value="cash"
            status={paymentOption === 'cash' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentOption('cash')}
            color="#0D4744" // Change color to #0D4744
          />
            <Text>Cash on Arrival</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="online"
              status={paymentOption === 'online' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentOption('online')}
              color="#0D4744"
            />
            <Text>Online Payment</Text>
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
  
    return (
      <View style={styles.container}>
        <FlatList
          data={doctors}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
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
      paddingTop:20
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    doctorDetails: {
      flex: 1,
      marginLeft: 20,
    },
    doctorName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    specialty: {
      fontSize: 16,
      fontStyle: 'italic',
    },
    experience: {
      fontSize: 14,
      marginTop: 5,
    },
    appointment: {
      fontSize: 14,
      marginTop: 5,
      fontWeight: 'bold',
      alignSelf: 'center'
    },
    paymentOptions: {
      marginTop: 10,
    },
    paymentLabel: {
      fontWeight: 'bold',
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    addAttachmentButton: {
      backgroundColor: '#0D4744',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    addAttachmentText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    verificationMessage: {
      color: 'green',
      fontWeight: 'bold',
      marginTop: 10,
      textAlign: 'center',
    },
    bookAppointmentButton: {
      backgroundColor: '#0D4744',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    bookAppointmentText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
  export default PaymentScreen;
  