import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUpWithMobileScreen from '../Src/Screen/SignUpScreen';
import SelctionScreen from '../Src/Screen/SelectionScreen';
import SignInWithMobileScreen from '../Src/Screen/SignInScreen';
import ForgotScreen from '../Src/Screen/ForgotScreen';
import SplashScreen from '../Src/Screen/SplashScreen';
import DoctorProfile from '../Doctor/DoctorProfile';
import HomeScreen from '../Doctor/HomeScreen';
import PatientProfile from '../Patient/PatientProfile';
import DrawerScreen from '../Doctor/DrawerScreen';
import EditProfile from '../Doctor/EditProfile';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Selection" component={SelctionScreen} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUpWithMobileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="SignIn" component={SignInWithMobileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Forgot" component={ForgotScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}}/>
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown:false}}/>
        <Stack.Screen name="DrawerScreen" component={DrawerScreen} options={{headerShown:false}}/>
        <Stack.Screen name="PatientProfile" component={PatientProfile} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
