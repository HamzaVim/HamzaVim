"use client";
import { createContext, useContext, useRef, useState } from "react";

interface GlobalContextType {
  linkState: string;
  setLinkState: React.Dispatch<React.SetStateAction<string>>;
  linkStateRef: React.RefObject<string>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  initialLoading: boolean;
  setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>;
  pageChanged: boolean;
  setPageChanged: React.Dispatch<React.SetStateAction<boolean>>;
  screenResizing: boolean;
  setScreenResizing: React.Dispatch<React.SetStateAction<boolean>>;
  cursorHoverState: boolean | null;
  setCursorHoverState: React.Dispatch<React.SetStateAction<boolean | null>>;
  cursorHoverIn: () => void;
  cursorHoverOut: () => void;
  cursorHoverVanish: () => void;
}
// Create the context
const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

// Create a provider component
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  // State: link state to determine which section does the user see/goes
  const [linkState, setLinkState] = useState("home");
  const linkStateRef = useRef("home");

  // State: Loading state; First time the site is in loading state
  const [loading, setLoading] = useState(true);

  // State: Initial loading site, if the site is loaded fully (one time use)
  const [initialLoading, setInitialLoading] = useState(false);

  // State: If the page is changed to projects or resume
  const [pageChanged, setPageChanged] = useState(false);

  // State & Ref: Cursor hover state; null: size=0, false: size=30px, true: size=600~10000,
  // --------------
  const [cursorHoverState, setCursorHoverState] = useState<boolean | null>(
    null,
  );

  // Function: To increase the size of the cursor tracker
  const cursorHoverIn = () => {
    setCursorHoverState(true);
  };
  // Function: To decrease the size of the cursor tracker
  const cursorHoverOut = () => {
    setCursorHoverState(false);
  };
  // Function: To vanish the cursor tracker
  const cursorHoverVanish = () => {
    setCursorHoverState(null);
  };
  // --------------

  // State: If the screen is resizing set to true
  const [screenResizing, setScreenResizing] = useState(false);

  const value = {
    linkState,
    setLinkState,
    linkStateRef,
    loading,
    setLoading,
    initialLoading,
    setInitialLoading,
    pageChanged,
    setPageChanged,
    screenResizing,
    setScreenResizing,
    cursorHoverState,
    setCursorHoverState,
    cursorHoverIn,
    cursorHoverOut,
    cursorHoverVanish,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// Create a hook to use the context
export const useGlobal: () => GlobalContextType = () =>
  useContext(GlobalContext);
