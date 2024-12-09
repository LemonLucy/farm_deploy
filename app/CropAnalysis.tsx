import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useFetchCropData } from "@/hooks/useFetchCropData";

const CropAnalysis: React.FC = () => {
  const { width } = useWindowDimensions(); // 화면 크기 가져오기
  const isLargeScreen = width > 800; // 큰 화면 기준 설정
  const chartWidth = isLargeScreen ? 600 : width * 0.9; // 차트 크기 동적 설정

  const apiUrl = "http://3.39.25.137:5000/fetch/crop-data";
  const { cropData, loading, error } = useFetchCropData(apiUrl);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [healthChartData, setHealthChartData] = useState({
    labels: ["No Data"],
    datasets: [{ data: [0] }],
  });
  const [pestChartData, setPestChartData] = useState({
    labels: ["No Data"],
    datasets: [{ data: [0] }],
  });
  const [diseaseChartData, setDiseaseChartData] = useState({
    labels: ["No Data"],
    datasets: [{ data: [0] }],
  });
  const [pieChartData, setPieChartData] = useState<
    { name: string; population: number; color: string; legendFontColor: string; legendFontSize: number }[]
  >([]);

  const uniqueCrops = Array.from(
    new Map(cropData.map((crop) => [crop.crop_id, crop.crop_information.name])).entries()
  );

  const generatePieChartData = () => {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF5722"];
    const aggregatedData = uniqueCrops.map(([cropId, cropName], index) => {
      const crops = cropData.filter((crop) => crop.crop_id === cropId);

      const totalPestCount = crops.reduce((sum, crop) => sum + (crop.pest_information?.pest_count || 0), 0);
      const totalSeverityScore = crops.reduce(
        (sum, crop) => sum + (crop.disease_information?.severity_score || 0),
        0
      );

      return {
        name: cropName,
        population: totalPestCount + totalSeverityScore,
        color: colors[index % colors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      };
    });

    setPieChartData(aggregatedData);
  };

  const updateChartData = (cropId: string) => {
    const filteredCrops = cropData.filter((crop) => crop.crop_id === cropId);

    const timestamps = filteredCrops.map((_, index) => `${index + 1}day`);
    const healthScores = filteredCrops.map(
      (crop) => crop.crop_health_information?.overall_health_score || 0
    );
    const pestCounts = filteredCrops.map(
      (crop) => crop.pest_information?.pest_count || 0
    );
    const diseaseScores = filteredCrops.map(
      (crop) => crop.disease_information?.severity_score || 0
    );

    setHealthChartData({
      labels: timestamps.length > 0 ? timestamps : ["No Data"],
      datasets: [{ data: healthScores.length > 0 ? healthScores : [0] }],
    });

    setPestChartData({
      labels: timestamps.length > 0 ? timestamps : ["No Data"],
      datasets: [{ data: pestCounts.length > 0 ? pestCounts : [0] }],
    });

    setDiseaseChartData({
      labels: timestamps.length > 0 ? timestamps : ["No Data"],
      datasets: [{ data: diseaseScores.length > 0 ? diseaseScores : [0] }],
    });

    setSelectedCrop(cropId);
  };

  // 첫 로드 시 Total Analysis 데이터를 표시
  useEffect(() => {
    if (uniqueCrops.length > 0 && cropData.length > 0) {
      generatePieChartData();
      const firstCropId = uniqueCrops[0][0];
      updateChartData(firstCropId);
    }
  }, [cropData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading crop data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {error}</Text>
      </View>
    );
  }

  if (cropData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No data available for visualization.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isLargeScreen && styles.largeContainer]}>
      <ScrollView>
        <Text style={styles.title}>Total Crop Analysis</Text>

        {/* Total Analysis Pie Chart */}
        <Text style={styles.chartTitle}>Pest and Disease Rate</Text>
        <PieChart
          data={pieChartData}
          width={chartWidth}
          height={220}
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        {/* Crop Selection Buttons */}
        <View style={styles.buttonContainer}>
          {uniqueCrops.map(([cropId, cropName], index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.cropButton,
                selectedCrop === cropId && styles.selectedButton,
              ]}
              onPress={() => updateChartData(cropId)}
            >
              <Text style={styles.buttonText}>{cropName}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Score Line Chart */}
        <Text style={styles.chartTitle}>Health Score Over Time</Text>
        <LineChart
          data={healthChartData}
          width={chartWidth}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" pts"
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  largeContainer: {
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFFFF",
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  cropButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: "#FF5722",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CropAnalysis;
