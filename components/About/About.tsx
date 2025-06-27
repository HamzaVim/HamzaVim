"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import { useRef } from "react";

const About = () => {
  // NOTE: States & Refs: ---------------------------------------------------

  // Ref: About section text
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const aboutTextOverlayRef = useRef<HTMLParagraphElement>(null);

  // Ref: split text
  const aboutTextSplitRef = useRef<SplitText>(null);
  const aboutTextOverlaySplitRef = useRef<SplitText>(null);

  const { cursorHoverIn, cursorHoverOut, screenResizing } = useGlobal();

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Split text
  useGSAP(
    () => {
      if (screenResizing) return; // Skip if screen is resizing

      // Revert the split text if it is already split
      if (aboutTextSplitRef.current?.isSplit) {
        aboutTextSplitRef.current.revert();
        aboutTextOverlaySplitRef.current?.revert();

        // Cleanup
        aboutTextSplitRef.current = null;
        aboutTextOverlaySplitRef.current = null;
      }

      // Split overlay text
      aboutTextOverlaySplitRef.current = new SplitText(
        aboutTextOverlayRef.current,
        {
          type: "lines,words",
          tag: "span",
          linesClass: "line",
          wordsClass: "word",
          autoSplit: true,
          onSplit: (text) => {
            // Set initial style for overlay text
            gsap.set(text.lines, {
              overflow: "hidden",
              display: "block",
              textWrap: "nowrap",
              opacity: 0.2,
              height: (i, line) => {
                return line.offsetHeight - 3;
              },

              onComplete: () => {
                if (!aboutTextOverlayRef.current) return;

                // Set height and width from overlay text to white page text (AboutWhite.tsx)
                const aboutTextWhiteRef = gsap.utils.toArray(
                  ".about .text-container > p",
                )[0] as HTMLParagraphElement;

                aboutTextWhiteRef.style.height = `${aboutTextOverlayRef.current.offsetHeight}px`;
                aboutTextWhiteRef.style.width = `${aboutTextOverlayRef.current.offsetWidth}px`;
              },
            });
          },
        },
      );

      // Split text
      aboutTextSplitRef.current = new SplitText(aboutTextRef.current, {
        type: "lines,words",
        tag: "span",
        linesClass: "line",
        wordsClass: "word",
        autoSplit: true,
        onSplit: (text) => {
          // Set initial style for every line
          gsap.set(text.lines, {
            overflow: "hidden",
            display: "block",
            textWrap: "nowrap",
            height: (i, line) => {
              return line.offsetHeight - 3;
            },
          });

          // Animation for every line - Text reveal animation
          gsap.from(text.lines, {
            scrollTrigger: {
              trigger: text.lines,
              start: "top 95%",
              end: "top 25%",
              scrub: true,
              fastScrollEnd: true,
            },
            width: 0,
            stagger: 0.5,
            ease: "none",
            willChange: "width", // Hint to browser for optimization
          });
        },
      });
    },
    { dependencies: [screenResizing] },
  );

  return (
    <section id="about">
      <div className="about-container">
        <div
          onMouseEnter={cursorHoverIn}
          onMouseLeave={cursorHoverOut}
          className="about-text-container"
        >
          <h2>about me</h2>
          <div className="text-container">
            {/* Overlay */}
            <p ref={aboutTextOverlayRef}>
              I&apos;m a <strong>skilled</strong> <strong>web</strong>{" "}
              <strong>developer</strong> that creates powerful digital
              solutions. Every obstacle overcome and every line of code created
              is a step closer to perfection.
            </p>
            {/* Text */}
            <p ref={aboutTextRef}>
              I&apos;m a <strong>skilled</strong> <strong>web</strong>{" "}
              <strong>developer</strong> that creates powerful digital
              solutions. Every obstacle overcome and every line of code created
              is a step closer to perfection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
