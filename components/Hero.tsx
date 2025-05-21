"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

const Hero = ({ masked }: { masked?: boolean }) => {
  gsap.registerPlugin(ScrollTrigger);

  // NOTE: States & Refs: ---------------------------------------------------

  const imageContainerRef = useRef<HTMLDivElement>(null);
  // NOTE: Functions & Animations: ---------------------------------------------------

  // Image animation when scrolling
  useGSAP(() => {
    if (imageContainerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      });
      gsap.set(imageContainerRef.current, {
        top: "0%",
      });
      tl.to(imageContainerRef.current, {
        top: "25%",
      });
    }
  });
  // Masked Hero section
  if (masked)
    return (
      <section className="w-screen h-dvh">
        <div className="flex flex-col gap-7 justify-center items-center w-full h-full text-center text-black uppercase pointer-events-none select-none text-nowrap">
          <p className="text-xl font-bold text-name">hamza hassen</p>
          <h1>
            designing
            <br />
            stunning
            <br />
            websites in
            <br />
            any style
            <br />
            you imagine
          </h1>
        </div>
      </section>
    );
  return (
    <section id="home">
      {/* Container for image */}
      <div ref={imageContainerRef} className="img-container">
        {/* Overlay */}
        <div className="img-shadow" />
        {/* Mobile */}
        <Image
          src="/images/hero-phone.png"
          alt="hero image"
          fill
          className="hero-img-mobile"
          sizes="100vw"
          quality={100}
        />
        {/* Tablet */}
        <Image
          src="/images/hero-tablet.png"
          alt="hero image"
          fill
          className="hero-img-tablet"
          sizes="100vw"
          quality={100}
        />
        {/* Desktop */}
        <Image
          src="/images/hero-desktop.png"
          alt="hero image"
          fill
          className="hero-img-desktop"
          sizes="100vw"
          quality={100}
        />
      </div>
      <div className="hero-text-container">
        <div className="text-container">
          <p className="my-name">hamza hassen</p>
          <h1>
            creating
            <br />
            <span className="text-primary">
              beautiful
              <br />
              websites
            </span>
            <br />
            that reflect
            <br />
            your vision
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
