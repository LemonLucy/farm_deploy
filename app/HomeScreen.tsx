import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions(); // Get screen width
  const isLargeScreen = width > 800; // Define large screen breakpoint

  return (
    <ImageBackground
      source={require('@/assets/images/bg.jpg')}
      style={styles.fullScreenBackground}
    >
      <View style={[styles.container, isLargeScreen && styles.largeScreenContainer]}>
        <View style={[styles.row, isLargeScreen && styles.largeRow]}>
          <TouchableOpacity
            style={[styles.button, isLargeScreen && styles.largeButton]}
            onPress={() => router.push('/ManageCrops')}
          >
            <Image
              source={require('@/assets/images/managebtn.jpg')}
              style={[styles.buttonImage, isLargeScreen && styles.largeButtonImage]}
            />
            <Text style={styles.buttonText}>Crop Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isLargeScreen && styles.largeButton]}
            onPress={() => router.push('/ManagePests')}
          >
            <Image
              source={require('@/assets/images/calendar.jpg')}
              style={[styles.buttonImage, isLargeScreen && styles.largeButtonImage]}
            />
            <Text style={styles.buttonText}>Control Calendar</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, isLargeScreen && styles.largeRow]}>
          <TouchableOpacity
            style={[styles.button, isLargeScreen && styles.largeButton]}
            onPress={() => router.push('/CropAnalysis')}
          >
            <Image
              source={require('@/assets/images/analysisbtn.jpg')}
              style={[styles.buttonImage, isLargeScreen && styles.largeButtonImage]}
            />
            <Text style={styles.buttonText}>Crop Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isLargeScreen && styles.largeButton]}
            onPress={() => router.push('/RobotControl')}
          >
            <Image
              source={require('@/assets/images/robotbtn.jpg')}
              style={[styles.buttonImage, isLargeScreen && styles.largeButtonImage]}
            />
            <Text style={styles.buttonText}>Robot Control</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
    width: 'auto',
    height: 'auto'
    //resizeMode: 'cover', // Ensure background fits the screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeScreenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  largeRow: {
    flexDirection: 'column',
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    width: 160,
    height: 200,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Web-specific shadow
        }
      : {
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        }),
  },
  largeButton: {
    width: 200,
    height: 240,
  },
  buttonImage: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
  },
  largeButtonImage: {
    height: '85%', // Slightly larger for large screens
  },
  buttonText: {
    color: '#1B5E20',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

