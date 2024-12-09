import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import CropInfo from "@/components/CropInfo/CropInfo";
import PestInfo from "@/components/CropInfo/PestInfo";
import DiseaseInfo from "@/components/CropInfo/DiseaseInfo";
import HealthStatus from "@/components/CropInfo/HealthStatus";

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
  const { width } = useWindowDimensions(); // 화면 크기 가져오기
  const isLargeScreen = width > 800; // 기준 폭 (800px 이상이면 큰 화면)

  const [cropData, setCropData] = useState<CropData[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(
    null
  );

  const API_BASE_URL = "http://3.39.25.137:5000";

  const BUTTON_IMAGES = [
    { id: "1", image: require("../assets/images/strawberry.jpg") },
    { id: "2", image: require("../assets/images/lettuce.jpg") },
    { id: "3", image: require("../assets/images/onions.jpg") },
    { id: "4", image: require("../assets/images/cornbg.jpg") },
    { id: "5", image: require("../assets/images/mandarin.jpg") },
    { id: "6", image: require("../assets/images/cucum.jpg") },
  ];

  const determineHealthStatus = (data: CropData) => {
    const pestSeverity = data.pest_information?.severity || "None";
    const diseaseSeverity = data.disease_information?.severity || "None";
    const overallHealth = data.crop_health_information?.overall_health || "Unknown";

    let conditionsMet = 0;

    if (pestSeverity === "None") conditionsMet += 1;
    if (diseaseSeverity === "None") conditionsMet += 1;
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
      <View
  style={[
    styles.bgcontainer,
    isLargeScreen && styles.largeScreenContainer, // 큰 화면일 때 스타일 추가
  ]}
>
  <ScrollView
    contentContainerStyle={[
      styles.container,
      isLargeScreen && styles.largeScreenContent, // 큰 화면일 때 스타일 추가
    ]}
  >
    <Text style={styles.title}>Crop Details</Text>
    <View
      style={[
        styles.infoContainer,
        isLargeScreen && styles.largeInfoContainer, // 큰 화면일 때 스타일 추가
      ]}
    >
      <CropInfo crop={detailedData.crop_information} />
      <PestInfo pest={detailedData.pest_information} />
      <DiseaseInfo disease={detailedData.disease_information} />
      <HealthStatus health={detailedData.crop_health_information} />
      {detailedData.image_url && (
        <Image
          source={{ uri: detailedData.image_url }}
          style={[
            styles.cropImage,
            isLargeScreen && styles.largeCropImage, // 큰 화면일 때 이미지 크기 조정
          ]}
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
                  isLargeScreen && styles.largeCalendarCell, // 큰 화면에서는 더 큰 셀
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

  return (
    <View style={[styles.bgcontainer, isLargeScreen && styles.largeContainer]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Manage Crop</Text>
        <View
          style={[
            styles.cropRowContainer,
            isLargeScreen && styles.largeCropRowContainer,
          ]}
        >
          {BUTTON_IMAGES.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={[
                styles.cropImageButton,
                isLargeScreen && styles.largeCropImageButton,
              ]}
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
  // 이미 기존에 작성된 스타일은 유지됩니다
  bgcontainer: {
    flex: 1,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  largeScreenContainer: {
    paddingHorizontal: 50, // 큰 화면에서 여백 추가
  },
  largeContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 20,
  },
  largeScreenContent: {
    width: "80%", // 큰 화면에서는 넓게 표시
    alignSelf: "center",
  },
  container: {
    flexGrow: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFFFF",
  },
  cropRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  largeCropRowContainer: {
    justifyContent: "space-between",
  },
  cropImageButton: {
    margin: 10,
    width: 140,
    height: 140,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  largeCropImageButton: {
    width: 200,
    height: 200,
  },
  cropImageButtonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cropImage: {
    width: "100%", // 반응형으로 전체 너비에 맞게 설정
    maxWidth: 300, // 최대 너비 설정
    height: 200, // 고정 높이 설정
    resizeMode: "contain", // 이미지가 잘리지 않도록 설정
    borderRadius: 10,
    marginVertical: 10,
  },
  infoContainer: {
    width: "90%", // 화면 크기에 따라 적응
    maxWidth: 600, // 큰 화면에서 최대 너비 설정
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 20,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 웹에서의 그림자 효과
        }
      : {
          shadowColor: "#000", // iOS/Android에서의 그림자 효과
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }),
    elevation: 2, // Android에서 그림자 높이
  },
  largeInfoContainer: {
    width: "100%", // 큰 화면에서 더 넓게
    maxWidth: "80%",
    padding: 20,
  },
  largeCropImage: {
    maxWidth: 500, // 큰 화면에서는 더 큰 이미지
    height: 300,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
    overflow: "scroll",
  },
  calendarCell: {
    width: "20%", // 한 줄에 5개의 셀
    height: '15%', // 셀 고정 높이
    margin: 5, // 셀 간격
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderWidth: 1, // 셀 테두리
    borderColor: "#000",
    borderRadius: 8, // 둥근 테두리
  },
  largeCalendarCell: {
    width: "16%", // 더 큰 화면에서는 한 줄에 6개의 셀
    height: 100,
    margin: 5
  },
  cellText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  timestampText: {
    fontSize: 12,
    color: "#FFF",
    textAlign: "center",
  },
  emptyCellText: {
    color: "#CCC",
  },
  activeCell: {
    backgroundColor: "#4CAF50", // 활성화된 셀 색상
  },
});

export default ManageCrops;
