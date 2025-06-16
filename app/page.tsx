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
import Resume from "@/components/Resume";
import useCursortTracker from "@/components/useCursortTracker";
import useCursorDetection from "@/components/useCursorDetection";

export default function Page() {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  useCursortTracker();
  const hasCursor = useCursorDetection();

  const { pageChangedRef, linkState } = useGlobal();

  useGSAP(() => {
    ScrollSmoother.create({
      content: "body > div", // Select the wrapper element (first child of body)
      smooth: 2,
      smoothTouch: 1,
      onUpdate: (self) => {
        // Manually sync the header scroll position
        gsap.to("header", {
          y: self.scrollTop(),
          duration: 0,
          ease: "none",
        });

        // Manually sync the cursor position
        gsap.to(".masked", {
          "--scrollTop": self.scrollTop(),
          duration: 0,
          ease: "none",
        });
      },
    });
  });
  return (
    <div>
      <Header />
      <main>
        {!pageChangedRef.current ? (
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
        ) : (
          <Resume />
        )}
      </main>

      <div className={`masked${!hasCursor ? " mobile" : ""}`}>
        {!pageChangedRef.current ? (
          <>
            {/* Home */}
            <Hero masked />
            <About masked />
            <WhyMe masked />
            <Contact masked />
          </>
        ) : linkState === "projects" ? (
          <>
            {/* Projects */}
            <Projects />
          </>
        ) : (
          <Resume />
        )}
      </div>
    </div>
  );
}
