import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon

const Home = ({route, navigation}) => {
  const {profileImage, userName} = route.params;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [onlineConsultation, setOnlineConsultation] = useState(false); // Define onlineConsultation state

  const handlePress = option => {
    // Handle navigation to the respective screens based on the selected option
    navigation.navigate(option);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleOnlineConsultation = () => {
    setOnlineConsultation(!onlineConsultation);
  };

  return (
    <View style={styles.container1}>
      {/* Content */}
      <View style={styles.content}>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            paddingBottom: -30,
          }}>
          EASY + DOCTOR
        </Text>
        <TouchableOpacity onPress={toggleDrawer}>
          <View style={styles.profileContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <Image source={{uri: profileImage}} style={styles.profileImage} />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 40,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
          }}>
          <TouchableOpacity
            onPress={() => handlePress('MyPatient')}
            style={styles.card}>
            <Icon name="user" size={50} color="white" style={styles.logo} />
            <Text style={styles.cardText}>My Patients</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('DoctorText CheckUp')}
            style={styles.card}>
            <Image
              source={require('../Src/images/chat.png')}
              style={styles.logo}
            />
            <Text style={styles.cardText}>Text Checkup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('DoctorVideo Consultation')}
            style={styles.card}>
            <Image
              source={require('../Src/images/consultation.png')}
              style={styles.logo}
            />
            <Text style={styles.cardText}>Video Consultation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('PatientFeedback')}
            style={styles.card}>
            <Image
              source={require('../Src/images/feedback.png')}
              style={styles.logo}
            />
            <Text style={styles.cardText}>Patient Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.drawer, {marginLeft: isDrawerOpen ? 0 : -300}]}>
        {/* User Profile in Drawer */}
        <TouchableOpacity >
          <View style={styles.profileContainer1}>
            <Image source={{uri: profileImage}} style={styles.profileImage} />
            <Text style={styles.userName1}>{userName}</Text>
          </View>
        </TouchableOpacity>
        {/* Add your drawer content here */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('MyCalendar');
            setIsDrawerOpen(false); // Close drawer after navigating
          }}>
          <Text style={{color:"gray"}}>My Calendar</Text>
        </TouchableOpacity>
        <View style={styles.drawerItem}>
          <Text style={{color:"gray"}}>Enable Online Consultation</Text>
          <Switch
            value={onlineConsultation}
            onValueChange={toggleOnlineConsultation}
            style={styles.switch}
          />
        </View>
        {/* Additional notification text */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('DoctorNotification');
            setIsDrawerOpen(false); // Close drawer after navigating
          }}>
          <Text style={{color:"gray"}}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('About');
            setIsDrawerOpen(false); // Close drawer after navigating
          }}>
          <Text style={{color:"gray"}}>About Doctor Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('Help');
            setIsDrawerOpen(false); // Close drawer after navigating
          }}>
          <Text style={{color:"gray"}}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('DeleteAccount');
            setIsDrawerOpen(false); // Close drawer after navigating
          }}>
          <Text style={{color:"gray"}}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('Logout');
            setIsDrawerOpen(false); // Close drawer after navigating
          }}>
          <Text style={{color:"gray"}}>Logout</Text>
          <Image
            source={require('../Src/images/Logout.png')}
            style={styles.logoutImage}
          />
        </TouchableOpacity>
      </View>

      {/* Overlay */}
      {isDrawerOpen && (
        <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#0D4744',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    width: 300, // Width of the drawer
    zIndex: 100, // Ensure drawer is on top of content
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 1,
    paddingTop: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  profileContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userName1: {
    fontSize: 20,
    fontWeight: 'bold',
    color:"gray"
  },
  drawerItem: {
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}], // Adjust switch size
  },
  logoutImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#136b66',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 25,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Home;
