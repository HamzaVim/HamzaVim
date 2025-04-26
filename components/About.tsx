"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import SplitType from "split-type";

const About = ({ masked }: { masked?: boolean }) => {
  gsap.registerPlugin(ScrollTrigger);

  // NOTE: States & Refs: ---------------------------------------------------
  const aboutTextRef = useRef<HTMLParagraphElement>(null);

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Text opacity animation
  useGSAP(() => {
    if (aboutTextRef.current) {
      // Replace <br> with <br data-split-preserve> to preserve line breaks
      const text = aboutTextRef.current.innerHTML;
      aboutTextRef.current.innerHTML = text.replace(
        /<br>/g,
        "<br data-split-preserve>",
      );

      // Create split text
      const aboutText = SplitType.create(aboutTextRef.current, {
        types: "words,chars",
        tagName: "span",
      });

      // Animation
      gsap.from(aboutText.chars, {
        scrollTrigger: {
          trigger: aboutTextRef.current,
          start: "top 100%",
          end: "top 35%",
          scrub: true,
        },
        opacity: 0.2,
        stagger: 0.1,
      });
    }
  });
  // Masked About section
  if (masked)
    return (
      <section className="w-screen h-dvh bg-(--secondary) px-[1.3rem] sm:px-12 md:px-24 lg:px-40 2xl:px-0 overflow-hidden">
        <div className="w-full h-full text-nowrap flex flex-col items-start 2xl:items-center justify-center gap-7">
          <div className="text-left text-(--black) flex flex-col 2xl:gap-7 gap-4">
            <h2>about me</h2>
            <p className="about-text text-(length:--text-about)/[135%] md:leading-[125%] lg:leading-[115%] xl:leading-[102%] tracking-[-0.5%] font-extrabold 2xl:text-nowrap text-wrap">
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
    <section className="w-screen h-dvh px-[1.3rem] sm:px-12 md:px-24 lg:px-40 2xl:px-0 overflow-hidden">
      <div className="w-full h-full text-nowrap flex flex-col items-start 2xl:items-center justify-center gap-7">
        <div className="text-left text-(--white) flex flex-col 2xl:gap-7 gap-4">
          <h2>about me</h2>
          <p
            ref={(e) => {
              if (e) aboutTextRef.current = e;
            }}
            className="about-text text-(--white-green) text-(length:--text-about)/[135%] md:leading-[125%] lg:leading-[115%] xl:leading-[102%] tracking-[-0.5%] font-extrabold 2xl:text-nowrap text-wrap"
          >
            I&apos;m a {/* ignore-split class to ignore in split text */}
            <span className="ignore-split">
              skilled web developer
            </span> that <br />
            creates powerful digital solutions. <br />
            Every obstacle overcome and <br />
            every line of code created is a step <br />
            closer to perfection.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
