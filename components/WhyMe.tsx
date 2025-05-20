"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

const ListItem = ({
  title, // Original title
  maskedTitle, // Highlighted title if the original title is too long
  body, // paragraph text
}: {
  title: string;
  maskedTitle?: string;
  body: string;
}) => {
  gsap.registerPlugin(ScrollTrigger);

  // NOTE: States & Refs: ---------------------------------------------------

  // Ref: li
  const liRef = useRef<HTMLLIElement>(null);

  // Ref: highlighted text
  const highlightedTextRef = useRef<HTMLHeadingElement>(null);

  // Ref for the svg to hide the text
  const svgRef = useRef<SVGSVGElement>(null);

  // State for the hover
  const [hovered, setHovered] = useState(false);

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Animation when scroll
  useGSAP(
    () => {
      if (!liRef.current || !highlightedTextRef.current) return;
      gsap.to(highlightedTextRef.current, {
        scrollTrigger: {
          trigger: highlightedTextRef.current,
          start: "top 94%",
          end: "top 50%",
          scrub: true,
        },
        width: "100%",
      });
    },
    { scope: liRef },
  );

  // Adding the svg viewBox to the svgs
  useEffect(() => {
    if (!liRef.current || !svgRef.current) return;

    // Extracting the width and height of the link
    const width = liRef.current.offsetWidth;
    const height = liRef.current.offsetHeight;

    // Setting the viewBox
    svgRef.current.setAttribute("viewBox", `0 0 ${width} ${height}`);

    // Handling when the browser is resized
    const handleResize = () => {
      if (!liRef.current || !svgRef.current) return;

      // Extracting the width and height of the link
      const afterResizewidth = liRef.current.offsetWidth;
      const afterResizeheight = liRef.current.offsetHeight;

      svgRef.current.setAttribute(
        "viewBox",
        `0 0 ${afterResizewidth} ${afterResizeheight}`,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animation when hovered
  useGSAP(
    () => {
      if (!svgRef.current) return;

      if (hovered) {
        // When hovered we want to show the other text
        gsap.to("rect", {
          overwrite: "auto",
          ease: "power2.out",
          scaleY: 1,
          duration: 0.4,
        });
      } else {
        // When not hovered we want to hide the other text
        gsap.to("rect", {
          overwrite: "auto",
          ease: "power2.out",
          scaleY: 0,
          duration: 0.4,
        });
      }
    },
    { dependencies: [hovered], scope: liRef },
  );

  return (
    <li ref={liRef}>
      <div className="text-container">
        <span>{title}</span>

        {/* The div is for the hover */}
        <div
          className="hover-effect-container"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
        {/* Highlighted text */}
        <h3 ref={highlightedTextRef} style={{ width: "0%" }}>
          {title}
        </h3>
      </div>

      {/* Masked text */}
      <div
        style={{
          maskImage: `url(#mask-${title.split(" ").join("-").toLowerCase()})`,
          maskMode: "alpha",
        }}
        className="text-container-masked"
      >
        <h3>{maskedTitle ?? title}</h3>
        <p dangerouslySetInnerHTML={{ __html: body }} />

        {/* This svg to show the text that are masked */}
        <svg fill="none" ref={svgRef} xmlns="http://www.w3.org/2000/svg">
          <mask id={`mask-${title.split(" ").join("-").toLowerCase()}`}>
            <rect x="0%" y="0%" height="100%" width="100vw" />
          </mask>
        </svg>
      </div>
    </li>
  );
};
const WhyMe = () => {
  return (
    <section id="why-me">
      <h2>why me</h2>
      <ul>
        <ListItem
          title="Custom Solutions"
          body="The idea of one-size-fits-all does not appeal to me.<br class='hidden lg:block' /> In every project,<br class='hidden sm:block md:hidden' /> I know exactly what it is and how<br class='hidden lg:block' /> to implement the right solution just the way you want it."
        />
        <ListItem
          title="Full-Stack Expertise"
          maskedTitle="Full-Stack Exp"
          body="As both a UX/UI designer and developer,<br class='hidden lg:block' /> I bridge the gap between design and<br class='hidden lg:block xl:hidden' /> functionality,<br class='hidden xl:block' /> ensuring a seamless user experience."
        />
        <ListItem
          title="Modern Tech"
          body="I specialize in Next.js, React, and Tailwind CSS<br class='hidden lg:block' /> for fast, responsive, and scalable websites."
        />
        <ListItem
          title="Fast & Responsive"
          body="Your site will look fantastic and work perfectly on any device."
        />
        <ListItem
          title="Your Vision, Delivered"
          maskedTitle="Your Vision, Del"
          body="Your vision is my priority. I work closely with you<br class='hidden lg:block' /> to bring your ideas to life."
        />
      </ul>
    </section>
  );
};

export default WhyMe;
