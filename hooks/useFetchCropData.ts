import { useState, useEffect } from "react";
  
export const useFetchCropData = (apiUrl: string) => {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch crop data");

        const data: CropData[] = await response.json();
        setCropData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, [apiUrl]);

  return { cropData, loading, error };
};
