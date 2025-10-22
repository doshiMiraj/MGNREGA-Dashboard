import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

// Comprehensive Translation strings
const translations = {
  en: {
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    compare: "Compare",
    trends: "Trends",

    // Common
    select: "Select",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    viewDashboard: "View Dashboard",
    getStarted: "Get Started",
    learnMore: "Learn More",
    explore: "Explore",

    // Dashboard
    districtDashboard: "District Dashboard",
    selectDistrict: "Select District",
    selectYear: "Financial Year",
    selectDistrictAndYear: "Select District and Year",
    chooseDistrict: "Choose a district",
    pleaseSelectDistrict: "Please select a district to view the dashboard",
    loadingDashboard: "Loading dashboard data...",
    failedToLoad: "Failed to load dashboard data",

    // Metrics
    householdsWorked: "Households Worked",
    totalExpenditure: "Total Expenditure",
    avgWageRate: "Average Wage Rate",
    worksCompleted: "Works Completed",
    totalBeneficiaries: "Total beneficiaries",
    inLakhs: "In lakhs",
    perDayPerPerson: "Per day per person",
    projectsFinished: "Projects finished",

    // Performance
    performanceScore: "Performance Score",
    overallPerformance: "Overall Performance",
    employment: "Employment",
    wageRate: "Wage Rate",
    timeliness: "Timeliness",
    workCompletion: "Work Completion",
    womenParticipation: "Women Participation",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    belowAverage: "Below Average",
    poor: "Poor",

    // Charts
    employmentTrends: "Employment Trends",
    monthlyEmployment: "Monthly household and individual employment",
    households: "Households",
    individuals: "Individuals",
    demographicsBreakdown: "Demographics Breakdown",
    persondaysDistribution: "Persondays distribution by category",
    women: "Women",
    sc: "SC",
    st: "ST",
    general: "General",

    // Key Metrics
    keyMetrics: "Key Metrics",
    avgEmploymentDays: "Avg. Employment Days",
    workCompletionRate: "Work Completion Rate",
    days: "days",

    // Comparison
    compareDistricts: "Compare Districts",
    selectDistrictsToCompare: "Select Districts to Compare",
    chooseMultipleDistricts: "Choose 2-5 districts for side-by-side comparison",
    selectDistrictsMax5: "Select Districts (max 5)",
    districtsSelected: "districts selected",
    districtSelected: "district selected",
    compareButton: "Compare",
    comparingDistricts: "Comparing districts...",
    bestPerformer: "Best Performer",
    score: "Score",
    vsStateAverage: "vs State Average",
    district: "District",
    stateAvg: "State Avg",
    aboveAverage: "above average",
    metric: "Metric",
    selectToStartComparing: "Select districts to start comparing",
    selectDistrictsAndCompare:
      "Choose 2-5 districts and click Compare to see side-by-side analysis",

    // Historical
    historicalTrends: "Historical Trends",
    selectDistrictForTrends: "Select District",
    viewYearOverYear: "View year-over-year performance trends",
    viewTrends: "View Trends",
    loadingHistorical: "Loading historical data...",
    showingDataForYears: "Showing data for",
    financialYears: "financial years",
    yearOverYearChanges: "Year-over-Year Changes",
    householdsWorkedOverYears: "Households Worked Over Years",
    expenditureOverYears: "Total Expenditure Over Years",
    completedWorksOverYears: "Completed Works Over Years",
    avgWageRateOverYears: "Average Wage Rate Over Years",
    selectDistrictToView: "Select a district to view trends",
    chooseDistrictAndView:
      "Choose a district and click View Trends to see historical performance data",

    // Home Page
    appName: "MGNREGA Dashboard",
    tagline: "Track Rural Employment Progress",
    heroDescription:
      "Access comprehensive data and insights about MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance across Uttar Pradesh districts.",
    features: "Features",
    districtDashboardTitle: "District Dashboard",
    districtDashboardDesc:
      "View comprehensive MGNREGA data for your district with performance metrics and key statistics.",
    compareDistrictsTitle: "Compare Districts",
    compareDistrictsDesc:
      "Compare multiple districts side-by-side and see how your district performs against others.",
    historicalTrendsTitle: "Historical Trends",
    historicalTrendsDesc:
      "Analyze trends over time and track the progress of MGNREGA implementation in your district.",
    aboutMGNREGA: "About MGNREGA",
    mgnregaDescription1:
      "The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is one of the largest social security schemes in the world. It guarantees 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.",
    mgnregaDescription2:
      "This dashboard helps citizens, administrators, and policymakers track the implementation and impact of MGNREGA across districts in Uttar Pradesh, promoting transparency and accountability.",
    learnMoreAboutMGNREGA: "Learn More About MGNREGA",
    selectYourDistrict: "Select Your District",
    selectDistrictDescription:
      "Get started by selecting your district to view detailed MGNREGA performance data and insights.",

    // Footer
    allRightsReserved: "All rights reserved",
    mgnregaOfficial: "MGNREGA Official",
    dataSource: "Data Source",
    dataProvidedBy:
      "Data provided by Ministry of Rural Development, Government of India",

    // 404
    pageNotFound: "Page Not Found",
    pageNotFoundDesc:
      "The page you are looking for doesn't exist or has been moved.",
    goToHome: "Go to Home",

    // Misc
    noDataAvailable: "No data available",
    noDataForSelection: "No data available for the selected district and year",
    vsLastYear: "vs last year",
    persondays: "Persondays",
    percentage: "Percentage",
  },
  hi: {
    // Navigation
    home: "होम",
    dashboard: "डैशबोर्ड",
    compare: "तुलना करें",
    trends: "रुझान",

    // Common
    select: "चुनें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    retry: "पुनः प्रयास करें",
    viewDashboard: "डैशबोर्ड देखें",
    getStarted: "शुरू करें",
    learnMore: "और जानें",
    explore: "खोजें",

    // Dashboard
    districtDashboard: "जिला डैशबोर्ड",
    selectDistrict: "जिला चुनें",
    selectYear: "वित्तीय वर्ष",
    selectDistrictAndYear: "जिला और वर्ष चुनें",
    chooseDistrict: "एक जिला चुनें",
    pleaseSelectDistrict: "डैशबोर्ड देखने के लिए कृपया एक जिला चुनें",
    loadingDashboard: "डैशबोर्ड डेटा लोड हो रहा है...",
    failedToLoad: "डैशबोर्ड डेटा लोड करने में विफल",

    // Metrics
    householdsWorked: "कार्यरत परिवार",
    totalExpenditure: "कुल व्यय",
    avgWageRate: "औसत मजदूरी दर",
    worksCompleted: "पूर्ण कार्य",
    totalBeneficiaries: "कुल लाभार्थी",
    inLakhs: "लाख में",
    perDayPerPerson: "प्रति दिन प्रति व्यक्ति",
    projectsFinished: "समाप्त परियोजनाएं",

    // Performance
    performanceScore: "प्रदर्शन स्कोर",
    overallPerformance: "समग्र प्रदर्शन",
    employment: "रोजगार",
    wageRate: "मजदूरी दर",
    timeliness: "समयबद्धता",
    workCompletion: "कार्य पूर्णता",
    womenParticipation: "महिला भागीदारी",
    excellent: "उत्कृष्ट",
    good: "अच्छा",
    average: "औसत",
    belowAverage: "औसत से कम",
    poor: "खराब",

    // Charts
    employmentTrends: "रोजगार रुझान",
    monthlyEmployment: "मासिक परिवार और व्यक्तिगत रोजगार",
    households: "परिवार",
    individuals: "व्यक्ति",
    demographicsBreakdown: "जनसांख्यिकी विवरण",
    persondaysDistribution: "श्रेणी के अनुसार व्यक्ति-दिवस वितरण",
    women: "महिला",
    sc: "अनुसूचित जाति",
    st: "अनुसूचित जनजाति",
    general: "सामान्य",

    // Key Metrics
    keyMetrics: "मुख्य मीट्रिक",
    avgEmploymentDays: "औसत रोजगार दिवस",
    workCompletionRate: "कार्य पूर्णता दर",
    days: "दिन",

    // Comparison
    compareDistricts: "जिलों की तुलना करें",
    selectDistrictsToCompare: "तुलना के लिए जिले चुनें",
    chooseMultipleDistricts: "तुलना के लिए 2-5 जिले चुनें",
    selectDistrictsMax5: "जिले चुनें (अधिकतम 5)",
    districtsSelected: "जिले चुने गए",
    districtSelected: "जिला चुना गया",
    compareButton: "तुलना करें",
    comparingDistricts: "जिलों की तुलना हो रही है...",
    bestPerformer: "सर्वश्रेष्ठ प्रदर्शन",
    score: "स्कोर",
    vsStateAverage: "राज्य औसत से",
    district: "जिला",
    stateAvg: "राज्य औसत",
    aboveAverage: "औसत से ऊपर",
    metric: "मीट्रिक",
    selectToStartComparing: "तुलना शुरू करने के लिए जिले चुनें",
    selectDistrictsAndCompare:
      "2-5 जिले चुनें और साथ-साथ विश्लेषण देखने के लिए तुलना करें पर क्लिक करें",

    // Historical
    historicalTrends: "ऐतिहासिक रुझान",
    selectDistrictForTrends: "जिला चुनें",
    viewYearOverYear: "वर्ष-दर-वर्ष प्रदर्शन रुझान देखें",
    viewTrends: "रुझान देखें",
    loadingHistorical: "ऐतिहासिक डेटा लोड हो रहा है...",
    showingDataForYears: "डेटा दिखाया जा रहा है",
    financialYears: "वित्तीय वर्षों के लिए",
    yearOverYearChanges: "वर्ष-दर-वर्ष परिवर्तन",
    householdsWorkedOverYears: "वर्षों में कार्यरत परिवार",
    expenditureOverYears: "वर्षों में कुल व्यय",
    completedWorksOverYears: "वर्षों में पूर्ण कार्य",
    avgWageRateOverYears: "वर्षों में औसत मजदूरी दर",
    selectDistrictToView: "रुझान देखने के लिए एक जिला चुनें",
    chooseDistrictAndView:
      "एक जिला चुनें और ऐतिहासिक प्रदर्शन डेटा देखने के लिए रुझान देखें पर क्लिक करें",

    // Home Page
    appName: "मनरेगा डैशबोर्ड",
    tagline: "ग्रामीण रोजगार की प्रगति ट्रैक करें",
    heroDescription:
      "उत्तर प्रदेश के जिलों में मनरेगा (महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम) के प्रदर्शन के बारे में व्यापक डेटा और अंतर्दृष्टि प्राप्त करें।",
    features: "सुविधाएं",
    districtDashboardTitle: "जिला डैशबोर्ड",
    districtDashboardDesc:
      "प्रदर्शन मेट्रिक्स और प्रमुख आंकड़ों के साथ अपने जिले के लिए व्यापक मनरेगा डेटा देखें।",
    compareDistrictsTitle: "जिलों की तुलना करें",
    compareDistrictsDesc:
      "कई जिलों की तुलना करें और देखें कि आपका जिला दूसरों की तुलना में कैसा प्रदर्शन करता है।",
    historicalTrendsTitle: "ऐतिहासिक रुझान",
    historicalTrendsDesc:
      "समय के साथ रुझानों का विश्लेषण करें और अपने जिले में मनरेगा कार्यान्वयन की प्रगति को ट्रैक करें।",
    aboutMGNREGA: "मनरेगा के बारे में",
    mgnregaDescription1:
      "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा) दुनिया की सबसे बड़ी सामाजिक सुरक्षा योजनाओं में से एक है। यह प्रत्येक ग्रामीण परिवार को एक वित्तीय वर्ष में 100 दिनों के मजदूरी रोजगार की गारंटी देता है।",
    mgnregaDescription2:
      "यह डैशबोर्ड नागरिकों, प्रशासकों और नीति निर्माताओं को उत्तर प्रदेश के जिलों में मनरेगा के कार्यान्वयन और प्रभाव को ट्रैक करने में मदद करता है।",
    learnMoreAboutMGNREGA: "मनरेगा के बारे में और जानें",
    selectYourDistrict: "अपना जिला चुनें",
    selectDistrictDescription:
      "विस्तृत मनरेगा प्रदर्शन डेटा और अंतर्दृष्टि देखने के लिए अपना जिला चुनकर शुरू करें।",

    // Footer
    allRightsReserved: "सर्वाधिकार सुरक्षित",
    mgnregaOfficial: "मनरेगा आधिकारिक",
    dataSource: "डेटा स्रोत",
    dataProvidedBy:
      "ग्रामीण विकास मंत्रालय, भारत सरकार द्वारा प्रदान किया गया डेटा",

    // 404
    pageNotFound: "पृष्ठ नहीं मिला",
    pageNotFoundDesc:
      "आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दिया गया है।",
    goToHome: "होम पर जाएं",

    // Misc
    noDataAvailable: "कोई डेटा उपलब्ध नहीं",
    noDataForSelection: "चयनित जिले और वर्ष के लिए कोई डेटा उपलब्ध नहीं",
    vsLastYear: "पिछले वर्ष से",
    persondays: "व्यक्ति-दिवस",
    percentage: "प्रतिशत",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  const changeLanguage = (lang) => {
    if (lang === "en" || lang === "hi") {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    toggleLanguage,
    changeLanguage,
    t,
    isHindi: language === "hi",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
