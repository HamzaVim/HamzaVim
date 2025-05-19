import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { FaTelegramPlane } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { SiUpwork, SiGithub } from "react-icons/si";
import Logo from "./Logo";
import Link from "next/link";

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

    return () => {
      allLinks.forEach((link) => {
        link.removeEventListener("click", handleClick);
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
            <a href="">
              <SiUpwork className="sm-icon" />
            </a>
          </li>
          <li>
            <a href="">
              <SiGithub className="sm-icon" />
            </a>
          </li>
          <li>
            <a href="">
              <FaTelegramPlane className="sm-icon" />
            </a>
          </li>
          <li>
            <a href="">
              <MdMail className="sm-icon" />
            </a>
          </li>
        </ul>
      </div>
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
