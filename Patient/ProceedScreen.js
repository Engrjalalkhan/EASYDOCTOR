import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
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
    <ScrollView style={styles.scrollContainer}>
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
              placeholderTextColor={"gray"}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Your Age"
              placeholderTextColor={"gray"}
              value={age}
              onChangeText={setAge}
            />
            <Text style={styles.label}>Your Gender</Text>
            <View style={styles.genderRadioGroup}>
              <RadioButton
                value="male"
                status={gender === 'male' ? 'checked' : 'unchecked'}
                onPress={() => setGender('male')}
                color="#0D4744"
              />
              <Text style={styles.genderText}>Male</Text>
              <RadioButton
                value="female"
                status={gender === 'female' ? 'checked' : 'unchecked'}
                onPress={() => setGender('female')}
                color="#0D4744"
              />
              <Text style={styles.genderText}>Female</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Your Symptom"
              placeholderTextColor={"gray"}
              value={symptom}
              onChangeText={setSymptom}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Your Complication"
              placeholderTextColor={"gray"}
              value={complications}
              onChangeText={setComplications}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Account Holder Number"
              placeholderTextColor={"gray"}
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
              placeholderTextColor={"gray"}
              value={patientname}
              onChangeText={setPatientName}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Patient's Age"
              placeholderTextColor={"gray"}
              value={patientage}
              onChangeText={setPatientage}
            />
            <Text style={styles.label}>Patient's Gender</Text>
            <View style={styles.genderRadioGroup}>
              <RadioButton
                value="male"
                status={patientgender === 'male' ? 'checked' : 'unchecked'}
                onPress={() => setPatientgender('male')}
                color="#0D4744"
              />
              <Text style={styles.genderText}>Male</Text>
              <RadioButton
                value="female"
                status={patientgender === 'female' ? 'checked' : 'unchecked'}
                onPress={() => setPatientgender('female')}
                color="#0D4744"
              />
              <Text style={styles.genderText}>Female</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Patient's Symptom"
              placeholderTextColor={"gray"}
              value={patientsymptom}
              onChangeText={setPatientsymptom}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Patient's Complication"
              placeholderTextColor={"gray"}
              value={patientcomplications}
              onChangeText={setPatientcomplications}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: fieldsValid ? '#0D4744' : 'red' },
              ]}
              placeholder="Account Holder Number"
              placeholderTextColor={"gray"}
              value={phone}
              onChangeText={setPhone}
              keyboardType='numeric'
            />
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleProceed}
          style={styles.proceedButton}
          labelStyle={styles.buttonLabel}
          
        >
          Proceed
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  genderRadioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-evenly',  // Distributes the items evenly
  },
  genderText: {
    marginHorizontal: 10, // Add horizontal space between the RadioButton and text
    fontSize: 16,
    color: 'gray',
  },

  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#0D4744',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:'gray'
  },
  proceedButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor:"#0D4744"
  },
  buttonLabel: {
    fontSize: 18,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: 'gray',
  }
});

export default ProceedScreen;
 