"use client";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollToPlugin } from "gsap/all";
import { FaTelegramPlane } from "react-icons/fa";
import { MdFingerprint, MdMail } from "react-icons/md";
import { SiUpwork, SiGithub } from "react-icons/si";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import useSound from "./useSound";

// TODO: Maybe changing the links' style.

// TODO: When click to resume, another 2 divs (or the same but not hiding the header): black page and white page, both with logo.
// Hide all the sections and show only the resume section.
// The animation ends and reveals the resume page and changes the link state to 'resume'.
// After creating the projects component, it will do the same.

// TODO: Loading page: black with logo and loading progress bar; when finished, click the start button. ✅
// 2 divs: black page and white page, both with logo. ✅
// When the user clicks the start button, the black page goes and reveals the white page, and it will go in 0.5s. ✅
// Music will play in the background when the start button is clicked. ✅
// State for complete loading page, Hero page 'text' appears.

// TODO: create context global provider for link state. ✅
// Use 'scrollTo' from GSAP, except resume. ✅
// Use 'scrollTrigger' from GSAP to change the state of the link; scroll to the about section, and the state changes to 'about' ✅
// 'rect' animate when the link state changed. ✅

// Link item
const LinkItem = ({ href, text }: { href: string; text: string }) => {
  gsap.registerPlugin(ScrollToPlugin);

  // NOTE: States & Refs: ---------------------------------------------------

  // Ref: link
  const linkRef = useRef<HTMLAnchorElement>(null);

  const { linkState, setLinkState } = useGlobal();

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Animation for the link: Hover & click
  useGSAP(() => {
    if (!linkRef.current) return;

    const rect = linkRef.current.lastElementChild?.lastElementChild?.children[0]
      .children[0] as HTMLElement;

    // Events handlers: -------------------------------------------------

    // Handle mouse enter
    // Animation: Text block goes up
    const handleMouseEnter = (ev: MouseEvent) => {
      // Getting the target and getting the text block from it
      const target = ev.target as HTMLAnchorElement;
      const textBlock = target.children[0] as HTMLSpanElement;

      // Animating the text
      gsap.to(textBlock.children, {
        y: "-100%",
        duration: 0.3,
      });
    };

    // Handle mouse leave
    // Animation: Text block goes down
    const handleMouseLeave = (ev: MouseEvent) => {
      // Getting the target and getting the text block from it
      const target = ev.target as HTMLAnchorElement;
      const textBlock = target.children[0] as HTMLSpanElement;

      // Animating the text
      gsap.to(textBlock.children, {
        y: "0%",
        duration: 0.3,
      });
    };

    // Handle mouse click
    // Animation: Scroll to the section
    const handleClick = (ev: MouseEvent) => {
      // getting the target and getting the href
      const target = ev.target as HTMLAnchorElement;
      const href = target.href.split("#")[1];

      // Until the resume and projects sections are created
      if (href === "resume" || href === "projects") return;

      // Animation
      gsap.to(window, {
        scrollTo: `#${href}`,
        duration: 1,
        onStart: () => {
          // changing the link state
          setLinkState(href);
        },
      });
    };
    // : -----------------------------------------------------------------

    // add event listeners
    linkRef.current.addEventListener("mouseenter", handleMouseEnter);
    linkRef.current.addEventListener("mouseleave", handleMouseLeave);
    linkRef.current.addEventListener("click", handleClick);

    // set initial state
    gsap.set(rect, {
      scaleY: 0,
    });

    return () => {
      linkRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      linkRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      linkRef.current?.removeEventListener("click", handleClick);
    };
  });

  // Animation when the link state changed
  useGSAP(
    () => {
      if (!linkRef.current) return;

      const rect = linkRef.current.lastElementChild?.lastElementChild
        ?.children[0].children[0] as HTMLElement;

      gsap.to(rect, {
        overwrite: "auto",
        scaleY: linkState === text ? 1 : 0,
        ease: "power2.out",
        duration: 0.4,
      });
    },
    { dependencies: [linkState] },
  );

  return (
    <a ref={linkRef} href={href} className="relative">
      <span className="text-block">
        <span>{text}</span>
        <span>{text}</span>
      </span>

      <div className="masked-link" style={{ maskImage: `url(#mask-${text})` }}>
        <span>{text}</span>
        <svg>
          <mask id={`mask-${text}`}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
          </mask>
        </svg>
      </div>
    </a>
  );
};

const Header = () => {
  // NOTE: States & Refs -------------------------------------------------------

  const { playSound, decreaseVolume, increaseVolume } = useSound();
  // Ref: sound button
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const [soundState, setSoundState] = useState(true);

  const tlSoundBtn = useRef<gsap.core.Timeline>(null);

  const { initialLoading } = useGlobal();

  // NOTE: Fuctions & Animations -------------------------------------------------------

  useGSAP(() => {
    // Right side --------------------------------------------------------------

    // Get all links
    const allLinks = gsap.utils.toArray(
      ".right a",
    ) as unknown as HTMLAnchorElement[];

    const handleClick = (ev: MouseEvent) => {
      // Disable click on links
      ev.preventDefault();
    };

    allLinks.forEach((link) => {
      link.addEventListener("click", handleClick);
    });

    // Left side --------------------------------------------------------------
    const leftSideLinks = gsap.utils.toArray(
      ".left a",
    ) as unknown as HTMLAnchorElement[];

    // Function to handle the mouse move
    // Animation: The icon is tracking the mouse
    const handleMouseMoveLeftSide = (ev: MouseEvent) => {
      // Get the link
      const link = ev.target as HTMLAnchorElement;

      // Check if the link has the logo ------------------------------------------
      if (link.children[0].classList[0] === "logo" && link.parentElement) {
        // Get the offsets
        const offsetLeft = link.parentElement.offsetLeft;
        const offsetTop = link.parentElement.offsetTop + link.offsetTop * -1;

        // Get the icon svg element
        const logo = link.children[0] as SVGSVGElement;

        // Get the coordinates
        const x = ev.clientX - offsetLeft - link.offsetWidth / 2;
        const y = ev.clientY - offsetTop;

        gsap.to(logo, {
          x,
          y,
        });
        return;
      }
      // else: social media icons ------------------------------------------------
      if (!link.parentElement?.parentElement?.parentElement) return;

      // Get the offsets
      const offsetLeft =
        link.parentElement.parentElement.parentElement.offsetLeft;
      const offsetTop =
        link.parentElement.parentElement.parentElement.offsetTop +
        link.offsetTop;

      // Get the icon svg element
      const smIcon = link.children[0] as SVGSVGElement;

      // Get the coordinates
      const x = ev.clientX - offsetLeft - link.offsetWidth / 2;
      const y = ev.clientY - offsetTop - link.offsetHeight / 2;

      gsap.to(smIcon, {
        x,
        y,
      });
    };

    // Function to handle the mouse leave
    // Animation: The icon is back to the original position
    const handleMouseLeaveLeftSide = (ev: MouseEvent) => {
      // Get the link
      const link = ev.target as HTMLAnchorElement;

      // Get the icon svg element
      const icon = link.children[0] as SVGSVGElement;

      gsap.to(icon, {
        x: 0,
        y: 0,
      });
    };

    leftSideLinks.forEach((link) => {
      link.addEventListener("mousemove", handleMouseMoveLeftSide);
      link.addEventListener("mouseleave", handleMouseLeaveLeftSide);
    });

    return () => {
      // Right side --------------------------------------------------------------
      allLinks.forEach((link) => {
        link.removeEventListener("click", handleClick);
      });

      // Left side --------------------------------------------------------------
      leftSideLinks.forEach((link) => {
        link.removeEventListener("mousemove", handleMouseMoveLeftSide);
        link.removeEventListener("mouseleave", handleMouseLeaveLeftSide);
      });
    };
  });

  // Sound button animation
  // Creating a timeline
  useGSAP(
    () => {
      if (!soundBtnRef.current) return;

      const onOffBlock = soundBtnRef.current.children[0];

      tlSoundBtn.current = gsap
        .timeline({
          paused: initialLoading ? false : true,
        })
        .to(onOffBlock, {
          x: "-100%",
          onStart: () => {
            if (soundState) {
              increaseVolume();
            } else {
              decreaseVolume();
            }
          },
          onComplete: () => {
            if (!soundBtnRef.current) return;
            const onOrOff = onOffBlock.children[0];
            onOffBlock.removeChild(onOrOff);
            onOffBlock.appendChild(onOrOff);
          },
        })
        .set(onOffBlock, { x: "0%" });
    },
    { dependencies: [soundState] },
  );

  // If the site is loaded
  useEffect(() => {
    if (!tlSoundBtn.current) return;
    if (initialLoading) {
      playSound();
    }
    return () => {
      if (!tlSoundBtn.current) return;
      tlSoundBtn.current.kill();
    };
  }, [initialLoading]);

  return (
    <header>
      <div className="left">
        <Link href="/">
          <Logo className="logo" />
        </Link>
        <ul>
          <li>
            <a href="https://www.example.com">
              <SiUpwork className="sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <SiGithub className="sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <FaTelegramPlane className="sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <MdMail className="sm-icon" />
            </a>
          </li>
        </ul>
      </div>
      <button className="press">
        <div className="press-img">
          <Image
            src="/images/press.png"
            fill
            sizes="100%"
            quality={100}
            alt="press image"
          />
        </div>
        <MdFingerprint className="finger-print" />
      </button>
      <div className="right">
        <ul>
          <li>
            <LinkItem href="#about" text="about" />
          </li>
          <li>
            <LinkItem href="#projects" text="projects" />
          </li>
          <li>
            <LinkItem href="#contact" text="contact" />
          </li>
          <li>
            <LinkItem href="#resume" text="resume" />
          </li>
        </ul>
        <button
          onClick={() => {
            if (tlSoundBtn.current && !tlSoundBtn.current.isActive())
              setSoundState(!soundState);
          }}
          ref={soundBtnRef}
          className="sound-btn"
        >
          sound&nbsp;
          <span className="on-off">
            <span className="on">on</span>
            <span className="off">off</span>
          </span>
        </button>
      </div>
      <div className="bg-shadow">
        <div className="top" />
        <div className="bottom" />
      </div>
    </header>
  );
};

export default Header;
