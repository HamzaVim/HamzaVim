import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { FaTelegramPlane } from "react-icons/fa";
import { MdFingerprint, MdMail } from "react-icons/md";
import { SiUpwork, SiGithub } from "react-icons/si";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";

// Link item
const LinkItem = ({ href, text }: { href: string; text: string }) => {
  return (
    <a href={href}>
      <span className="text-block">
        <span>{text}</span>
        <span>{text}</span>
      </span>
    </a>
  );
};

const Header = () => {
  // NOTE: States & Refs -------------------------------------------------------

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
          <Image src="/images/press.png" fill alt="press image" />
        </div>
        <MdFingerprint className="finger-print" />
      </button>
      <div className="right">
        <ul className="">
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
        <button className="sound-btn">
          sound{" "}
          <span className="on-off">
            <span>on</span>
            <span>off</span>
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
