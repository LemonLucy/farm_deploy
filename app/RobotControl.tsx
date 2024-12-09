import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import axios from "axios";

const backgroundImage = require("@/assets/images/bg6.jpg");

const API_BASE_URL = "http://3.39.25.137:5000";

const RobotControl: React.FC = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 800; // 기준 폭 설정 (예: 800px 이상이면 대형 화면)
  const [statusMessage, setStatusMessage] = useState<string>(
    "Ready to control the robot"
  );

  const sendCommand = async (command: "forward" | "stop" | "backward" |"left" | "right"| "spray") => {
    try {
      const response = await axios.post(`${API_BASE_URL}/robot/control`, { command });
      setStatusMessage(`Command '${command}' sent successfully`);
      console.log("Command sent successfully:", response.data);
    } catch (error) {
      setStatusMessage(`Failed to send command '${command}'`);
      console.error("Error sending command:", error);
    }
  };

  return (
    <View style={[styles.container, isLargeScreen && styles.largeContainer]}>
      {/* Left Section with Background Image */}
      <View style={[styles.imageContainer, isLargeScreen && styles.largeImageContainer]}>
        <ImageBackground source={backgroundImage} style={styles.bgImage} />
      </View>

      {/* Right Section with Control Buttons */}
      <View style={[styles.controlContainer, isLargeScreen && styles.largeControlContainer]}>
        <Text style={styles.statusMessage}>{statusMessage}</Text>

        <ScrollView contentContainerStyle={styles.controlPanel}>
          <View style={styles.controlGroup}>
            {/* North (Up) Button */}
            <TouchableOpacity
              style={[styles.circularGreenButton, isLargeScreen && styles.largeButton]}
              onPress={() => sendCommand("forward")}
            >
              <Text style={styles.buttonText}>↑</Text>
            </TouchableOpacity>

            {/* Middle Row with Left, Stop, and Right Buttons */}
            <View style={[styles.middleRow, isLargeScreen && styles.largeMiddleRow]}>
              <TouchableOpacity
                style={[styles.circularGreenButton, isLargeScreen && styles.largeButton]}
                onPress={() => sendCommand("left")}
              >
                <Text style={styles.buttonText}>←</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.redButton, isLargeScreen && styles.largeButton]}
                onPress={() => sendCommand("stop")}
              >
                <Text style={styles.buttonText}>STOP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.circularGreenButton, isLargeScreen && styles.largeButton]}
                onPress={() => sendCommand("right")}
              >
                <Text style={styles.buttonText}>→</Text>
              </TouchableOpacity>
            </View>

            {/* South (Down) Button */}
            <TouchableOpacity
              style={[styles.circularGreenButton, isLargeScreen && styles.largeButton]}
              onPress={() => sendCommand("backward")}
            >
              <Text style={styles.buttonText}>↓</Text>
            </TouchableOpacity>
          </View>

          {/* Spray Pesticide Button */}
          <TouchableOpacity
            style={[styles.sprayButton, isLargeScreen && styles.largeSprayButton]}
            onPress={() => sendCommand("spray")}
          >
            <Text style={styles.buttonText}>Spray Pesticide</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  largeContainer: {
    flexDirection: "row", // 이미지와 버튼을 나란히 배치
  },
  imageContainer: {
    flex: 1.5,
    backgroundColor: "#000",
  },
  largeImageContainer: {
    flex: 2, // 화면 비율 조정
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
  },
  controlContainer: {
    flex: 1,
    backgroundColor: "#2E7D32",
    padding: 20,
  },
  largeControlContainer: {
    padding: 40, // 여백 증가
    justifyContent: "center",
  },
  controlPanel: {
    alignItems: "center",
  },
  controlGroup: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusMessage: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  largeMiddleRow: {
    justifyContent: "space-evenly",
  },
  circularGreenButton: {
    backgroundColor: "#6dbb63",
    width: 80,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  largeButton: {
    width: 100,
    height: 60,
    borderRadius: 30,
  },
  redButton: {
    backgroundColor: "red",
    width: 80,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  sprayButton: {
    backgroundColor: "#4f9d69",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  largeSprayButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RobotControl;
