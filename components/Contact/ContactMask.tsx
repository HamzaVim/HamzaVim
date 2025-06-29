import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaUser, FaTelegramPlane, FaInstagram } from "react-icons/fa";
import { MdEmail, MdOutlineMessage } from "react-icons/md";
import { SiUpwork, SiGithub } from "react-icons/si";

const ContactMask = () => {
  // A function to handle input change and add the value to the masked form
  useGSAP(() => {
    // Getting the form
    const formValues = gsap.utils.toArray(
      "#contact form input",
    ) as HTMLInputElement[];
    const maskedFormValues = gsap.utils.toArray(
      ".contact form input",
    ) as HTMLInputElement[];

    if (!formValues || !maskedFormValues) return;

    const handleInputChange = (ev: Event) => {
      const input = ev.target as HTMLInputElement;
      const value = input.value;

      // When the id of the input is included in the className of the masked form
      maskedFormValues.forEach((maskedInput) => {
        if (!maskedInput.className.includes(input.id)) return;
        maskedInput.value = value;
      });
    };

    formValues.forEach((input) => {
      input.addEventListener("input", handleInputChange);
    });

    return () => {
      formValues.forEach((input) => {
        input.removeEventListener("input", handleInputChange);
      });
    };
  });

  return (
    <div className="contact">
      <div className="header-container">
        <h2>Contact</h2>
        <p>
          Want a website that stands out? <br /> Let’s make it happen
        </p>
      </div>
      <form>
        <div className="input-container">
          <label>
            <input
              type="text"
              className="userName peer"
              placeholder="Your name"
              disabled
            />
            <FaUser aria-hidden="true" className="form-icon" />
          </label>
        </div>
        <div className="input-container">
          <label>
            <input
              type="email"
              className="email peer"
              placeholder="Your email"
              disabled
            />
            <MdEmail aria-hidden="true" className="form-icon" />
          </label>
        </div>
        <div className="input-container">
          <label>
            <input
              className="message peer"
              placeholder="Your message"
              disabled
            />
            <MdOutlineMessage aria-hidden="true" className="form-icon" />
          </label>
        </div>
        <button type="submit" disabled>
          send
        </button>
      </form>
      <footer>
        <div className="sm-container">
          <a
            href="https://www.upwork.com/freelancers/~010048fd21753d8784"
            target="_blank"
            className="group"
          >
            <SiUpwork className="sm-icon" />
          </a>
          <a
            href="https://github.com/HamzaVim/"
            target="_blank"
            className="group"
          >
            <SiGithub className="sm-icon" />
          </a>
          <a
            href="https://web.telegram.org/k/#@HamzaVim"
            target="_blank"
            className="group"
          >
            <FaTelegramPlane className="sm-icon" />
          </a>
          <a
            href="https://www.instagram.com/vimhamza/"
            target="_blank"
            className="group"
          >
            <FaInstagram className="sm-icon" />
          </a>
        </div>
        <div className="contact-info">
          <a href="https://www.instagram.com/hamzasxh/">
            <h5>I’ll read it—100%!</h5>
            <p>hamzasxh@gmail.com</p>
          </a>
          <a href="https://t.me/HamzaVim">
            <h5>80% chance I’ll respond</h5>
            <p>@HamzaVim</p>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ContactMask;
