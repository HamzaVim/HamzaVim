import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { FaTelegramPlane } from "react-icons/fa";
import { MdFingerprint, MdMail } from "react-icons/md";
import { SiUpwork, SiGithub } from "react-icons/si";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// TODO: When click to resume, another 2 divs (or the same but not hiding the header): black page and white page, both with logo.
// Hide all the sections and show only the resume section.
// The animation ends and reveals the resume page and changes the link state to 'resume'.
// After creating the projects component, it will do the same.

// TODO: Loading page: black with logo and loading progress bar; when finished, click the start button.
// 2 divs: black page and white page, both with logo.
// When the user clicks the start button, the black page goes and reveals the white page, and it will go in 0.5s.
// Music will play in the background when the start button is clicked.
// State for complete loading page, Hero page 'text' appears.

// TODO: create context global provider for link state.
// Use 'scrollTo' from GSAP, except resume.
// Use 'scrollTrigger' from GSAP to change the state of the link; scroll to the about section, and the state changes to 'about'
// 'rect' animate when the link state changed.

// Link item
const LinkItem = ({ href, text }: { href: string; text: string }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  useGSAP(() => {
    if (!linkRef.current) return;

    const rect = linkRef.current.lastElementChild?.lastElementChild?.children[0]
      .children[0] as HTMLElement;

    linkRef.current.addEventListener("mouseenter", (ev) => {
      const target = ev.target as HTMLAnchorElement;
      const textBlock = target.children[0] as HTMLSpanElement;

      gsap.to(textBlock.children, {
        y: "-100%",
        duration: 0.3,
      });
    });

    linkRef.current.addEventListener("mouseleave", (ev) => {
      const target = ev.target as HTMLAnchorElement;
      const textBlock = target.children[0] as HTMLSpanElement;

      gsap.to(textBlock.children, {
        y: "0%",
        duration: 0.3,
      });
    });

    gsap.set(rect, {
      scaleY: 0,
    });
  });
  return (
    <a ref={linkRef} href={href} className="relative">
      <span className="text-block">
        <span>{text}</span>
        <span>{text}</span>
      </span>

      <div
        className={`masked-link w-full h-full absolute top-0 left-0 lg:px-5 lg:py-2 px-3 py-1 text-black bg-white`}
        style={{ maskImage: `url(#mask-${text})` }}
      >
        <span>{text}</span>
        <svg className="absolute top-0 left-0 w-full h-full">
          <mask id={`mask-${text}`}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
          </mask>
        </svg>
      </div>
    </a>
  );
};

const useSound = () => {
  // Ref: audio
  const soundRef = useRef<HTMLAudioElement>(null);

  // TODO: When the page loads, the audio loop will play automatically instead of using play and pause buttons.
  // When the sound button is clicked to turn off the audio, the volume will be reduced to 0 without pausing it.
  // The same process applies for turning the audio back on.
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    soundRef.current = new Audio("/audios/idea 22.mp3");
    soundRef.current.loop = true;
    soundRef.current.volume = 0.2;
  }, []);

  const playSound = () => {
    if (!soundRef.current) return;
    soundRef.current.play();
    // intervalRef.current = setInterval(() => {
    //   if (!soundRef.current) return;
    //   soundRef.current.volume += 0.01;
    //   if (soundRef.current.volume === 0.2) {
    //     clearInterval(intervalRef.current);
    //   }
    // }, 10);
  };

  const pauseSound = () => {
    if (!soundRef.current) return;
    // setInterval(() => {
    //   if (!soundRef.current) return;
    //   soundRef.current.volume -= 0.01;
    //   if (soundRef.current.volume == 0) {
    //     return;
    //   }
    // }, 10);
    soundRef.current.pause();
  };
  return {
    playSound,
    pauseSound,
  };
};

const Header = () => {
  // NOTE: States & Refs -------------------------------------------------------

  const { playSound, pauseSound } = useSound();
  // Ref: sound button
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const [soundState, setSoundState] = useState(false);

  const tlSoundBtn = useRef<gsap.core.Timeline>(null);

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
  useGSAP(() => {
    if (!soundBtnRef.current) return;

    const onOffBlock = soundBtnRef.current.children[0];

    tlSoundBtn.current = gsap
      .timeline({
        paused: true,
      })
      .to(onOffBlock, {
        x: "-100%",
        onComplete: () => {
          if (!soundBtnRef.current) return;
          const onOrOff = onOffBlock.children[0];
          onOffBlock.removeChild(onOrOff);
          onOffBlock.appendChild(onOrOff);
        },
      })
      .set(onOffBlock, { x: "0%" });
  });
  // If soundState Changed: Play the animation above
  useEffect(() => {
    if (!tlSoundBtn.current) return;
    tlSoundBtn.current.restart();

    if (soundState) {
      playSound();
    } else {
      pauseSound();
    }
  }, [soundState, playSound, pauseSound]);
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
