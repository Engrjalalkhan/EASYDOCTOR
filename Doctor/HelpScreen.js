import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HelpScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome to Easy Doctor Help</Text>
      
      <Text style={styles.text}>
        Easy Doctor is designed to simplify and optimize your healthcare experience, whether you're a doctor or a patient. Below, we'll guide you through the key uses, functionalities, performance highlights, and operational insights of the Easy Doctor app.
      </Text>
      
      <Text style={styles.subHeading}>Uses and Functionalities:</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Efficient Appointment Management:</Text>
        <Text style={styles.description}>
          Easily schedule, manage, and track appointments with your preferred healthcare providers.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Seamless Communication:</Text>
        <Text style={styles.description}>
          Communicate securely with your doctor through messaging or telemedicine features for consultations, follow-ups, and sharing medical information.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Comprehensive Patient Management:</Text>
        <Text style={styles.description}>
          Access and update patient records, medical history, prescriptions, and notes for personalized and informed care delivery.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Electronic Prescriptions:</Text>
        <Text style={styles.description}>
          Generate and send electronic prescriptions directly to pharmacies, improving efficiency and accuracy in medication management.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Secure Data Handling:</Text>
        <Text style={styles.description}>
          Easy Doctor prioritizes the security and privacy of patient information, ensuring compliance with healthcare regulations such as HIPAA.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Intuitive Interface:</Text>
        <Text style={styles.description}>
          With a user-friendly interface, Easy Doctor makes it easy for both doctors and patients to navigate and utilize its features effectively.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Real-Time Notifications:</Text>
        <Text style={styles.description}>
          Stay updated with real-time notifications for upcoming appointments, messages, or other relevant updates, ensuring timely responses and improved engagement.
        </Text>
      </View>
      
      <Text style={styles.subHeading}>Performance Highlights:</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Reliability:</Text>
        <Text style={styles.description}>
          Easy Doctor boasts robust infrastructure to ensure reliable performance, minimizing downtime and disruptions.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Speed:</Text>
        <Text style={styles.description}>
          Enjoy fast and responsive interactions with the app, enabling swift appointment scheduling, communication, and data access.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Scalability:</Text>
        <Text style={styles.description}>
          Easy Doctor is built to scale, accommodating the growing needs of healthcare practices and patient volumes.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Security:</Text>
        <Text style={styles.description}>
          Your data is encrypted and protected with industry-standard security protocols, ensuring confidentiality and compliance with healthcare regulations.
        </Text>
      </View>
      
      <Text style={styles.subHeading}>How It Works:</Text>
      {/* Add how it works description containers */}
      
      <Text style={styles.subHeading}>Need Further Assistance?</Text>
      <Text style={styles.text}>
        If you have any questions, encounter any issues, or need further assistance, please don't hesitate to reach out to our support team. We're here to ensure that your experience with Easy Doctor is seamless, efficient, and satisfactory.
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
    color:'gray'
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color:'gray'
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color:'gray'
  },
  descriptionContainer: {
    marginBottom: 15,
    color:'gray'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'gray'
  },
  description: {
    fontSize: 16,
    color:'gray'
  },
});

export default HelpScreen;
