// uploadVoiceMessage.js
import storage from '@react-native-firebase/storage';

export const uploadVoiceMessage = async (voiceUri) => {
  const fileName = `voices/${Date.now()}.wav`;
  const reference = storage().ref(fileName);

  try {
    await reference.putFile(voiceUri);
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
