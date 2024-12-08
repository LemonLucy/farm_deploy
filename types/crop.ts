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
      pest_count: number; // 추가된 속성
    };
    disease_information: {
      disease_name: string;
      symptoms: string;
      severity: string;
      pesticide: string;
      severity_score: number; // 추가된 속성
    };
    crop_health_information: {
      overall_health: string;
      recommended_action: string;
      overall_health_score: number;
    };
    timestamp: string;
    crop_id: string;
    image_url?: string; // Optional property
    healthColor?: string; // Optional property
  };
  