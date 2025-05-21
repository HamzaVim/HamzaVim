"use client";
import { createContext, useContext, useState } from "react";

interface GlobalContextType {
  linkState: string;
  setLinkState: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  initialLoading: boolean;
  setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
// Create the context
const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

// Create a provider component
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  // State: link state to determine which section does the user see/goes
  const [linkState, setLinkState] = useState("home");

  // State: Loading state; First time the site is in loading state
  const [loading, setLoading] = useState(true);

  // State: Initial loading site, if the site is loaded fully (one time use)
  const [initialLoading, setInitialLoading] = useState(false);

  const value = {
    linkState,
    setLinkState,
    loading,
    setLoading,
    initialLoading,
    setInitialLoading,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// Create a hook to use the context
export const useGlobal: () => GlobalContextType = () =>
  useContext(GlobalContext);
