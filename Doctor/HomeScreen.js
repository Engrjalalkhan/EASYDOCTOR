import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

const Home = ({route, navigation}) => {
  const {profileImage, userName} = route.params;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [onlineConsultation, setOnlineConsultation] = useState(false); // Define onlineConsultation state

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleOnlineConsultation = () => {
    setOnlineConsultation(!onlineConsultation);
  };

  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile'); // Navigate to the EditProfile screen
  };

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity onPress={toggleDrawer}>
          <View style={styles.profileContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <Image source={{uri: profileImage}} style={styles.profileImage} />
          </View>
        </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text>Welcome to Home Screen!</Text>
        </View>

        {/* Add your home screen content here */}
      </View>

      {/* Drawer */}
      <View style={[styles.drawer, {marginLeft: isDrawerOpen ? 0 : -200}]}>
        {/* User Profile in Drawer */}
        <TouchableOpacity onPress={navigateToEditProfile}>
          <View style={styles.profileContainer1}>
            <Image source={{uri: profileImage}} style={styles.profileImage} />
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </TouchableOpacity>
        {/* Add your drawer content here */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => console.log('My Calendar clicked')}>
          <Text>My Calendar</Text>
        </TouchableOpacity>
        <View style={styles.drawerItem}>
          <Text>Enable Online Consultation</Text>
          <Switch
            value={onlineConsultation}
            onValueChange={toggleOnlineConsultation}
            style={styles.switch}
          />
        </View>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => console.log('About Doctor Easy clicked')}>
          <Text>About Doctor Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => console.log('Help clicked')}>
          <Text>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => console.log('Delete Account clicked')}>
          <Text>Delete Account</Text>
        </TouchableOpacity>
        <View style={styles.drawerItem}>
          <Text>Logout</Text>
          <Image
            source={require('../Src/images/Logout.png')}
            style={styles.logoutImage}
          />
        </View>
      </View>

      {/* Overlay */}
      {isDrawerOpen && (
        <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 40,
    backgroundColor: '#fff',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    width: 200, // Width of the drawer
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
    paddingRight:30,
    paddingLeft:10,
    justifyContent:'space-between'
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
});

export default Home;
