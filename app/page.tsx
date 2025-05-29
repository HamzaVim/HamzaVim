import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import LoadingScreen from "@/components/LoadingScreen";
import Projects from "@/components/Projects";

export default function Page() {
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
