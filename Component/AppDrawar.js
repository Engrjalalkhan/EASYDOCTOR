import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Home from '../Doctor/HomeScreen';
import DoctorProfile from '../Doctor/DoctorProfile';
import DrawerScreen from '../Doctor/DrawerScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" drawerContent={CustomDrawerContent}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="DoctorProfile" component={DoctorProfile} />
        <Drawer.Screen name="DrawerScreen" component={DrawerScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
