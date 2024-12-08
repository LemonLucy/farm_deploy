import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import axios from "axios";

const backgroundImage = require("@/assets/images/bg6.jpg");

const API_BASE_URL = "http://10.55.5.45:5000";

const RobotControl: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string>("Ready to control the robot");

  const sendCommand = async (command: "forward" | "stop" | "backward" | "spray") => {
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
    <View style={styles.container}>
      {/* Top Section with Background Image */}
      <View style={styles.imageContainer}>
        <ImageBackground source={backgroundImage} style={styles.bgImage}>
          
        </ImageBackground>
      </View>

      {/* Bottom Section with Control Buttons */}
      <View style={styles.controlContainer}>
        <ScrollView contentContainerStyle={styles.controlPanel}>
          {/* North (Up) Button */}
          <TouchableOpacity
            style={styles.circularGreenButton}
            onPress={() => sendCommand("forward")}
          >
            <Text style={styles.buttonText}>↑</Text>
          </TouchableOpacity>

          <View style={styles.middleRow}>
            {/* West (Left) Button */}
            <TouchableOpacity style={styles.circularGreenButton}>
              <Text style={styles.buttonText}>←</Text>
            </TouchableOpacity>

            {/* STOP Button */}
            <TouchableOpacity
              style={styles.redButton}
              onPress={() => sendCommand("stop")}
            >
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>

            {/* East (Right) Button */}
            <TouchableOpacity style={styles.circularGreenButton}>
              <Text style={styles.buttonText}>→</Text>
            </TouchableOpacity>
          </View>

          {/* South (Down) Button */}
          <TouchableOpacity
            style={styles.circularGreenButton}
            onPress={() => sendCommand("backward")}
          >
            <Text style={styles.buttonText}>↓</Text>
          </TouchableOpacity>

          {/* Spray Pesticide Button */}
          <TouchableOpacity
            style={styles.sprayButton}
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
    //backgroundColor: "#2E7D32",
  },
  imageContainer: {
    flex: 1.5,
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color:  "#FFFFFF",
    //textAlign: "center",
  },
  statusMessage: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 5,
    textAlign: "center",
  },
  controlContainer: {
    flex: 1,
    //backgroundColor: "#FFFFFF",
    backgroundColor: "#2E7D32",
    padding: 30,
  },
  controlPanel: {
    alignItems: "center",
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  circularGreenButton: {
    backgroundColor: "#6dbb63",
    width: 100,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  redButton: {
    backgroundColor: "red",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  sprayButton: {
    backgroundColor: "#4f9d69",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RobotControl;
