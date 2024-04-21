import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome to Easy Doctor</Text>
      <Text style={styles.paragraph}>
        Easy Doctor is your comprehensive solution for efficient and convenient healthcare management. Designed with both doctors and patients in mind, our platform streamlines the appointment scheduling process, facilitates seamless communication, and enhances patient care delivery.
      </Text>
      
      <Text style={styles.heading}>How It Works</Text>
      <View style={styles.section}>
        <Text style={styles.subHeading}>Effortless Appointment Scheduling</Text>
        <Text style={styles.description}>Doctors can easily manage their schedules and availability, while patients can book appointments with their preferred healthcare providers at their convenience.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subHeading}>Seamless Communication</Text>
        <Text style={styles.description}>Secure messaging and telemedicine capabilities enable doctors to communicate with patients effectively, whether for follow-ups, consultations, or sharing important medical information.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subHeading}>Comprehensive Patient Management</Text>
        <Text style={styles.description}>Doctors have access to comprehensive patient records, including medical history, prescriptions, and notes, allowing for personalized and informed care delivery.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subHeading}>Electronic Prescriptions</Text>
        <Text style={styles.description}>Generate and send electronic prescriptions directly to pharmacies, enhancing efficiency and accuracy in medication management.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subHeading}>Secure Data Handling</Text>
        <Text style={styles.description}>Easy Doctor prioritizes the security and privacy of patient information, ensuring compliance with healthcare regulations such as HIPAA.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subHeading}>User-Friendly Interface</Text>
        <Text style={styles.description}>With a clean and intuitive interface, Easy Doctor makes it easy for doctors to navigate and utilize its features without unnecessary complexity.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subHeading}>Integration with Healthcare Systems</Text>
        <Text style={styles.description}>Seamless integration with Electronic Medical Record (EMR) systems ensures access to up-to-date patient data and enhances workflow efficiency.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subHeading}>Real-Time Notifications</Text>
        <Text style={styles.description}>Doctors receive real-time notifications for upcoming appointments, messages from patients, or other relevant updates, ensuring timely responses and improved patient engagement.</Text>
      </View>
      
      <Text style={styles.heading}>Join Easy Doctor Today</Text>
      <Text style={styles.paragraph}>
        Join thousands of healthcare professionals who trust Easy Doctor to streamline their practice and deliver high-quality care to their patients. Experience the convenience and efficiency of Easy Doctor today.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
  },
});

export default AboutScreen;
