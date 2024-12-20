import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Calendar } from "react-native-calendars";

const CropCalendar = () => {
  const { width, height } = useWindowDimensions(); // 현재 화면 크기 가져오기
  const isLargeScreen = width > 800; // 큰 화면 기준 설정 (800px 초과)

  const [cropOpen, setCropOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [infoOptions, setInfoOptions] = useState<any[]>([]);
  const [controlPlan, setControlPlan] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [selectedDateInfo, setSelectedDateInfo] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const API_BASE_URL = "http://3.39.25.137:5000";

  const cropOptions = [
    { label: "딸기", value: "strawberry" },
    { label: "상추", value: "lettuce" },
    { label: "양파", value: "onion" },
    { label: "옥수수", value: "corn" },
    { label: "귤", value: "mandarin" },
    { label: "오이", value: "cucumber" },
  ];

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setStartDate(formattedDate);
  }, []);

  useEffect(() => {
    if (!selectedCrop) return;

    const fetchInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fetch/crop-data?crop=${selectedCrop}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log("Fetched Data:", data);

        const combinedList = data
          .flatMap((record: any, index: number) => {
            const pest = record?.pest_information?.pest_name
              ? {
                  name: record.pest_information.pest_name,
                  severity: record.pest_information.severity,
                  pesticide: record.pest_information.pesticide,
                  control_plan: record.control_plan,
                  type: "Pest",
                  id: `pest-${index}`,
                }
              : null;

            const disease = record?.disease_information?.disease_name
              ? {
                  name: record.disease_information.disease_name,
                  severity: record.disease_information.severity,
                  pesticide: record.disease_information.pesticide,
                  symptoms: record.disease_information.symptoms,
                  control_plan: record.control_plan,
                  type: "Disease",
                  id: `disease-${index}`,
                }
              : null;

            return [pest, disease].filter((item) => item !== null);
          })
          .filter(
            (item: any, index: number, self: any[]) =>
              index === self.findIndex((i) => i.name === item.name)
          );

        console.log("Combined Info List:", combinedList);

        setInfoOptions(combinedList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInfo();
  }, [selectedCrop]);

  const handleApplySchedule = () => {
    if (!selectedInfo || !startDate) {
      console.error("Incomplete data: startDate or selectedInfo is missing.");
      return;
    }

    const selectedData = infoOptions.find((info: any) => info.name === selectedInfo);

    if (!selectedData || !selectedData.control_plan) {
      console.error("Control plan not found for the selected info.");
      return;
    }

    const { control_interval, control_duration } = selectedData.control_plan;

    const newMarkedDates: { [date: string]: any } = {};
    const start = new Date(startDate);

    for (let i = 0; i < control_duration; i += control_interval) {
      const controlDate = new Date(start);
      controlDate.setDate(start.getDate() + i);
      const formattedDate = controlDate.toISOString().split("T")[0];
      newMarkedDates[formattedDate] = {
        marked: true,
        dotColor: "red",
        info: selectedData,
      };
    }

    setMarkedDates((prev) => ({ ...prev, ...newMarkedDates }));
    setControlPlan(selectedData.control_plan);
  };

  const handleDayPress = (day: any) => {
    const dateInfo = markedDates[day.dateString];
    console.log("Clicked Date Info:", dateInfo);
    if (dateInfo) {
      setSelectedDateInfo(dateInfo.info || null);
      setModalVisible(true);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isLargeScreen && { flexDirection: "row", paddingHorizontal: 40 },
      ]}
    >
      <View style={[styles.leftPanel, isLargeScreen && { flex: 1 }]}>
        <Text style={styles.title}>작물 방제 캘린더</Text>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            selectedDayBackgroundColor: "#00adf5",
            todayTextColor: "#00adf5",
            arrowColor: "orange",
          }}
        />
      </View>
      <View style={[styles.rightPanel, isLargeScreen && { flex: 1 }]}>
        <Text style={styles.label}>작물 선택</Text>
        <DropDownPicker
          open={cropOpen}
          value={selectedCrop}
          items={cropOptions}
          setOpen={setCropOpen}
          setValue={setSelectedCrop}
          placeholder="작물을 선택하세요"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
        {infoOptions.length > 0 && (
          <>
            <Text style={styles.label}>병충해/질병 선택</Text>
            <DropDownPicker
              open={infoOpen}
              value={selectedInfo}
              items={infoOptions.map((info: any) => ({
                label: `${info.type}: ${info.name} (${info.severity})`,
                value: info.name,
                key: info.id,
              }))}
              setOpen={setInfoOpen}
              setValue={setSelectedInfo}
              placeholder="병충해 또는 질병을 선택하세요"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </>
        )}
        <Text style={styles.label}>방제 시작 날짜</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />
        <Button title="입력 완료" onPress={handleApplySchedule} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  dropdown: {
    marginBottom: 20,
    borderColor: "#ccc",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  leftPanel: {
    flex: 1,
  },
  rightPanel: {
    flex: 1,
    marginTop: 20,
  },
});

export default CropCalendar;
