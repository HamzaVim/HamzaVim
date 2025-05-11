"use client";
import About from "@/components/About";
import Hero from "@/components/Hero";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <WhyMe />
        <Contact />
      </main>
    </>
  );
}
