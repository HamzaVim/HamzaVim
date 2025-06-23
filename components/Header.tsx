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
const LinkItem = ({
  href,
  text,
  masked,
}: {
  href: string;
  text: string;
  masked?: boolean;
}) => {
  gsap.registerPlugin(ScrollToPlugin);

  // NOTE: States & Refs: ---------------------------------------------------

  // Ref: link
  const linkRef = useRef<HTMLAnchorElement>(null);

  const {
    linkState,
    setLinkState,
    linkStateRef,
    setLoading,
    pageChanged,
    setPageChanged,
    loading,
  } = useGlobal();

  const loadingRef = useRef(loading);
  const pageChangedRef = useRef(pageChanged);

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Updating the `loadingRef` and `pageChangedRef`
  useEffect(() => {
    loadingRef.current = loading;
    pageChangedRef.current = pageChanged;
  }, [loading, pageChanged]);

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

    // Animation: Handle mouse click
    const handleClick = (ev: MouseEvent) => {
      if (loadingRef.current) return;

      // getting the target and getting the href
      const target = ev.target as HTMLAnchorElement;
      const href = target.href.split("#")[1];

      // To enter the projects or resume.
      // If the href is 'resume' or 'projects'
      if (["resume", "projects"].includes(href)) {
        // If the link state is already the same
        if (linkStateRef.current === href) return;

        setLoading(true);
        // changing the link state to `href` and set `pageChanged` to true
        gsap.delayedCall(2, () => {
          setLinkState(href);
          linkStateRef.current = href;
          setPageChanged(true);
        });
        return;
      }

      // To exit the projects or resume
      // If the `pageChangedRef` true, it means that the page is changed to projects or resume
      if (pageChangedRef.current) {
        setLoading(true);

        // After 1 second
        gsap.delayedCall(1, () => {
          // Setting the `pageChanged` to fasle
          setPageChanged(false);

          gsap.delayedCall(0.5, () => {
            // Setting the `loading` to fasle
            setLoading(false);
          });
        });

        // Animate after 2 second delay
        gsap.delayedCall(2, () => {
          gsap.to(window, {
            scrollTo: `#${href}`,
            duration: 1,
            onStart: () => {
              // changing the link state
              setLinkState(href);
              linkStateRef.current = href;
            },
          });
        });

        return;
      }

      // Animation
      gsap.to(window, {
        scrollTo: `#${href}`,
        duration: 1,
        onStart: () => {
          // changing the link state
          setLinkState(href);
          linkStateRef.current = href;
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

  // Animation when the link state changed (for the masked header)
  useGSAP(
    () => {
      const a = gsap.utils.toArray(
        ".masked .header .right a",
      ) as unknown as HTMLAnchorElement[];
      const hrefs = a.map((a) => a.href.split("#")[1]);

      hrefs.forEach((href, index) => {
        // Add active class to the active link & remove it from the others
        if (href === linkState) {
          a[index].classList.add("active");
        } else {
          a[index].classList.remove("active");
        }
      });
    },
    { dependencies: [linkState] },
  );

  if (masked) return <a href={href}>{text}</a>;

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

const HeaderMasked = () => {
  return (
    <div className="header">
      <div className="left">
        <Link href="#home">
          <Logo className="logo" />
        </Link>
        <ul>
          <li>
            <a href="https://www.example.com">
              <SiUpwork className="upwork sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <SiGithub className="github sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <FaTelegramPlane className="telegram sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <MdMail className="email sm-icon" />
            </a>
          </li>
        </ul>
      </div>
      <div className="right">
        <ul>
          <li>
            <LinkItem href="#about" text="about" masked />
          </li>
          <li>
            <LinkItem href="#contact" text="contact" masked />
          </li>
          <li>
            <LinkItem href="#projects" text="projects" masked />
          </li>
          <li>
            <LinkItem href="#resume" text="resume" masked />
          </li>
        </ul>
        <button className="sound-btn">
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
    </div>
  );
};

const Header = ({ masked }: { masked?: boolean }) => {
  // NOTE: States & Refs -------------------------------------------------------

  const { playSound, decreaseVolume, increaseVolume } = useSound();
  // Ref: sound button
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const [soundState, setSoundState] = useState(true);

  const tlSoundBtn = useRef<gsap.core.Timeline>(null);

  // Ref: timeout
  const timeOut = useRef<NodeJS.Timeout>(null);

  const {
    initialLoading,
    setLinkState,
    linkStateRef,
    pageChanged,
    setPageChanged,
    setLoading,
    cursorHoverIn,
    cursorHoverOut,
    cursorHoverVanish,
  } = useGlobal();
  const pageChangedRef = useRef(pageChanged);

  // NOTE: Fuctions & Animations -------------------------------------------------------

  // Updating the `pageChangedRef`
  useEffect(() => {
    pageChangedRef.current = pageChanged;
  }, [pageChanged]);

  useGSAP(() => {
    // Right side --------------------------------------------------------------

    // Get all links that are connected to this site.
    const allLinks = gsap.utils.toArray(
      "header .right a, header .left a[href='#home']",
    ) as unknown as HTMLAnchorElement[]; // Not including the masked header

    const handleClick = (ev: MouseEvent) => {
      // Disable click on links
      ev.preventDefault();

      // getting the target and getting the href from it
      const target = ev.target as HTMLAnchorElement;
      const href = target.href.split("#")[1];

      // If the href is home
      if (href === "home") {
        if (pageChangedRef.current) {
          setLoading(true);

          // After 1 second
          gsap.delayedCall(1, () => {
            // Setting the `pageChangedRef` and `loading` to fasle
            setPageChanged(false);
            setLoading(false);
          });

          // Animate after 1 second delay
          gsap.delayedCall(1, () => {
            gsap.to(window, {
              scrollTo: `#${href}`,
              duration: 1,
              onStart: () => {
                // changing the link state
                setLinkState(href);
                linkStateRef.current = href;
              },
            });
          });

          return;
        }

        gsap.to(window, {
          scrollTo: `#${href}`,
          duration: 1,
          onStart: () => {
            // changing the link state
            setLinkState(href);
            linkStateRef.current = href;
          },
        });
      }
    };

    allLinks.forEach((link) => {
      link.addEventListener("click", handleClick);
    });

    // Left side --------------------------------------------------------------
    const leftSideLinks = gsap.utils.toArray(
      "header .left a",
    ) as unknown as HTMLAnchorElement[]; // Not including the masked header

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

        // Get the logo svg with the masked logo
        const logoAll = gsap.utils.toArray(
          `.${logo.classList.value}`,
        ) as unknown as SVGSVGElement[];

        // Get the coordinates
        const x = ev.clientX - offsetLeft - link.offsetWidth / 2;
        const y = ev.clientY - offsetTop - 3;

        gsap.to(logoAll, {
          x,
          y,
          duration: 1.25,
          ease: "expo.out",
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

      // Get the icon svg element with the masked icon
      const smIcon = link.children[0] as SVGSVGElement;
      const splitValue = smIcon.classList.value.split(" ");
      const smIconAll = gsap.utils.toArray(
        `.${splitValue[0]}.${splitValue[1]}`,
      ) as unknown as SVGSVGElement[];

      // Get the coordinates
      const x = ev.clientX - offsetLeft - link.offsetWidth / 2;
      const y = ev.clientY - offsetTop - link.offsetHeight / 2;

      gsap.to(smIconAll, {
        x,
        y,
        duration: 1.25,
        ease: "expo.out",
      });
    };

    // Function to handle the mouse leave
    // Animation: The icon is back to the original position
    const handleMouseLeaveLeftSide = (ev: MouseEvent) => {
      // Get the link
      const link = ev.target as HTMLAnchorElement;

      // Get the icon svg element with the masked icon
      const icon = link.children[0] as SVGSVGElement;

      let allIcon: SVGSVGElement[];
      if (icon.classList.value === "logo") {
        // If the icon is a logo

        allIcon = gsap.utils.toArray(
          `.${icon.classList.value}`,
        ) as unknown as SVGSVGElement[];
      } else {
        // If the icon is a social media icon

        const splitValue = icon.classList.value.split(" ");
        allIcon = gsap.utils.toArray(
          `.${splitValue[0]}.${splitValue[1]}`,
        ) as unknown as SVGSVGElement[];
      }

      gsap.to(allIcon, {
        overwrite: true,
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
            // Get all on-off elements from header and .header (masked)
            const onOrOffs = gsap.utils.toArray(
              ".on-off",
            ) as unknown as HTMLSpanElement[];

            onOrOffs.forEach((onOrOff) => {
              const child = onOrOff.children[0] as HTMLSpanElement;

              onOrOff.removeChild(child);
              onOrOff.appendChild(child);
            });
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
  }, [initialLoading, playSound]);

  if (masked) return <HeaderMasked />;

  return (
    <header>
      <div className="left">
        <Link href="#home">
          <Logo className="logo" />
        </Link>
        <ul>
          <li>
            <a href="https://www.example.com">
              <SiUpwork className="upwork sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <SiGithub className="github sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <FaTelegramPlane className="telegram sm-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.example.com">
              <MdMail className="email sm-icon" />
            </a>
          </li>
        </ul>
      </div>
      <button
        onTouchStart={() => {
          if (timeOut.current) clearTimeout(timeOut.current);
          // Instead of delay in gsap
          timeOut.current = setTimeout(() => {
            cursorHoverIn();
          }, 300);
        }}
        onTouchEnd={(e) => {
          // There was a bug when the user releases the press button
          // The bug: initMouseEvent() Deprecation

          if (timeOut.current) clearTimeout(timeOut.current);
          cursorHoverVanish();
          e.preventDefault();
        }}
        onTouchCancel={() => {
          if (timeOut.current) clearTimeout(timeOut.current);
          cursorHoverVanish();
        }}
        onContextMenu={(e) => e.preventDefault()} // 👈 Block browser menu
        className="press"
      >
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
        <ul onMouseEnter={cursorHoverVanish} onMouseLeave={cursorHoverOut}>
          <li>
            <LinkItem href="#about" text="about" />
          </li>
          <li>
            <LinkItem href="#contact" text="contact" />
          </li>
          <li>
            <LinkItem href="#projects" text="projects" />
          </li>
          <li>
            <LinkItem href="#resume" text="resume" />
          </li>
        </ul>
        <button
          onMouseEnter={cursorHoverVanish}
          onMouseLeave={cursorHoverOut}
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
