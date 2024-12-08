import React from 'react';
import { ImageBackground, View, Text,Image,Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/bg.jpg')}
      style={styles.fullScreenBackground}
    >
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/ManageCrops')}
          >
            <Image
              source={require('@/assets/images/managebtn.jpg')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Crop Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/ManagePests')}
          >
            <Image
              source={require('@/assets/images/calendar.jpg')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Control Calendar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {router.push('/CropAnalysis')
          }}>
            <Image
              source={require('@/assets/images/analysisbtn.jpg')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Crop Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.button}
          onPress={() => {router.push('/RobotControl')
          }}>
            <Image
              source={require('@/assets/images/robotbtn.jpg')}
              style={styles.buttonImage}
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
    resizeMode: 'cover', // 이미지가 화면에 맞게 조정
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  button: {
    width: 180,
    height: 220,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 버튼 배경 투명도 조절
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Web 전용 스타일
        }
      : {
        shadowColor: '#000', // 그림자 색상 (iOS)
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 40,
        }),
  },
  buttonImage: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
    //marginBottom: 70, // 텍스트와 이미지 간격
  },
  buttonText: {
    color: '#1B5E20',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
