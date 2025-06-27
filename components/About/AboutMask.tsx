import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import { useRef } from "react";

const AboutMask = () => {
  // NOTE: States & Refs: ---------------------------------------------------

  // Ref: About section text
  const aboutTextWhiteRef = useRef<HTMLParagraphElement>(null);

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Split text
  useGSAP(() => {
    // Split text
    SplitText.create(aboutTextWhiteRef.current, {
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
          height: () => {
            // Get height of overlay text (About.tsx)
            const aboutTextOverlay = gsap.utils.toArray(
              "#about .text-container > p .line",
            )[0] as HTMLSpanElement;

            // If overlay text doesn't exist return 0, usually the page is changing
            if (!aboutTextOverlay) return 0;

            const height = aboutTextOverlay.clientHeight;
            return height;
          },
        });
      },
    });
  });
  return (
    <div className="about">
      <div className="about-container">
        <div className="about-text-container">
          <h2>about me</h2>
          <div className="text-container">
            <p ref={aboutTextWhiteRef}>
              Your web developer who codes with purpose – crafting fast,
              effective solutions while relentlessly pursuing excellence for
              your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMask;
