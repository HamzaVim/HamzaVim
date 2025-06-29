import { useGlobal } from "@/context/GlobalContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useCursorDetection from "./useCursorDetection";

/**
 * Tracks the cursor position
 */
const useCursortTracker = () => {
  // NOTE: States & Refs -------------------------------------------------------
  const { cursorHoverState } = useGlobal();

  // State: If the device has a cursor
  const hasCursor = useCursorDetection();

  // NOTE: Fuctions & Animations -------------------------------------------------------

  useGSAP(() => {
    // Request Animation Frame
    let rafId: number | null = null;

    /**
     * Updates the cursor tracker
     */
    const updateTracker = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // Only for mouse

      // Get the cursor position
      const x = e.clientX;
      const y = e.clientY;

      gsap.to(".masked", {
        "--mask-position-x": `${x}px`,
        "--mask-position-y": `${y}px`,
        duration: 1.25,
        ease: "expo.out",
      });
    };

    /**
     * Updates the cursor tracker
     * If `rafId` is null, it will update the tracker in the next frame to avoid lag
     */
    const handleMouseMove = (e: PointerEvent) => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateTracker(e);
          rafId = null;
        });
      }
    };

    // Tracking the cursor
    window.addEventListener("pointermove", handleMouseMove);

    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });

  // Animate the cursor tracker Size
  useGSAP(
    () => {
      if (!hasCursor) {
        // If the user has no cursor (mobile)

        if (cursorHoverState) {
          // On press
          gsap.to(".masked", {
            overwrite: true,
            "--size": "10000px",
            duration: 6,
            ease: "power2.out",
          });
        } else {
          // On release
          gsap.to(".masked", {
            overwrite: true,
            "--size": "0px",
            duration: 0.5,
            ease: "power3.out",
          });
        }
        return;
      }

      if (cursorHoverState !== null) {
        // If the cursor hover state is not null
        if (cursorHoverState) {
          // If the cursor hovers into an Element to reveal hidden content (increase size)
          gsap.to(".masked", {
            overwrite: true,
            "--size": "600px",
            duration: 0.7,
            ease: "power2.out",
          });
        } else {
          // If the cursor hovers out of an Element (reduce size)
          gsap.to(".masked", {
            overwrite: true,
            "--size": "40px",
            duration: 0.6,
            ease: "power2.out",
          });
        }
      } else {
        // If the cursor hover state is null, vanish the cursor tracker (0px size)
        gsap.to(".masked", {
          overwrite: true,
          "--size": "0px",
          duration: 0.3,
          ease: "power3.out",
        });
      }
    },
    { dependencies: [cursorHoverState] },
  );
};

export default useCursortTracker;
