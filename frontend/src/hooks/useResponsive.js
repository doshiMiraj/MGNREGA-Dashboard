import { useState, useEffect } from "react";

/**
 * Hook to detect screen size and return responsive values
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  const isSmallMobile = windowSize.width < 480;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    width: windowSize.width,
    height: windowSize.height,
  };
};

export default useResponsive;
