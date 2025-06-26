import { useEffect, useMemo, useRef } from "react";
import { useGlobal } from "@/context/GlobalContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const useResizeUpdater = () => {
  // NOTE: States & Refs -------------------------------------------------------
  const { contextSafe } = useGSAP();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { screenResizing, setScreenResizing } = useGlobal();

  const screenResizingRef = useRef(screenResizing);

  // NOTE: Functions & Animations -------------------------------------------------------

  // Update the `screenResizingRef`
  useEffect(() => {
    screenResizingRef.current = screenResizing;
  }, [screenResizing]);

  /**
   * Handles screen resize events with a visual transition effect:
   *
   * 1. Transition Sequence:
   *    - Immediately hides content (sets opacity to 0)
   *    - Locks scrolling during transition
   *    - After 500ms debounce:
   *      a. For mobile devices: Repositions masked element to button location
   *      b. Restores screen visibility with smooth fade-in
   *      c. Re-enables scrolling
   *
   * 2. Mobile-Specific Behavior:
   *    - Resets mask position to overlay press button (50vw, 90.5vh)
   *    - Collapses mask size during transition
   *
   * 3. Performance Safeguards:
   *    - Debounces resize events to prevent thrashing
   *    - Uses ref to track resize state and prevent duplicate triggers
   *    - Cleans up pending timeouts
   */
  const handleResize = useMemo(
    () =>
      contextSafe(() => {
        // Clear any pending resize handlers
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // First phase: initiate transition
        if (!screenResizingRef.current) {
          setScreenResizing(true);
          gsap.set("body", {
            opacity: 0,
            overflow: "hidden", // Prevent scrolling during transition
          });
        }

        // Second phase: complete transition after delay
        timeoutRef.current = setTimeout(() => {
          setScreenResizing(false);

          // Resetting the masked position if it's mobile
          const masked = gsap.utils.toArray(".masked")[0] as HTMLDivElement;

          // Mobile-specific mask repositioning
          if (masked.classList.contains("mobile")) {
            gsap.set(".masked", {
              "--mask-position-x": "50vw",
              "--mask-position-y": "90.5vh",
              "--size": "0px",
            });
          }

          // Restore visibility
          gsap.to("body", {
            opacity: 1,
            overflow: "auto", // Re-enable scrolling
            duration: 0.5,
            ease: "power2.in",
          });
        }, 500); // 500ms debounce period
      }),
    [contextSafe, setScreenResizing],
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.set("body", { opacity: 1, overflow: "auto" });

      // Clear any pending operations in the handler
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [handleResize]);
};

export default useResizeUpdater;
