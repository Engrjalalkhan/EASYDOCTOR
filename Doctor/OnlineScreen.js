import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const App = () => {
  const [onlineStatus, setOnlineStatus] = useState(false);

  const toggleOnlineStatus = () => {
    setOnlineStatus(previousStatus => !previousStatus);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enable Online Consultation</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.statusText}>Online Status: </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={onlineStatus ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleOnlineStatus}
          value={onlineStatus}
        />
        <Text style={[styles.statusText, onlineStatus && styles.onlineText]}>
          {onlineStatus ? 'Online' : 'Offline'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    marginRight: 10,
  },
  onlineText: {
    color: 'green',
  },
});

export default App;
