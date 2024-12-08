// src/components/CropInfo/CropInfo.tsx
import React from 'react';
import { View, Text } from 'react-native';
import sharedStyles from './infostyles';

const CropInfo: React.FC<{ crop: { name: string; species: string; growth_stage: string } }> = ({ crop }) => (
  <View style={sharedStyles.infoBox}>
    <Text style={sharedStyles.label}>Crop Name:</Text>
    <Text style={sharedStyles.value}>{crop.name}</Text>
    <Text style={sharedStyles.label}>Species:</Text>
    <Text style={sharedStyles.value}>{crop.species}</Text>
    <Text style={sharedStyles.label}>Growth Stage:</Text>
    <Text style={sharedStyles.value}>{crop.growth_stage}</Text>
  </View>
);

export default CropInfo;
