import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView,Platform } from 'react-native';
import CropInfo from '@/components/CropInfo/CropInfo';
import PestInfo from '@/components/CropInfo/PestInfo';
import DiseaseInfo from '@/components/CropInfo/DiseaseInfo';
import HealthStatus from '@/components/CropInfo/HealthStatus';

type CropData = {
  crop_information: {
    name: string;
    species: string;
    growth_stage: string;
  };
  pest_information: {
    pest_name: string;
    severity: string;
    pesticide: string;
  };
  disease_information: {
    disease_name: string;
    symptoms: string;
    severity: string;
    pesticide: string;
  };
  crop_health_information: {
    overall_health: string;
    recommended_action: string;
  };
  timestamp: string;
  crop_id: string;
  image_url?: string; 
  healthColor?: string;
  control_plan?: {
    control_start_date: string;
    control_interval: number;
    control_duration: number;
    control_method: string;
    pesticide_dosage: string;
    estimated_cost: number;
  };
};

const ManageCrops: React.FC = () => {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null);

  const API_BASE_URL = 'http://3.39.25.137:5000';

  const BUTTON_IMAGES = [
    { id: "1", image: require("../assets/images/strawberry.jpg") },
    { id: "2", image: require("../assets/images/lettuce.jpg") },
    { id: "3", image: require("../assets/images/onions.jpg") },
    { id: "4", image: require("../assets/images/cornbg.jpg") },
    { id: "5", image: require("../assets/images/mandarin.jpg") },
    { id: "6", image: require("../assets/images/cucum.jpg") },
  ];

  // Function to determine health status
  const determineHealthStatus = (data: CropData) => {
    const pestSeverity = data.pest_information?.severity || "None";
    const diseaseSeverity = data.disease_information?.severity || "None";
    const overallHealth = data.crop_health_information?.overall_health || "Unknown";

    let conditionsMet = 0;

    if (pestSeverity === "None"|| pestSeverity === "N/A") conditionsMet += 1;
    if (diseaseSeverity === "None"||diseaseSeverity === "N/A") conditionsMet += 1;
    if (overallHealth === "Healthy") conditionsMet += 1;

    if (conditionsMet === 3) {
      return { status: "Healthy", color: "#4CAF50" }; // Green
    } else if (conditionsMet === 2) {
      return { status: "Moderate", color: "#FFEB3B" }; // Yellow
    } else {
      return { status: "Unhealthy", color: "#F44336" }; // Red
    }
  };

  // Group data by crop_id and timestamp
  const groupByCropAndTimestamp = (data: CropData[]) => {
    const grouped: { [cropId: string]: { [timestamp: string]: CropData } } = {};

    data.forEach((item) => {
      const cropId = item.crop_id;
      const timestamp = item.timestamp;

      if (!grouped[cropId]) grouped[cropId] = {};
      grouped[cropId][timestamp] = item;
    });

    return grouped;
  };

  // Load crop data
  useEffect(() => {
    const loadCropData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fetch/crop-data`);
        if (!response.ok) throw new Error("Failed to fetch crop data");

        const jsonData: CropData[] = await response.json();
        const processedData = jsonData.map((item) => {
          const healthInfo = determineHealthStatus(item);
          return { ...item, healthColor: healthInfo.color };
        });

        setCropData(processedData);
      } catch (error) {
        console.error("Error fetching crop data:", error);
      }
    };

    loadCropData();
  }, []);

  if (!cropData.length) {
    return (
      <View style={styles.bgcontainer}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  const groupedData = groupByCropAndTimestamp(cropData);

  if (selectedCrop && selectedTimestamp) {
    const detailedData = groupedData[selectedCrop][selectedTimestamp];
  
    if (!detailedData) {
      console.error("No data found for timestamp:", selectedTimestamp);
      return null;
    }
  
    return (
      <View style={styles.bgcontainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Crop Details</Text>
          <View style={styles.infoContainer}>
            <CropInfo crop={detailedData.crop_information} />
            <PestInfo pest={detailedData.pest_information} />
            <DiseaseInfo disease={detailedData.disease_information} />
            <HealthStatus health={detailedData.crop_health_information} />
            {detailedData.image_url && (
              <Image
                source={{ uri: detailedData.image_url }}
                style={styles.cropImage}
              />
            )}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedTimestamp(null)}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render timestamp options for a selected crop
  if (selectedCrop && !selectedTimestamp) {
    const timestamps = Object.keys(groupedData[selectedCrop]).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const totalCells = 35;
    const calendarCells = Array.from({ length: totalCells }, (_, index) => timestamps[index] || null);

    return (
      <View style={styles.bgcontainer}>
        <Text style={styles.title}>Crop Status</Text>
        <View style={styles.calendarContainer}>
          {calendarCells.map((timestamp, index) => {
            const data = timestamp ? groupedData[selectedCrop][timestamp] : null;
            const isUnhealthy =
              data &&
              (
                (data.pest_information.pest_name !== "None" && data.pest_information.pest_name !== "N/A") ||
                (data.disease_information.disease_name !== "None" && data.disease_information.disease_name !== "N/A")
              );
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarCell,
                  { backgroundColor: timestamp ? data?.healthColor || "#E0E0E0" : "#E0E0E0" },
                ]}
                onPress={() => timestamp && setSelectedTimestamp(timestamp)}
                disabled={!timestamp}
              >
                <Text style={styles.cellText}>
                  {isUnhealthy ? (data?.pest_information.pest_name !== "N/A" && data?.pest_information.pest_name !== "None"
                    ? data?.pest_information.pest_name
                    : data?.disease_information.disease_name !== "N/A" && data?.disease_information.disease_name !== "None"
                    ? data?.disease_information.disease_name
                    : "") : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCrop(null)}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render crop buttons
  return (
    <View style={styles.bgcontainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Manage Crop</Text>
        <View style={styles.cropRowContainer}>
          {BUTTON_IMAGES.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={styles.cropImageButton}
              onPress={() => setSelectedCrop(button.id)}
            >
              <Image source={button.image} style={styles.cropImageButtonImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bgcontainer: {
    flex: 1,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  container: {
    flexGrow: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    gap: 20,
  },
  cropRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  cropImageButton: {
    margin: 10,
    width: 140,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  cropImageButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Web에서 boxShadow 사용
        }
      : {
          shadowColor: '#000', // iOS/Android에서 shadow* 사용
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }),
    elevation: 2,
    marginBottom: 70,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  cropImage: {
    width: 250,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  cropButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 60,
    borderColor: '#000',
    borderWidth: 1,
  },
  backButton: {
    position: 'absolute',
    width: '50%',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    zIndex: 1000,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  calendarCell: {
    width: '20%', // 7 cells per row
    height: 80,
    aspectRatio: 1, // Keep cells square
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderWidth: 1, // 캘린더 전체 테두리
    borderColor: '#000', // 테두리 색상
    //borderRadius: 8,
  },
  activeCell: {
    backgroundColor: '#4CAF50',
  },
  cellText: {
    fontSize: 14,
    color: '#000',
  },
  timestampText: {
    fontSize: 10,
    color: '#FFF',
  },
  emptyCellText: {
    color: '#CCC',
  },
});

export default ManageCrops;