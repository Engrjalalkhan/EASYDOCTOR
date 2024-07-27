import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { RadioButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const ProceedScreen = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showForMeFields, setShowForMeFields] = useState(false);
  const [showForSomeoneElseFields, setShowForSomeoneElseFields] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptom, setSymptom] = useState('');
  const [complications, setComplications] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldsValid, setFieldsValid] = useState(true);
  const [patientname, setPatientName] = useState('');
  const [patientage, setPatientage] = useState('');
  const [patientgender, setPatientgender] = useState('');
  const [patientsymptom, setPatientsymptom] = useState('');
  const [patientcomplications, setPatientcomplications] = useState('');

  const navigation = useNavigation();

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setShowForMeFields(value === 'forMe');
    setShowForSomeoneElseFields(value === 'forSomeoneElse');
  };

  const handleProceed = async () => {
    let bookingData = {};

    if (selectedOption === 'forMe') {
      if (validateFieldsForMe()) {
        // Fetch the patientId from the Patients collection based on the phone number
        const patientId = await getPatientIdByPhone(phone);
        if (patientId) {
          bookingData = {
            type: 'forMe',
            patient: {
              name: name,
              age: age,
              gender: gender,
              symptom: symptom,
              complications: complications,
              patientId: patientId,
              phone: phone,
            }
          };
        } else {
          Alert.alert('Patient not found', 'No patient found with the given phone number.');
          return;
        }
      }
    } else if (selectedOption === 'forSomeoneElse') {
      if (validateFieldsForSomeoneElse()) {
        // Fetch the patientId from the Patients collection based on the phone number
        const patientId = await getPatientIdByPhone(phone);
        if (patientId) {
          bookingData = {
            type: 'forSomeoneElse',
            patient: {
              name: patientname,
              age: patientage,
              gender: patientgender,
              symptom: patientsymptom,
              complications: patientcomplications,
              patientId: patientId,
              phone: phone,
            }
          };
        } else {
          Alert.alert('Patient not found', 'No patient found with the given phone number.');
          return;
        }
      }
    }

    if (Object.keys(bookingData).length > 0) {
      checkAndUpdateBooking(bookingData);
    }
  };

  const checkAndUpdateBooking = async (bookingData) => {
    try {
      const bookingId = await getRandomBookingId();
      if (bookingId) {
        updateBooking(bookingId, bookingData);
      } else {
        console.log('No bookings found.');
      }
    } catch (error) {
      console.error('Error checking and updating booking: ', error);
    }
  };

  const getRandomBookingId = async () => {
    try {
      const snapshot = await firestore().collection('Bookings').get();
      const bookingIds = snapshot.docs.map(doc => doc.id);
      const randomIndex = Math.floor(Math.random() * bookingIds.length);
      return bookingIds[randomIndex];
    } catch (error) {
      throw error;
    }
  };

  const getPatientIdByPhone = async (phone) => {
    try {
      const snapshot = await firestore().collection('Patients')
        .where('phone', '==', phone)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        return snapshot.docs[0].id;
      } else {
        console.log('No patient found with the given phone number.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching patientId: ', error);
      return null;
    }
  };

  const updateBooking = async (bookingId, bookingData) => {
    try {
      await firestore()
        .collection('Bookings')
        .doc(bookingId)
        .update(bookingData);
      console.log('Booking updated successfully!');
      navigation.navigate('PaymentScreen');
    } catch (error) {
      console.error('Error updating booking: ', error);
    }
  };

  const validateFieldsForMe = () => {
    if (!name || !age || !gender || !symptom || !complications || !phone) {
      setFieldsValid(false);
      return false;
    }
    setFieldsValid(true);
    return true;
  };

  const validateFieldsForSomeoneElse = () => {
    if (!patientname || !patientage || !patientgender || !patientsymptom || !patientcomplications || !phone) {
      setFieldsValid(false);
      return false;
    }
    setFieldsValid(true);
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: '#0D4744' }]}>Select One Option to Proceed !</Text>
      <View style={styles.radioGroup}>
        <RadioButton.Item
          label="For Me"
          value="forMe"
          status={selectedOption === 'forMe' ? 'checked' : 'unchecked'}
          onPress={() => handleOptionChange('forMe')}
          color="#0D4744"
        />
        <RadioButton.Item
          label="For Someone Else"
          value="forSomeoneElse"
          status={selectedOption === 'forSomeoneElse' ? 'checked' : 'unchecked'}
          onPress={() => handleOptionChange('forSomeoneElse')}
          color="#0D4744"
        />
      </View>
      {showForMeFields && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Your Age"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Your Gender"
            value={gender}
            onChangeText={setGender}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Your Symptom"
            value={symptom}
            onChangeText={setSymptom}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Your Complication"
            value={complications}
            onChangeText={setComplications}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Account Holder Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType='numeric'
          />
        </View>
      )}
      {showForSomeoneElseFields && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Patient's Name"
            value={patientname}
            onChangeText={setPatientName}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Patient's Age"
            value={patientage}
            onChangeText={setPatientage}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Patient's Gender"
            value={patientgender}
            onChangeText={setPatientgender}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Patient's Symptom"
            value={patientsymptom}
            onChangeText={setPatientsymptom}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Patient's Complication"
            value={patientcomplications}
            onChangeText={setPatientcomplications}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: fieldsValid ? '#0D4744' : 'red' },
            ]}
            placeholder="Account Holder Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType='numeric'
          />
        </View>
      )}
      <Button
        mode="contained"
        onPress={handleProceed}
        disabled={!selectedOption}
        style={[styles.button, { backgroundColor: '#0D4744' }]}
      >
        Proceed
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    width: '80%',
  },
});

export default ProceedScreen;
