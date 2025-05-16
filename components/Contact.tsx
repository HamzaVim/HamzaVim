"use client";
import { useGSAP } from "@gsap/react";
import gsap, { Flip } from "gsap/all";
import { useRef } from "react";
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
  gsap.registerPlugin(Flip);

  // NOTE: States & Refs -------------------------------------------------------

  const { register, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: { userName: "", email: "", message: "" },
  });

  // Ref for each label & button
  const labelBtnRefs = useRef<(HTMLLabelElement | HTMLButtonElement)[]>([]);

  // Ref: corners & flip state
  const cornersRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const inputFocusedRef = useRef<HTMLInputElement>(null); // For accurate logging

  // NOTE: Fuctions & Animations -------------------------------------------------------

  const submitForm = () => {
    console.log("Submitted");
  };

  // Animation for corners & button
  useGSAP(
    () => {
      if (!labelBtnRefs.current || !cornersRef.current) return;

      // Getting the form
      const formContainer = gsap.utils.toArray("form")[0] as HTMLFormElement;

      // Function to check if the input are empty
      const checkIfEmptyInput = () => {
        // Check if the input aren't empty
        const formValues = getValues();
        const empty: string[] = [];

        // if the input is empty push the key to the `empty` array
        for (const k in formValues) {
          const key = k as keyof typeof formValues;
          if (formValues[key].trim() === "") {
            empty.push(key as string);
          }
        }
        return empty;
      };

      // Function for changing input opacity for label
      const inputOpacityForLabel = (
        target: HTMLLabelElement | HTMLButtonElement,
        opacity: "lighter" | "darker",
      ) => {
        const empty = checkIfEmptyInput();

        // If the target is a label and the input isn't empty
        if (
          target instanceof HTMLLabelElement &&
          empty.includes(target.htmlFor)
        ) {
          gsap.to(target, {
            "--input-opacity": opacity === "lighter" ? "100%" : "70%",
          });
        }
        return;
      };

      // Function for animating the button
      const btnAnimation = (
        btn: HTMLLabelElement | HTMLButtonElement,
        state: "open" | "close",
      ) => {
        // If the btn isn't a label
        if (btn instanceof HTMLButtonElement) {
          const rect = btn.children[0].children[1].children[0]
            .children[0] as HTMLElement;

          gsap.to(rect, {
            overwrite: "auto",
            scaleY: state === "open" ? 1 : 0,
            ease: "power2.out",
            duration: 0.4,
          });
        }
      };

      // Animating the corners and label & button
      const labelBtnAnimation = (e: HTMLLabelElement | HTMLButtonElement) => {
        if (!cornersRef.current) return;

        // Getting the corners and get the flip state from it
        flipState.current = Flip.getState(cornersRef.current);
        const checkParent = cornersRef.current.parentElement?.id;

        // Adding the corners
        e.appendChild(cornersRef.current as HTMLDivElement);

        // Check if the parent is initial-state-corners
        if (checkParent === "initial-state-corners") {
          Flip.from(flipState.current, {
            duration: 0,
            ease: "none",
            display: "block",
          });

          inputOpacityForLabel(e, "lighter");
          btnAnimation(e, "open");
        } else {
          Flip.from(flipState.current, {
            overwrite: true,
            duration: 0.3,
            ease: "power2.out",
          });

          labelBtnRefs.current.forEach((item) => {
            if (e === item) {
              inputOpacityForLabel(item, "lighter");
              btnAnimation(item, "open");
            } else {
              inputOpacityForLabel(item, "darker");
              btnAnimation(item, "close");
            }
          });
        }
      };

      // Function to handle the mouse entering the label & button
      const labelBtnHandleMouseEnterAndFocus = (ev: Event) => {
        const e = ev.target as
          | HTMLLabelElement
          | HTMLButtonElement
          | HTMLInputElement;

        if (e instanceof HTMLInputElement) {
          const label = e.parentElement as HTMLLabelElement;
          inputFocusedRef.current = e;
          labelBtnAnimation(label);
          return;
        }
        labelBtnAnimation(e);
      };

      // Function to handle the mouse leaving the form
      const formHandleMouseLeaveAndUnFocus = (ev: FocusEvent) => {
        // Getting the corners and get the flip state from it
        flipState.current = Flip.getState(cornersRef.current);

        // Check if the parent is initial-state-corners
        const checkParent = flipState.current.targets[0].parentElement?.id;
        if (checkParent === "initial-state-corners") return;

        // Changing the opacity
        labelBtnRefs.current.forEach((item) => {
          inputOpacityForLabel(item, "darker");
          btnAnimation(item, "close");
        });

        // Getting the form
        let formTarget: HTMLFormElement;

        if (
          ev.target instanceof HTMLInputElement ||
          ev.target instanceof HTMLButtonElement
        ) {
          // If the `relatedTarget` is null then the focus is on the input
          // And if the `aTag` isn't `a` tag
          const aTag = ev.relatedTarget instanceof HTMLAnchorElement;
          if (!aTag && ev.relatedTarget) return;

          // On Click/Touch/focus outside the form
          if (ev.target instanceof HTMLInputElement) {
            const input = ev.target;
            formTarget = input.parentElement?.parentElement
              ?.parentElement as HTMLFormElement;
            inputFocusedRef.current = null;
          } else {
            formTarget = ev.target.parentElement as HTMLFormElement;
            inputFocusedRef.current = null;
          }
        } else {
          // On Hover outside the form

          // If the `inputFocusedRef` is not null then the focus is on the input
          if (inputFocusedRef.current) {
            const label = inputFocusedRef.current
              .parentElement as HTMLLabelElement;
            labelBtnAnimation(label);

            // NOTE: There was a problelm: if the user use focus on the button and hover to an input and then hover outside the form,
            // the corners will appear on the last input registered in `inputFocusedRef.current` but not focus on it.
            gsap.to(cornersRef.current, {
              duration: 0.3,
              onComplete: () => {
                if (!inputFocusedRef.current) return;
                inputFocusedRef.current.focus();
              },
            });
            return;
          }

          formTarget = ev.target as HTMLFormElement;
        }

        const initialStateCorners = formTarget.childNodes[0] as HTMLDivElement;

        // Adding the corners
        initialStateCorners.appendChild(cornersRef.current as HTMLDivElement);
        Flip.from(flipState.current, {
          duration: 0,
          display: "none",
        });
      };

      labelBtnRefs.current.forEach((labelBtn) => {
        if (!labelBtn) return;
        labelBtn.addEventListener(
          "mouseenter",
          labelBtnHandleMouseEnterAndFocus,
        );

        if (labelBtn instanceof HTMLButtonElement) {
          const btn = labelBtnRefs.current.find(
            (btn) => btn instanceof HTMLButtonElement,
          ) as HTMLButtonElement;

          const rect = btn.children[0].children[1].children[0]
            .children[0] as HTMLElement;

          gsap.set(rect, {
            overwrite: "auto",
            scaleY: 0,
            ease: "power2.out",
            duration: 0.4,
          });

          btn.addEventListener("focus", labelBtnHandleMouseEnterAndFocus);
          return;
        }

        // Getting the input to detect focus
        const input = labelBtn.children[1] as HTMLInputElement;
        input.addEventListener("focus", labelBtnHandleMouseEnterAndFocus);
      });
      formContainer.addEventListener(
        "mouseleave",
        formHandleMouseLeaveAndUnFocus,
      );
      formContainer.addEventListener(
        "focusout",
        formHandleMouseLeaveAndUnFocus,
      );

      return () => {
        labelBtnRefs.current.forEach((labelBtn) => {
          if (!labelBtn) return;
          labelBtn.removeEventListener(
            "mouseenter",
            labelBtnHandleMouseEnterAndFocus,
          );

          if (labelBtn instanceof HTMLButtonElement) {
            const btn = labelBtnRefs.current.find(
              (btn) => btn instanceof HTMLButtonElement,
            ) as HTMLButtonElement;

            btn.removeEventListener("focus", labelBtnHandleMouseEnterAndFocus);
            return;
          }

          // Getting the input to detect focus
          const input = labelBtn.children[1] as HTMLInputElement;
          input.removeEventListener("focus", labelBtnHandleMouseEnterAndFocus);
        });
        formContainer.removeEventListener(
          "mouseleave",
          formHandleMouseLeaveAndUnFocus,
        );
        formContainer.removeEventListener(
          "focusout",
          formHandleMouseLeaveAndUnFocus,
        );
      };
    },
    { dependencies: [labelBtnRefs] },
  );

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
            ref={cornersRef}
            id="corners"
            style={{
              display: "none",
            }}
            className="absolute top-0 left-0 w-full h-full -z-50"
          >
            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-(--corner-color)" />
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-(--corner-color)" />
            <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-(--corner-color)" />
            <div className="absolute -right-1.5 -bottom-1.5 w-5 h-5 border-r-2 border-b-2 border-(--corner-color)" />
          </div>
        </div>
        <div>
          <label
            ref={(e) => {
              labelBtnRefs.current.push(e!);
            }}
            htmlFor="userName"
          >
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
          <label
            ref={(e) => {
              labelBtnRefs.current.push(e!);
            }}
            htmlFor="email"
          >
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
          <label
            ref={(e) => {
              labelBtnRefs.current.push(e!);
            }}
            htmlFor="message"
          >
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
          ref={(e) => {
            labelBtnRefs.current.push(e!);
          }}
          type="submit"
        >
          send
          <div className="masked-btn mask-[url(#mask-btn)]">
            <span>send</span>
            <svg>
              <mask id="mask-btn">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
              </mask>
            </svg>
          </div>
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
