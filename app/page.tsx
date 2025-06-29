"use client";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import WhyMe from "@/components/WhyMe/WhyMe";
import Contact from "@/components/Contact/Contact";
import Projects from "@/components/Projects/Projects";
import gsap, {
  Flip,
  ScrollSmoother,
  ScrollToPlugin,
  ScrollTrigger,
  SplitText,
} from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useGlobal } from "@/context/GlobalContext";
import Resume from "@/components/Resume/Resume";
import useCursortTracker from "@/components/useCursortTracker";
import useCursorDetection from "@/components/useCursorDetection";
import useResizeUpdater from "@/components/useResizeUpdater";
import HeroMask from "@/components/Hero/HeroMask";
import AboutMask from "@/components/About/AboutMask";
import WhyMeMask from "@/components/WhyMe/WhyMeMask";
import ContactMask from "@/components/Contact/ContactMask";
import ProjectsMask from "@/components/Projects/ProjectsMask";
import ResumeMask from "@/components/Resume/ResumeMask";
import HeaderMask from "@/components/Header/HeaderMask";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  Flip,
);

export default function Page() {
  // Cursor
  useCursortTracker();
  const hasCursor = useCursorDetection();

  // Resize
  useResizeUpdater();

  const { pageChanged, linkState } = useGlobal();

  useGSAP(() => {
    ScrollSmoother.create({
      content: "body div.content", // Select the wrapper element (first child of body)
      smooth: 2,
      smoothTouch: 1,
      onUpdate: (self) => {
        // Manually sync the header scroll position
        gsap.to("header, .header", {
          y: self.scrollTop(),
          duration: 0,
          ease: "none",
        });

        // Add backgroundColor and backdropFilter to the header for mobile
        if (!hasCursor) {
          if (
            self.progress > 0.337978 &&
            gsap.getProperty("header .right ul", "--set-bg") === 0
          ) {
            // If the progress is greater than 0.337978: reached to the About section && the `--set-bg` is set to 0
            // Set `blur-bg` class to the ul

            const ul = gsap.utils.toArray(
              "header .right ul",
            )[0] as HTMLUListElement;

            ul.classList.add("blur-bg");
          } else if (
            self.progress < 0.337978 &&
            gsap.getProperty("header .right ul", "--set-bg") === 1
          ) {
            // If the progress is less than 0.337978: not reached to the About section && the `--set-bg` is set to 1
            // Remove `blur-bg` class from the ul

            const ul = gsap.utils.toArray(
              "header .right ul",
            )[0] as HTMLUListElement;

            ul.classList.remove("blur-bg");
          }
        }

        // Manually sync the cursor position
        gsap.to(".masked", {
          "--scrollTop": self.scrollTop(),
          duration: 0,
          ease: "none",
        });
      },
    });
    ScrollTrigger.normalizeScroll(true); // Helps with touch devices
  });
  return (
    <div className="content">
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
        ) : (
          <>
            {/* Resume */}
            <Resume />
          </>
        )}
      </main>

      <div className={`masked${!hasCursor ? " mobile" : ""}`}>
        <HeaderMask />
        {!pageChanged ? (
          <>
            {/* Home */}
            <HeroMask />
            <AboutMask />
            <WhyMeMask />
            <ContactMask />
          </>
        ) : linkState === "projects" ? (
          <>
            {/* Projects */}
            <ProjectsMask />
          </>
        ) : (
          <>
            {/* Resume */}
            <ResumeMask />
          </>
        )}
      </div>
    </div>
  );
}
