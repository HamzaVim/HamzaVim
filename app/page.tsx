import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import LoadingScreen from "@/components/LoadingScreen";

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

      {/* Loading screen */}
      <LoadingScreen />
    </>
  );
}
