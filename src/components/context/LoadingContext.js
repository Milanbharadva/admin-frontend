import React, { createContext, useContext, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

// Create a context to manage loading state
const LoadingBarContext = createContext();

// Provider component to manage loading state
export const LoadingBarProvider = ({ children }) => {
  const loadingBarRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Start the loading bar
  const startLoading = () => {
    setLoading(true);
    loadingBarRef.current.continuousStart();
  };

  // Stop the loading bar
  const stopLoading = () => {
    setLoading(false);
    loadingBarRef.current.complete();
  };

  return (
    <LoadingBarContext.Provider value={{ startLoading, stopLoading }}>
      <LoadingBar color="#0d6efd" ref={loadingBarRef} />
      {children}
    </LoadingBarContext.Provider>
  );
};

// Custom hook to access loading context
export const useLoadingBar = () => useContext(LoadingBarContext);
