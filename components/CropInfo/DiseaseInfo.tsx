// src/components/CropInfo/DiseaseInfo.tsx
import React from 'react';
import { View, Text } from 'react-native';
import sharedStyles from './infostyles';

const DiseaseInfo: React.FC<{ disease: { disease_name: string; symptoms: string; severity: string; pesticide: string } }> = ({ disease }) => (
  <View style={sharedStyles.infoBox}>
    <Text style={sharedStyles.label}>Disease Name:</Text>
    <Text style={sharedStyles.value}>{disease.disease_name}</Text>
    <Text style={sharedStyles.label}>Symptoms:</Text>
    <Text style={sharedStyles.value}>{disease.symptoms}</Text>
    <Text style={sharedStyles.label}>Severity:</Text>
    <Text style={sharedStyles.value}>{disease.severity}</Text>
    <Text style={sharedStyles.label}>Pesticide:</Text>
    <Text style={sharedStyles.value}>{disease.pesticide}</Text>
  </View>
);

export default DiseaseInfo;