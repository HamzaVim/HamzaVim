"use client";
import About from "@/components/About";
import Hero from "@/components/Hero";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import gsap from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";

export default function Page() {
  // NOTE: States & Refs -------------------------------------------------------

  // Status: Loading animation
  const [loadingAnimation, setLoadingAnimation] = useState(true);

  const { loading, setLoading, initialLoading, setInitialLoading } =
    useGlobal();

  // Status: Digit animation (counter)
  const digitContainerRef = useRef<HTMLDivElement>(null);
  const digit1Ref = useRef<HTMLDivElement>(null);
  const digit2Ref = useRef<HTMLDivElement>(null);
  const digit3Ref = useRef<HTMLDivElement>(null);
  const [digitRepeat, setDigitRepeat] = useState(0);

  // GSAP: ContextSafe for functions outside useGSAP
  const { contextSafe } = useGSAP();

  // NOTE: Functions & Animations ---------------------------------------------------

  // Making all the focusable elements not focusable until the site is loaded
  useGSAP(
    () => {
      // If the site is not loaded
      if (!initialLoading) {
        gsap.set(
          "body>*:not(div) button, body>*:not(div) a, body>*:not(div) input",
          {
            tabIndex: -1,
          },
        );
        return;
      }

      // If the site is loaded
      gsap.set(
        "body>*:not(div) button, body>*:not(div) a, body>*:not(div) input",
        {
          tabIndex: 0,
        },
      );
      // Set the overflow to auto
      gsap.set("body", {
        overflow: "auto",
      });
    },
    { dependencies: [initialLoading] },
  );

  // Initial digit animation: Setting the refs
  useGSAP(() => {
    digitContainerRef.current = gsap.utils.toArray(
      ".digit-container",
    )[0] as HTMLDivElement;
    digit1Ref.current = digitContainerRef.current.children[0] as HTMLDivElement;
    digit2Ref.current = digitContainerRef.current.children[1] as HTMLDivElement;
    digit3Ref.current = digitContainerRef.current.children[2] as HTMLDivElement;
  });

  // Counter: Digit animation
  useGSAP(
    () => {
      // Repeat 8 times
      if (digitRepeat === 9) return;

      // Before the counter starts, animate the container of the digits to the top
      if (digitRepeat === 0) {
        gsap.to(digitContainerRef.current, {
          translateY: "0%",
          duration: 0.5,
        });
      }

      // NOTE: If the `digitRepeat` is 0 and the `loading` is true, it means the site is in loading state
      // So delay the animation by 1 seconds or 0 if the site is not in loading state (loaded)
      // And the duration is 1.1 if the site is in loading state, 0.1 if the site is not in loading state

      // Animate the third digit
      gsap
        .timeline({
          delay: digitRepeat == 0 && loading ? 1 : 0,
        })
        .to(digit3Ref.current, {
          overwrite: true,
          yPercent: -91,
          duration: loading ? 1.1 : 0.1,
          ease: "none",
        })
        .set(digit3Ref.current, {
          yPercent: digitRepeat !== 8 ? 0 : -91,
        });

      // Animate the second digit
      gsap
        .timeline({
          delay: digitRepeat == 0 && loading ? 1 : 0,
        })
        .set(digit2Ref.current, {
          yPercent: -digitRepeat * 10.111111111,
        })
        .to(digit2Ref.current, {
          overwrite: true,
          yPercent: -(digitRepeat + 1) * 10.111111111,
          duration: loading ? 1.1 : 0.1,
          ease: "none",
          onComplete: () => {
            setDigitRepeat((prev) => prev + 1);
          },
        });

      // Animate the first digit: If the `digitRepeat` is 8, 0 === 1, then 8 === 9, which means the counter is 90.
      if (digitRepeat !== 8) return;
      gsap.timeline().to(digit1Ref.current, {
        overwrite: true,
        yPercent: -50,
        duration: loading ? 1.1 : 0.1,
        ease: "none",
      });
    },
    { dependencies: [digitRepeat, loading] },
  );

  // Check if the page is loaded
  useLayoutEffect(() => {
    // create a timeout variable
    let timeout: NodeJS.Timeout;

    // A function to handle the load event
    const handleLoad = () => {
      // Check if the counter is finished; `loadingAnimation` is false
      if (!loadingAnimation) {
        setLoading(false);
        return;
      }

      // Set the timeout to 3 seconds and set the loading state to false
      timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);
    };

    // Check if the page is already loaded
    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      // Add the load event listener
      window.addEventListener("load", handleLoad);
    }

    // Clean up the event listener & timeout
    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  // Loading animation
  useGSAP(
    () => {
      const loadingCircle = gsap.utils.toArray(
        ".loading-circle",
      )[0] as HTMLElement;

      gsap.timeline().to(loadingCircle, {
        overwrite: true,
        delay: loading ? 1 : 0,
        "--progress": "100%",
        duration: loading ? 10 : 0.7,
        ease: "none",
        onComplete: () => {
          setLoadingAnimation(false);
        },
      });
    },
    { dependencies: [loading] },
  );
  // After finishing loading
  useGSAP(
    () => {
      if (loading || loadingAnimation || !digitContainerRef.current) return;

      // Get the loading circle
      const loadingCircle = gsap.utils.toArray(
        ".loading-circle",
      )[0] as HTMLElement;

      // Animate the loading circle
      gsap
        .timeline()
        .set(loadingCircle, {
          "--progress": "0%",
          background: "conic-gradient(#111313 var(--progress), #cffcec 0%)",
        })
        .to(loadingCircle, {
          "--progress": "100%",
          duration: 1,
          ease: "none",
        })
        // Animate the digit container
        .to(digitContainerRef.current, {
          yPercent: -10,
          duration: 0.5,
        })
        // Animate the start button
        .set("#start-btn", {
          position: "relative",
        })
        .set("#mask-load-btn rect", {
          scaleY: 0,
        })
        .from("#start-btn", {
          height: 0,
          marginTop: 0,
        })
        .set("#start-btn", {
          visibility: "visible",
        })
        .to("#mask-load-btn rect", {
          scaleY: 1,
        });
    },
    { dependencies: [loading, loadingAnimation] },
  );

  // Animate when the start button is clicked
  const handleStartBtn = contextSafe(() => {
    gsap
      .timeline()
      // Animate the start button corners
      .set("#start-btn .corners-container", {
        display: "none",
      })
      // Animate the start button
      .to("#mask-load-btn rect", {
        scaleY: 0,
      })
      .to("#start-btn", {
        height: 0,
        marginTop: 0,
      })
      .set("#start-btn", {
        visibility: "hidden",
      })
      // Animate the loading screen
      .to("#mask-load-black-screen rect:nth-child(1)", {
        attr: {
          y: "-55%",
        },
        duration: 0.5,
      })
      .to(
        "#mask-load-black-screen rect:nth-child(2)",
        {
          attr: {
            y: "105%",
          },
          duration: 0.5,
        },
        "<",
      )
      .to(
        "#mask-load-white-screen rect:nth-child(1)",
        {
          attr: {
            y: "-55%",
          },
          duration: 0.5,
        },
        "-=50%",
      )
      .to(
        "#mask-load-white-screen rect:nth-child(2)",
        {
          attr: {
            y: "105%",
          },
          duration: 0.5,
        },
        "<",
      )
      .set("#loading-screen", {
        display: "none",
        onComplete: () => {
          setInitialLoading(true);
        },
      });
  });

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <WhyMe />
        <Contact />
      </main>

      {/* Loading screen */}
      <div id="loading-screen">
        <div id="black-screen">
          <div className="center-overlay">
            <div className="counter">
              <div className="digit-container">
                <div className="digit-1">
                  <div>0</div>
                  <div>1</div>
                </div>
                <div className="digit-2">
                  <div>0</div>
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                  <div>9</div>
                  <div>0</div>
                </div>
                <div className="digit-3">
                  <div>0</div>
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                  <div>9</div>
                  <div>0</div>
                </div>
                <span>%</span>
              </div>
            </div>
            <div className="logo-container">
              <Logo className="logo" />
              <button id="start-btn" onClick={handleStartBtn} className="group">
                <div className="corners-container">
                  <div className="corner" />
                  <div className="corner" />
                  <div className="corner" />
                  <div className="corner" />
                </div>
                <div className="masked-btn">
                  <span>start</span>
                  <svg>
                    <mask id="mask-load-btn">
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="white"
                      />
                    </mask>
                  </svg>
                </div>
              </button>
            </div>
            <div className="loading-circle">
              <div className="black-circle" />
            </div>
          </div>

          {/* Mask */}
          <svg className="absolute top-0 left-0 w-full h-full -z-10">
            <mask id="mask-load-black-screen">
              <rect x="0" y="0%" width="100%" height="51%" fill="white" />
              <rect x="0" y="50%" width="100%" height="51%" fill="white" />
            </mask>
          </svg>
        </div>

        <div id="white-screen">
          <Logo className="logo" />

          {/* Mask */}
          <svg>
            <mask id="mask-load-white-screen">
              <rect x="0" y="0%" width="100%" height="51%" fill="white" />
              <rect x="0" y="50%" width="100%" height="51%" fill="white" />
            </mask>
          </svg>
        </div>
      </div>
    </>
  );
}
