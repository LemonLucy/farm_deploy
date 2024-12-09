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
  const { width } = useWindowDimensions(); // Get screen dimensions
  const isLargeScreen = width > 800; // Threshold for large screens
  const chartWidth = isLargeScreen ? 400 : width * 0.9; // Adjust chart size dynamically

  const apiUrl = "http://3.39.25.137:5000/fetch/crop-data";
  const { cropData, loading, error } = useFetchCropData(apiUrl);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [healthChartData, setHealthChartData] = useState({
    labels: ["No Data"],
    datasets: [{ data: [0] }],
  });
  const [pieChartData, setPieChartData] = useState<{
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }[]>([]);

  const uniqueCrops = Array.from(
    new Map(cropData.map((crop) => [crop.crop_id, crop.crop_information.name])).entries()
  );

  const generatePieChartData = () => {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF5722"];
    const aggregatedData = uniqueCrops.map(([cropId, cropName], index) => {
      const crops = cropData.filter((crop) => crop.crop_id === cropId);

      const totalPestCount = crops.reduce((sum, crop) => sum + (crop.pest_information?.pest_count || 0), 0);

      return {
        name: cropName,
        population: totalPestCount,
        color: colors[index % colors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      };
    });

    setPieChartData(aggregatedData);
  };

  const updateChartData = (cropId: string) => {
    const filteredCrops = cropData.filter((crop) => crop.crop_id === cropId);
    const timestamps = filteredCrops.map((_, index) => `${index + 1} day`);
    const healthScores = filteredCrops.map(
      (crop) => crop.crop_health_information?.overall_health_score || 0
    );

    setHealthChartData({
      labels: timestamps.length > 0 ? timestamps : ["No Data"],
      datasets: [{ data: healthScores.length > 0 ? healthScores : [0] }],
    });

    setSelectedCrop(cropId);
  };

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Total Crop Analysis</Text>

      <View style={[styles.chartsContainer, isLargeScreen && styles.largeScreenChartsContainer]}>
        {/* Pie Chart */}
        <View style={styles.chartWrapper}>
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
        </View>

        {/* Line Chart */}
        <View style={styles.chartWrapper}>
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
        </View>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2E7D32",
    padding: 20,
    alignItems: "center",
  },
  chartsContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  largeScreenChartsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartWrapper: {
    marginVertical: 10,
    alignItems: "center",
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
    marginTop: 20,
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
