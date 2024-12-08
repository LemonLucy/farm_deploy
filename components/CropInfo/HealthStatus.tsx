// src/components/CropInfo/HealthStatus.tsx
import React from 'react';
import { View, Text, } from 'react-native';
import sharedStyles from './infostyles';

const HealthStatus: React.FC<{ health: { overall_health: string; recommended_action: string } }> = ({ health }) => (
  <View style={sharedStyles.infoBox}>
    <Text style={sharedStyles.label}>Overall Health:</Text>
    <Text style={sharedStyles.value}>{health.overall_health}</Text>
    <Text style={sharedStyles.label}>Recommended Action:</Text>
    <Text style={sharedStyles.value}>{health.recommended_action}</Text>
  </View>
);

export default HealthStatus;
