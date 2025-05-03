"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

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

  // NOTE: Functions & Animations: ---------------------------------------------------
  useGSAP(() => {
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
  });
  return (
    <li
      ref={liRef}
      className="overflow-hidden relative py-10 pl-4 w-full border-t sm:py-7 sm:pl-10 md:pl-20 xl:pl-24 2xl:pl-36 last:border-b h-fit border-t-white/15 last:border-b-white/15"
    >
      <div className="relative font-black text-white uppercase select-none w-fit h-fit text-nowrap">
        <span className="opacity-20 text-h3-sm/[100%] md:text-h3/[100%] tracking-[-0.5%]">
          {title}
        </span>

        {/* Highlighted text */}
        <h3
          ref={highlightedTextRef}
          style={{ width: "0%" }}
          className="overflow-hidden absolute top-0 left-0 h-full whitespace-nowrap"
        >
          {title}
        </h3>
      </div>

      {/*
       <div className="flex absolute top-0 right-0 items-center px-4 w-full h-full text-black sm:px-10 md:pl-20 lg:block lg:py-7 xl:pl-24 2xl:pl-36 bg-secondary">
      <h3 className="hidden md:block">{maskedTitle ?? title}</h3>
      <p
        dangerouslySetInnerHTML={{ __html: body }}
        className="flex right-0 items-center w-full h-full font-bold md:absolute md:top-1/2 md:pr-10 md:pl-7 md:-translate-y-1/2 xl:pr-20 text-whyme bg-secondary md:max-w-whyme xl:text-nowrap"
      />
    </div>
*/}
    </li>
  );
};
const WhyMe = () => {
  return (
    <section className="w-screen h-dvh">
      <h2 className="py-7 text-center 2xl:py-14">why me</h2>
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
