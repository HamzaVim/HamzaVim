"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";

// Masked version
const AboutMasked = ({
  aboutTextRef,
}: {
  aboutTextRef: React.RefObject<HTMLParagraphElement | null>;
}) => (
  <div className="about">
    <div className="about-container">
      <div className="about-text-container">
        <h2>about me</h2>
        <div className="text-container">
          <p ref={aboutTextRef}>
            Your web developer who codes with purpose – crafting fast, effective
            solutions while relentlessly pursuing excellence for your business.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const About = ({ masked }: { masked?: boolean }) => {
  gsap.registerPlugin([ScrollTrigger, SplitText]);

  // NOTE: States & Refs: ---------------------------------------------------

  // Ref: overlay text
  const aboutTextOverlayRef = useRef<HTMLParagraphElement>(null);

  // Ref: text
  const aboutTextRef = useRef<HTMLParagraphElement>(null);

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Text reveal animation
  useGSAP(() => {
    if (masked) {
      // Split text
      SplitText.create(aboutTextRef.current, {
        type: "lines,words",
        tag: "span",
        linesClass: "line",
        wordsClass: "word",
        autoSplit: true,
        onSplit: (text) => {
          // Set initial style for every line
          const split = gsap.set(text.lines, {
            overflow: "hidden",
            display: "block",
            textWrap: "nowrap",
            height: (i, line) => {
              return line.offsetHeight - 3;
            },
          });
          return split;
        },
      });

      return;
    }

    // Split overlay text
    SplitText.create(aboutTextOverlayRef.current, {
      type: "lines,words",
      tag: "span",
      linesClass: "line",
      wordsClass: "word",
      autoSplit: true,
      onSplit: (text) => {
        // Set initial style for overlay text
        const split = gsap.set(text.lines, {
          overflow: "hidden",
          display: "block",
          textWrap: "nowrap",
          opacity: 0.2,
          height: (i, line) => {
            return line.offsetHeight - 3;
          },
        });

        return split;
      },
    });

    // Split text
    SplitText.create(aboutTextRef.current, {
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

        // Animation for every line
        const split = gsap.from(text.lines, {
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

        return split;
      },
    });

    ScrollTrigger.normalizeScroll(true); // Helps with touch devices
  }, []);

  // Set about text height for the masked section, because the masked text is shorter
  useEffect(() => {
    const aboutTextHeight = gsap.utils.toArray(
      ".about-text-container",
    ) as HTMLDivElement[];

    const setAboutTextHeight = () => {
      gsap.set(aboutTextHeight[1], {
        height: aboutTextHeight[0].offsetHeight,
        width: aboutTextHeight[0].offsetWidth,
      });
    };

    setAboutTextHeight();
  }, []);

  // Masked About section
  if (masked) return <AboutMasked aboutTextRef={aboutTextRef} />;

  return (
    <section id="about">
      <div className="about-container">
        <div className="about-text-container">
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
