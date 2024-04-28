import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import Calendar from '../Doctor/Calendar';

const MyCalendarScreen = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [morningEnabled, setMorningEnabled] = useState(false);
  const [eveningEnabled, setEveningEnabled] = useState(false);
  const [allEnabled, setAllEnabled] = useState(false);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [slots, setSlots] = useState('');
  const [minutes, setMinutes] = useState('');
  const [hours, setHours] = useState('');

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const toggleMorning = () => {
    setMorningEnabled(!morningEnabled);
  };
  const toggleEvening = () => {
    setEveningEnabled(!eveningEnabled);
  };
  const toggleAll = () => {
    setAllEnabled(!allEnabled);
  };
  const handleSave = () => {
    console.log("Saved !!")
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.calendarButton} onPress={toggleCalendar}>
        <Text style={styles.iconText}>Calendar</Text>
        <Image
          source={require('../Src/images/description.png')}
          style={{width: 24, height: 24, justifyContent: 'flex-end'}}
        />
      </TouchableOpacity>
      <Modal visible={showCalendar} transparent={true}>
        <View style={styles.modalContainer}>
          <Calendar />

          <TouchableOpacity style={styles.closeButton} onPress={toggleCalendar}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.morningToggle}>
        <Text style={{fontSize: 24, color: '#136b66', fontWeight: 'bold'}}>
          Morning
        </Text>
        <Switch
          value={morningEnabled}
          onValueChange={toggleMorning}
          style={{paddingStart: 20, marginTop: 10}}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View>
          <Text style={styles.label}>FROM</Text>
          <TextInput
            style={styles.input}
            value={fromTime}
            onChangeText={setFromTime}
            placeholder="Eg: 8 AM"
          />
        </View>
        <View style={{paddingRight:5}}>
          <Text style={styles.label}>TO</Text>

          <TextInput
            style={styles.input}
            value={toTime}
            onChangeText={setToTime}
            placeholder="Eg: 12 PM"
          />
        </View>
        <View>
          <Text style={styles.label}>SLOTS</Text>
          <TextInput
            style={styles.input}
            value={slots}
            onChangeText={setSlots}
            placeholder="Eg: 4"
          />
        </View>
      </View>

      <Text style={{marginTop: 20, fontSize: 16, fontWeight: 'bold'}}>
        DURATION PER SLOT
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View >
          <Text style={styles.label}>HOURS</Text>
          <TextInput
            style={styles.input}
            value={hours}
            onChangeText={setHours}
            placeholder="Eg: 1 "
          />
        </View>
        <View style={{justifyContent:"flex-start",paddingRight:120}}>
          <Text style={styles.label}>MINS</Text>
          <TextInput
            style={[styles.input, styles.toslot]}
            value={minutes}
            onChangeText={setMinutes}
            placeholder="Eg: 30"
          />
        </View>
      </View>
      <View style={styles.eveningToggle}>
        <Text style={{fontSize: 24, color: '#136b66', fontWeight: 'bold'}}>
          Evening
        </Text>
        <Switch
          value={eveningEnabled}
          onValueChange={toggleEvening}
          style={{paddingStart: 20, marginTop: 10}}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View>
          <Text style={styles.label}>FROM</Text>
          <TextInput
            style={styles.input}
            value={fromTime}
            onChangeText={setFromTime}
            placeholder="Eg: 8 AM"
          />
        </View>
        <View style={{paddingRight:5}}>
          <Text style={styles.label}>TO</Text>

          <TextInput
            style={styles.input}
            value={toTime}
            onChangeText={setToTime}
            placeholder="Eg: 12 PM"
          />
        </View>
        <View>
          <Text style={styles.label}>SLOTS</Text>
          <TextInput
            style={styles.input}
            value={slots}
            onChangeText={setSlots}
            placeholder="Eg: 4"
          />
        </View>
      </View>

      <Text style={{marginTop: 20, fontSize: 16, fontWeight: 'bold'}}>
        DURATION PER SLOT
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View >
          <Text style={styles.label}>HOURS</Text>
          <TextInput
            style={styles.input}
            value={hours}
            onChangeText={setHours}
            placeholder="Eg: 1 "
          />
        </View>
        <View style={{justifyContent:"flex-start",paddingRight:120}}>
          <Text style={styles.label}>MINS</Text>
          <TextInput
            style={[styles.input, styles.toslot]}
            value={minutes}
            onChangeText={setMinutes}
            placeholder="Eg: 30"
          />
        </View>
      </View>
      <Text style={{marginTop: 20, fontSize: 16, fontWeight: 'bold'}}>
        RECURRING ON
      </Text>
      <View style={styles.allToggle}>
        <Text style={{fontSize: 24, color: '#136b66', fontWeight: 'bold'}}>
          All days
        </Text>
        <Switch
          value={allEnabled}
          onValueChange={toggleAll}
          style={{paddingStart: 20, marginTop: 10}}
        />
      </View>
      <TouchableOpacity
            style={{
              backgroundColor: '#0D4744',
              width: '60%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25,
              marginTop: 50,
              alignSelf:"center"
            }}
            onPress={handleSave}>
            <Text style={{color: 'white', fontSize: 18}}>Save</Text>
          </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  calendarButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#136b66',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '40%',
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#0D4744',
  },
  morningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  eveningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  allToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    paddingRight: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    height: 35,
  },
});

export default MyCalendarScreen;
