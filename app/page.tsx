"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import Projects from "@/components/Projects";
import gsap, { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useGlobal } from "@/context/GlobalContext";

export default function Page() {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const { pageChanged, linkState } = useGlobal();

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
        {!pageChanged ? (
          <>
            {/* Home */}
            <Hero />
            <About />
            <WhyMe />
            <Contact />
          </>
        ) : linkState === "projects" ? (
          <>
            {/* Projects */}
            <Projects />
          </>
        ) : null}
      </main>
    </>
  );
}
