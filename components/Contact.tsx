"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { useForm } from "react-hook-form";
import { FaTelegramPlane, FaUser } from "react-icons/fa";
import { MdEmail, MdMail, MdOutlineMessage } from "react-icons/md";
import { SiUpwork, SiGithub } from "react-icons/si";

type FormValues = {
  userName: string;
  email: string;
  message: string;
};

const Contact = () => {
  // NOTE: States & Refs -------------------------------------------------------

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { userName: "", email: "", message: "" },
  });

  // NOTE: Fuctions & Animations -------------------------------------------------------

  const submitForm = () => {
    console.log("Submitted");
  };

  // Animation for the masked info
  useGSAP(() => {
    // Array of masked info classes
    const maskedInfo = gsap.utils.toArray(".masked-info") as HTMLDivElement[];

    // handle mouse enter & animation
    const handleMouseEnter_MaskedInfo = (rect: HTMLElement) => {
      gsap.to(rect, {
        overwrite: "auto",
        scaleY: 1,
        ease: "power2.out",
        duration: 0.4,
      });
    };

    // handle mouse leave & animation
    const handleMouseLeave_MaskedInfo = (rect: HTMLElement) => {
      gsap.to(rect, {
        overwrite: "auto",
        scaleY: 0,
        ease: "power2.out",
        duration: 0.4,
      });
    };

    // Loop through each element
    maskedInfo.forEach((item) => {
      // Get the rect and set initial scale
      const rect = item.children[2].children[0].children[0] as HTMLElement;
      gsap.set(rect, {
        scaleY: 0,
      });

      const itemParent = item.parentElement as HTMLElement;

      // Add Events ------------------------------
      item.addEventListener("mouseenter", () =>
        handleMouseEnter_MaskedInfo(rect),
      );
      item.addEventListener("mouseleave", () =>
        handleMouseLeave_MaskedInfo(rect),
      );
      itemParent.addEventListener("focusin", () =>
        handleMouseEnter_MaskedInfo(rect),
      );
      itemParent.addEventListener("focusout", () =>
        handleMouseLeave_MaskedInfo(rect),
      );
    });

    // Cleanup
    return () => {
      maskedInfo.forEach((item) => {
        const rect = item.children[2].children[0].children[0] as HTMLElement;
        item.removeEventListener("mouseenter", () =>
          handleMouseEnter_MaskedInfo(rect),
        );
        item.removeEventListener("mouseleave", () =>
          handleMouseLeave_MaskedInfo(rect),
        );
      });
    };
  });

  return (
    <section
      id="contact"
      className="flex flex-col gap-12 justify-center items-start w-screen text-center sm:px-12 md:px-24 lg:px-40 px-[1.3rem] min-h-dvh"
    >
      <div className="flex flex-col gap-4 items-start">
        <h2>Contact</h2>
        <p>
          Want a website that stands out? <br className="sm:hidden" /> Let’s
          make it happen
        </p>
      </div>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <div id="initial-state-corners" className="absolute">
          <div
            id="corners"
            style={{
              display: "none",
            }}
            className="absolute top-0 left-0 w-full h-full -z-50"
          >
            <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-2 border-l-2 border-(--corner-color)" />
            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-2 border-r-2 border-(--corner-color)" />
            <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-2 border-l-2 border-(--corner-color)" />
            <div className="absolute -right-0.5 -bottom-0.5 w-5 h-5 border-r-2 border-b-2 border-(--corner-color)" />
          </div>
        </div>
        <div>
          <label htmlFor="userName">
            <FaUser aria-hidden="true" className="form-icon" />
            <input
              id="userName"
              placeholder="Your name"
              {...register("userName", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-z\u0600-\u06FF ,.'-]+$/i,
                  message: "Only letters are allowed.",
                },
              })}
            />
          </label>
        </div>
        <div>
          <label htmlFor="email">
            <MdEmail aria-hidden="true" className="form-icon" />
            <input
              id="email"
              placeholder="Your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </label>
        </div>
        <div>
          <label htmlFor="message">
            <MdOutlineMessage aria-hidden="true" className="form-icon" />
            <input
              id="message"
              placeholder="Your message"
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
              })}
            />
          </label>
        </div>
        <button
          type="submit"
          className="relative py-7 w-full text-3xl font-black tracking-[1%] uppercase cursor-pointer md:text-4xl text-white/70 font-limelight"
        >
          send
        </button>
      </form>
      <footer className="flex flex-col gap-12 w-full">
        <div className="flex justify-between px-3 sm-container sm:px-6">
          <a href="" className="group">
            <SiUpwork className="sm-icon" />
          </a>
          <a href="" className="group">
            <SiGithub className="sm-icon" />
          </a>
          <a href="" className="group">
            <FaTelegramPlane className="sm-icon" />
          </a>
          <a href="" className="group">
            <MdMail className="sm-icon" />
          </a>
        </div>
        <div className="contact-info">
          <a href="https://www.instagram.com/hamzasxh/">
            <h5>Instagram</h5>
            <p>hamzasxh@gmail.com</p>
            <div className="masked-info mask-[url(#mask-1)]">
              <h5>I’ll read it—100%!</h5>
              <p>hamzasxh@gmail.com</p>
              <svg>
                <mask id="mask-1">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                </mask>
              </svg>
            </div>
          </a>
          <a href="https://t.me/HamzaVim">
            <h5>Telegram</h5>
            <p>@HamzaVim</p>
            <div className="masked-info mask-[url(#mask-2)]">
              <h5>80% chance I’ll respond</h5>
              <p>@HamzaVim</p>
              <svg>
                <mask id="mask-2">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                </mask>
              </svg>
            </div>
          </a>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
