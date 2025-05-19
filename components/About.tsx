"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

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
            anticipatePin: 1,
            fastScrollEnd: true,
          },
          width: 0,
          stagger: 0.5,
          ease: "none",
        });

        return split;
      },
    });
  }, []);

  // Masked About section
  if (masked)
    return (
      <section className="overflow-hidden w-screen sm:px-12 md:px-24 lg:px-40 2xl:px-0 h-dvh bg-primary px-[1.3rem]">
        <div className="flex flex-col gap-7 justify-center items-start w-full h-full 2xl:items-center text-nowrap">
          <div className="flex flex-col gap-4 text-left text-black 2xl:gap-7">
            <h2>about me</h2>
            <p className="about-text text-about/[135%] md:leading-[125%] lg:leading-[115%] xl:leading-[102%] tracking-[-0.5%] font-extrabold 2xl:text-nowrap text-wrap">
              Your web developer who <br />
              codes with purpose – crafting fast, <br />
              effective solutions while relentlessly <br />
              pursuing excellence for your <br />
              business.
            </p>
          </div>
        </div>
      </section>
    );
  return (
    <section className="overflow-hidden w-screen sm:px-12 md:px-24 lg:px-40 2xl:px-0 h-dvh px-[1.3rem]">
      <div className="flex flex-col justify-center items-start w-full h-full 2xl:items-center text-nowrap">
        <div className="flex flex-col gap-4 text-left 2xl:gap-7">
          <h2>about me</h2>
          <div className="relative w-full">
            {/* Overlay */}
            <p
              ref={aboutTextOverlayRef}
              className="about-text max-w-[80rem] text-white text-about/[135%] md:leading-[125%] lg:leading-[115%] xl:leading-[102%] tracking-[-0.5%] font-extrabold text-wrap"
            >
              I&apos;m a <strong>skilled</strong> <strong>web</strong>{" "}
              <strong>developer</strong> that creates powerful digital
              solutions. Every obstacle overcome and every line of code created
              is a step closer to perfection.
            </p>
            {/* Text */}
            <p
              ref={aboutTextRef}
              className="about-text absolute top-0 max-w-[80rem] text-white text-about/[135%] md:leading-[125%] lg:leading-[115%] xl:leading-[102%] tracking-[-0.5%] font-extrabold text-wrap"
            >
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
