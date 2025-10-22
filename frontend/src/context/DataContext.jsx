import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [districtData, setDistrictData] = useState(null);
  const [districtList, setDistrictList] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    districtData,
    setDistrictData,
    districtList,
    setDistrictList,
    availableYears,
    setAvailableYears,
    loading,
    setLoading,
    error,
    setError,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
