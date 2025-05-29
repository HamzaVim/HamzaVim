"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import LoadingScreen from "@/components/LoadingScreen";
import Projects from "@/components/Projects";
import gsap, { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";

export default function Page() {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  useGSAP(() => {
    ScrollSmoother.create({
      content: "main",
      smooth: 2,
      smoothTouch: 1,
    });
  });
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <WhyMe />
        <Projects />
        <Contact />
      </main>

      {/* Loading screen */}
      <LoadingScreen />
    </>
  );
}
