import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { RadioButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ProceedScreen = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [showFields, setShowFields] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [symptom, setSymptom] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [complications, setComplications] = useState('');

  const navigation = useNavigation();

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    if (value === 'forSomeoneElse') {
      setShowFields(true);
    } else {
      setShowFields(false);
    }
  };

  const handleProceed = () => {
    // Proceed to the Payment screen
    navigation.navigate('PaymentScreen');
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
      {showFields && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { borderColor: '#0D4744' }]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { borderColor: '#0D4744' }]}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={[styles.input, { borderColor: '#0D4744' }]}
            placeholder="Symptom"
            value={symptom}
            onChangeText={setSymptom}
          />
          <TextInput
            style={[styles.input, { borderColor: '#0D4744' }]}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            style={[styles.input, { borderColor: '#0D4744' }]}
            placeholder="Any Other Complications"
            value={complications}
            onChangeText={setComplications}
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
