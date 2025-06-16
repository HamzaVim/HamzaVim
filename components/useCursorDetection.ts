import { useState, useEffect } from "react";

/**
 * Detects if the user has a cursor (mouse or touch device)
 * @returns hasCursor: false: no cursor, true: has cursor
 */
const useCursorDetection = () => {
  // State: If the user has a cursor
  const [hasCursor, setHasCursor] = useState(false);

  useEffect(() => {
    // Check if the user has a cursor
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasCursor(mediaQuery.matches);

    /**
     * A listener to check if the user has a cursor
     */
    const handler = (e: MediaQueryListEvent) => setHasCursor(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return hasCursor;
};

export default useCursorDetection;
