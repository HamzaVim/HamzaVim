import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { SiUpwork, SiGithub } from "react-icons/si";
import Logo from "../Logo";
import { useGlobal } from "@/context/GlobalContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";

// Link item
const LinkItem = ({ href, text }: { href: string; text: string }) => {
  // NOTE: States & Refs: ---------------------------------------------------

  const { linkState } = useGlobal();

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Animation when the link state changed (for the masked header)
  useGSAP(() => {
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
  });

  return <a href={href}>{text}</a>;
};

const HeaderMask = () => {
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

export default HeaderMask;
