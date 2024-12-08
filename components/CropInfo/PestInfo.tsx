// src/components/CropInfo/PestInfo.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import sharedStyles from './infostyles';

const PestInfo: React.FC<{ pest: { pest_name: string; severity: string; pesticide: string } }> = ({ pest }) => (
  <View style={sharedStyles.infoBox}>
    <Text style={sharedStyles.label}>Pest Name:</Text>
    <Text style={sharedStyles.value}>{pest.pest_name}</Text>
    <Text style={sharedStyles.label}>Severity:</Text>
    <Text style={sharedStyles.value}>{pest.severity}</Text>
    <Text style={sharedStyles.label}>Pesticide:</Text>
    <Text style={sharedStyles.value}>{pest.pesticide}</Text>
  </View>
);

export default PestInfo;
