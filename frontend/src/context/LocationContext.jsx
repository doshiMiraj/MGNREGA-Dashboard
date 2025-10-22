import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedFinYear, setSelectedFinYear] = useState(
    import.meta.env.REACT_APP_DEFAULT_FIN_YEAR || "2024-2025"
  );
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationDetected, setIsLocationDetected] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDistrict = localStorage.getItem("selectedDistrict");
    const savedFinYear = localStorage.getItem("selectedFinYear");

    if (savedDistrict) {
      setSelectedDistrict(JSON.parse(savedDistrict));
    }
    if (savedFinYear) {
      setSelectedFinYear(savedFinYear);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem(
        "selectedDistrict",
        JSON.stringify(selectedDistrict)
      );
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedFinYear) {
      localStorage.setItem("selectedFinYear", selectedFinYear);
    }
  }, [selectedFinYear]);

  const selectDistrict = (district) => {
    setSelectedDistrict(district);
  };

  const selectFinYear = (year) => {
    setSelectedFinYear(year);
  };

  const clearSelection = () => {
    setSelectedDistrict(null);
    localStorage.removeItem("selectedDistrict");
  };

  const setDetectedLocation = (location) => {
    setUserLocation(location);
    setIsLocationDetected(true);
  };

  const value = {
    selectedDistrict,
    selectedFinYear,
    userLocation,
    isLocationDetected,
    selectDistrict,
    selectFinYear,
    clearSelection,
    setDetectedLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
