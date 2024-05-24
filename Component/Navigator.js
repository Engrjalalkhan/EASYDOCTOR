import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SignUpWithMobileScreen from '../Src/Screen/SignUpScreen';
import SelctionScreen from '../Src/Screen/SelectionScreen';
import SignInWithMobileScreen from '../Src/Screen/SignInScreen';
import ForgotScreen from '../Src/Screen/ForgotScreen';
import SplashScreen from '../Src/Screen/SplashScreen';
import DoctorProfile from '../Doctor/DoctorProfile';
import HomeScreen from '../Doctor/HomeScreen';
import PatientProfile from '../Patient/PatientProfile';
import DrawerScreen from '../Doctor/DrawerScreen';
import AboutScreen from '../Doctor/AboutScreen';
import HelpScreen from '../Doctor/HelpScreen';
import DeleteAccountScreen from '../Doctor/DeleteAccountScreen';
import PatientHome from '../Patient/PatientHomeScreen';
import MyCalendarScreen from '../Doctor/MyCalender';
import CalendarComponent from '../Doctor/Calendar';
import MyPatient from '../Doctor/MyPatient';
import BookNew from '../Patient/BookNew';
import DentalScreen from '../Patient/DentalScreen';
import CardiologyScreen from '../Patient/CardiologyScreen';
import DermatologyScreen from '../Patient/DermatologyScreen';
import BrainScreen from '../Patient/BrainScreen';
import PediatricsScreen from '../Patient/PediatricsScreen';
import OrthopedicScreen from '../Patient/OrthopedicScreen';
import ViewProfile from '../Patient/ViewProfile';
import UserFeedback from '../Doctor/UserFeedback';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Selection"
          component={SelctionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpWithMobileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInWithMobileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Forgot"
          component={ForgotScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DoctorProfile"
          component={DoctorProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="DrawerScreen"
          component={DrawerScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccountScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="MyCalendar"
          component={MyCalendarScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Calendar"
          component={CalendarComponent}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="MyPatient"
          component={MyPatient}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="PatientProfile"
          component={PatientProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PatientHome"
          component={PatientHome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewAppointment"
          component={BookNew}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DentalScreen"
          component={DentalScreen}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="CardiologyScreen"
          component={CardiologyScreen}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="DermatologyScreen"
          component={DermatologyScreen}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="BrainScreen"
          component={BrainScreen}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="PediatricsScreen"
          component={PediatricsScreen}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="FeedbackScreen"
          component={ViewProfile}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="PatientFeedback"
          component={UserFeedback}
          // options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
