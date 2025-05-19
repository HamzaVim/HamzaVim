"use client";
import About from "@/components/About";
import Hero from "@/components/Hero";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import Header from "@/components/Header";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <WhyMe />
        <Contact />
      </main>
    </>
  );
}
