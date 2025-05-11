"use client";
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

  const { register } = useForm<FormValues>({
    defaultValues: { userName: "", email: "", message: "" },
  });

  // NOTE: Fuctions & Animations -------------------------------------------------------

  return (
    <section
      id="contact"
      className="flex flex-col gap-12 justify-center items-start w-screen text-center px-[1.3rem] min-h-dvh"
    >
      <div className="flex flex-col gap-4 items-start">
        <h2>Contact</h2>
        <p>
          Want a website that stands out? <br className="sm:hidden" /> Let’s
          make it happen
        </p>
      </div>
      <form>
        <div id="initial-state-corners" className="absolute">
          <div
            id="corners"
            style={{
              display: "none",
            }}
            className="absolute top-0 left-0 w-full h-full -z-50"
          >
            <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-2 border-l-2 border-(--input-color)" />
            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-2 border-r-2 border-(--input-color)" />
            <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-2 border-l-2 border-(--input-color)" />
            <div className="absolute -right-0.5 -bottom-0.5 w-5 h-5 border-r-2 border-b-2 border-(--input-color)" />
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
          className="relative py-7 w-full text-3xl font-black uppercase text-white/70 font-limelight"
        >
          send
        </button>
      </form>
      <footer className="flex flex-col gap-12 w-full">
        <div className="flex justify-between px-3">
          <SiUpwork className="sm-icon" />
          <SiGithub className="sm-icon" />
          <FaTelegramPlane className="sm-icon" />
          <MdMail className="sm-icon" />
        </div>
        <div className="contact-info">
          <a href="https://www.instagram.com/hamzasxh/">
            <h5>Instagram</h5>
            <p>hamzasxh@gmail.com</p>
          </a>
          <a href="https://t.me/HamzaVim">
            <h5>Telegram</h5>
            <p>@HamzaVim</p>
          </a>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
