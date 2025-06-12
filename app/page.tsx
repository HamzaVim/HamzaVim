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

export default function Page() {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const { pageChangedRef, linkState } = useGlobal();

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
        {!pageChangedRef.current ? (
          <>
            {/* Home */}
            <Hero />
            <About />
            <WhyMe />
            <Contact />
            <div className="masked">
              <Hero masked />
              <About masked />
              <WhyMe masked />
            </div>
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
    </>
  );
}
