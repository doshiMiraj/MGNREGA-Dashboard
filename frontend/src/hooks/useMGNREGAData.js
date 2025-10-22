import { useState, useEffect, useCallback } from "react";
import mgnregaService from "../services/mgnregaService";

export const useMGNREGAData = (districtCode, finYear) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!districtCode || !finYear) return;

    setLoading(true);
    setError(null);

    try {
      const result = await mgnregaService.getDistrictData(
        districtCode,
        finYear
      );
      setData(result.data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Error fetching MGNREGA data:", err);
    } finally {
      setLoading(false);
    }
  }, [districtCode, finYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useDistrictList = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const result = await mgnregaService.getDistrictList();
        setDistricts(result.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch districts");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  return { districts, loading, error };
};

export const useAvailableYears = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      setLoading(true);
      try {
        const result = await mgnregaService.getAvailableYears();
        setYears(result.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch years");
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  return { years, loading, error };
};

export const useDistrictStats = (districtCode, finYear) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!districtCode || !finYear) return;

    setLoading(true);
    setError(null);

    try {
      const result = await mgnregaService.getDistrictStats(
        districtCode,
        finYear
      );
      setStats(result.data);
    } catch (err) {
      setError(err.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  }, [districtCode, finYear]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};
