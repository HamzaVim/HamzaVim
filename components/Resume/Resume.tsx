import { useGlobal } from "@/context/GlobalContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RiDownloadCloud2Line } from "react-icons/ri";

// Img sources.
const IMAGES_SRC = [
  "/images/hamza/1.png",
  "/images/hamza/2.jpg",
  "/images/hamza/3.jpg",
  "/images/hamza/4.jpg",
];

// Type: Animate overlay
type AnimateOverlay = (
  overlayImg: HTMLDivElement,
  imgParent: HTMLElement,
) => void;

const Resume = () => {
  // NOTE: States & Refs: ---------------------------------------------------

  const { contextSafe } = useGSAP();

  // State: Initial image reveal.
  const [initialImgReveal, setInitialImgReveal] = useState(false);
  const initialImgRevealRef = useRef(false);

  // Ref: Img elements & images loaded.
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const imagesLoadedRef = useRef<number[]>([]);

  const tlImgOverlay = useRef<gsap.core.Timeline>(null);

  // Ref: Img index for animation.
  const imgIndex = useRef(0);

  const {
    setLoading,
    loading,
    screenResizing,
    cursorHoverIn,
    cursorHoverOut,
    cursorHoverVanish,
    hasCursor,
  } = useGlobal();

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Update the `initialImgRevealRef`
  useEffect(() => {
    initialImgRevealRef.current = initialImgReveal;
  }, [initialImgReveal]);

  /**
   * Animation: Handle image change
   * - Manage the current image index in `imgIndex`
   */
  useGSAP(
    () => {
      if (!initialImgReveal) return;

      const overlayImg = gsap.utils.toArray(
        "#resume .image-overlay",
      )[0] as HTMLDivElement;

      // Skip if the overlay image is not found
      if (!overlayImg) return;

      const imgsParent = imagesRef.current.map((img) => img.parentElement); // Get all parent elements of images

      /**
       * Handle image change by
       * - Manage the current image index in `imgIndex` to make the current image hidden and after incrementing the `imgIndex` (next image) the image will be visible
       */
      const changeImg = () => {
        if (imgIndex.current === IMAGES_SRC.length - 1) {
          // The `imgIndex` has reached the last image

          gsap.set(imgsParent[imgIndex.current], {
            visibility: "hidden",
          });

          imgIndex.current = 0; // Reset the `imgIndex`

          gsap.set(imgsParent[imgIndex.current], {
            visibility: "visible",
          });
        } else {
          gsap.set(imgsParent[imgIndex.current], {
            visibility: "hidden",
          });

          imgIndex.current++; // Increment the `imgIndex`

          gsap.set(imgsParent[imgIndex.current], {
            visibility: "visible",
          });
        }
      };

      // Animate the overlay after 3 seconds
      tlImgOverlay.current = gsap
        .timeline({
          delay: 3,
          repeat: -1,
          repeatDelay: 3, // Repeat the animation every 3 seconds
          defaults: {
            ease: "power3.out",
          },
        })
        .set(overlayImg, {
          xPercent: 100,
        })
        .to(overlayImg, {
          xPercent: 0,
          duration: 0.5,
          onComplete: changeImg,
        })
        .to(overlayImg, {
          xPercent: -100,
          duration: 0.5,
        });
    },
    { dependencies: [initialImgReveal] }, // Run the animation when the `initialImgReveal` state changes
  );

  // Animation: Animate overlay
  const animateOverlay: AnimateOverlay = contextSafe(
    (overlayImg, imgParent) => {
      if (initialImgRevealRef.current) {
        // If the function is called when the initial image reveal is true, it means the screen is resizing

        if (tlImgOverlay.current) {
          // If the `tlImgOverlay` is not null (killed), kill it
          tlImgOverlay.current.kill();
          tlImgOverlay.current = null;
        }

        // Reset everything to initial state
        gsap.set(".image-holder", {
          visibility: "hidden",
        });
        gsap.set(overlayImg, {
          clearProps: "transform",
          visibility: "hidden",
        });
        gsap.set(overlayImg, {
          xPercent: 100,
        });

        // Reset the `imgIndex`
        imgIndex.current = 0;

        setInitialImgReveal(false);
      }

      // Animate the overlay to reveal the first image.
      tlImgOverlay.current = gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })
        .set(overlayImg, {
          xPercent: 100,
          visibility: "visible",
        })
        .to(overlayImg, {
          xPercent: 0,
          delay: 1.1,
          duration: 0.5,
          onComplete: () => {
            gsap.set(imgParent, {
              visibility: "visible",
            });
          },
        })
        .to(overlayImg, {
          xPercent: -100,
          duration: 0.5,
          onComplete: () => {
            setInitialImgReveal(true);
          },
        });
    },
  );

  useGSAP(
    () => {
      if (loading || screenResizing) return;

      const overlayImg = gsap.utils.toArray(
        "#resume .image-overlay",
      )[0] as HTMLDivElement;
      const imgParent = imagesRef.current[0].parentElement; // Get the first image parent.

      // Skip if the overlay image is not found
      if (!overlayImg || !imgParent) return;

      animateOverlay(overlayImg, imgParent);
    },
    { dependencies: [screenResizing] },
  );

  /**
   * Animation: Image reveal when the page is loaded (one time use)
   * - Manage the `initialImgReveal` state
   */
  useGSAP(
    () => {
      if (!imagesRef.current || screenResizing || loading) return;

      const overlayImg = gsap.utils.toArray(
        "#resume .image-overlay",
      )[0] as HTMLDivElement;
      const imgParent = imagesRef.current[0].parentElement; // Get the first image parent.

      // Skip if the overlay image is not found
      if (!overlayImg || !imgParent) return;

      animateOverlay(overlayImg, imgParent);
    },
    { dependencies: [loading] },
  );

  /**
   * Tracks image loading state and handles completion logic
   * - Manages `loading` state
   * - Scrolls to the top when the `loading` state changed to false
   */
  useEffect(() => {
    if (!imagesRef.current) return;

    const imageElements = imagesRef.current; // Get the images
    const { current: loadedIndices } = imagesLoadedRef; // Track loaded image indices

    /**
     * Marks the image as loaded and checks if the images are loaded
     * @param image - The loaded image
     */
    const pushLoadedImages = (image: HTMLImageElement) => {
      loadedIndices.push(imageElements.indexOf(image));
      checkComplete();
    };

    /**
     * Checks if all images are loaded and updates the `loading` state
     */
    const checkComplete = () => {
      if (loadedIndices.length !== IMAGES_SRC.length) return;

      setLoading(false);
      gsap.to(window, {
        scrollTo: 0,
      });
    };

    /**
     * Event handler for image `load` event
     */
    const handleLoad = (ev: Event) => {
      // Get the image
      const image = ev.target as HTMLImageElement;

      // Skip if already tracked
      if (loadedIndices.includes(imageElements.indexOf(image))) return;

      pushLoadedImages(image);
    };

    // Add event listener to each image
    imageElements.forEach((image) => {
      if (image.complete) {
        // Already loaded image
        pushLoadedImages(image);
      } else {
        // Add an event listener `load`
        image.addEventListener("load", handleLoad);
      }
    });

    // Clean up
    return () => {
      imageElements.forEach((image) => {
        image.removeEventListener("load", handleLoad);
      });
    };
  });

  return (
    <section id="resume">
      <div className="image-resuem-container">
        <div
          onMouseEnter={() => {
            if (!hasCursor) return;
            cursorHoverVanish();
          }}
          onMouseLeave={() => {
            if (!hasCursor) return;
            cursorHoverOut();
          }}
          className="image-container"
        >
          {IMAGES_SRC.map((src, index) => (
            <div
              key={index}
              className="image-holder"
              style={{
                zIndex: IMAGES_SRC.length - index,
                visibility: "hidden",
                position: index === 0 ? "relative" : "absolute",
                top: index === 0 ? "" : "0",
                left: index === 0 ? "" : "0",
              }}
            >
              <Image
                src={src}
                ref={(el) => {
                  if (!el) return;
                  imagesRef.current.push(el);
                }}
                fill
                sizes="100%"
                alt="Hamza Hassen image"
                priority
                quality={100}
              />
            </div>
          ))}
          <div className="image-overlay" />
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://drive.google.com/file/d/1Dkg0nXljt-65HVlZr7m0aDZ4b84mbOJn/view?usp=sharing"
          download="Hamza's_resume.pdf"
        >
          <RiDownloadCloud2Line />
        </a>
      </div>
      <div className="resume-container">
        <div>
          <h4
            onMouseEnter={() => {
              if (!hasCursor) return;
              cursorHoverIn();
            }}
            onMouseLeave={() => {
              if (!hasCursor) return;
              cursorHoverOut();
            }}
          >
            Professional Summary
          </h4>
          <p
            onMouseEnter={() => {
              if (!hasCursor) return;
              cursorHoverIn();
            }}
            onMouseLeave={() => {
              if (!hasCursor) return;
              cursorHoverOut();
            }}
          >
            I am an Ethiopian professional, born and raised in Saudi Arabia,
            currently residing in Ethiopia. I am fluent in both Arabic and
            English, offering services in web design, web development,
            programming, animation, and styling.
            <br />
            With over six years of experience as a creative React developer, I
            specialize in crafting user-friendly and visually appealing
            interfaces, as well as dynamic web applications. I have a strong
            command of JavaScript, React, and Next.js, and I possess hands-on
            expertise in developing solutions that prioritize user satisfaction.
            My skills in animation and styling further enhance the user
            experience and engagement of the products I create.
          </p>
        </div>
        <div className="work-experience">
          <h4
            onMouseEnter={() => {
              if (!hasCursor) return;
              cursorHoverIn();
            }}
            onMouseLeave={() => {
              if (!hasCursor) return;
              cursorHoverOut();
            }}
          >
            Work Experience
          </h4>
          <p
            onMouseEnter={() => {
              if (!hasCursor) return;
              cursorHoverIn();
            }}
            onMouseLeave={() => {
              if (!hasCursor) return;
              cursorHoverOut();
            }}
          >
            <span className="work-title">
              Front-End Developer (CSS Specialist)
              <br />
              Upwork Freelance Contract | [ Nov 17 / 2024 ] - Present
            </span>
            <br />
            <span className="work-client">Client: Katy (United States)</span>
            <br />
          </p>
          <ul
            onMouseEnter={() => {
              if (!hasCursor) return;
              cursorHoverIn();
            }}
            onMouseLeave={() => {
              if (!hasCursor) return;
              cursorHoverOut();
            }}
          >
            <li>
              Provided real-time CSS debugging and styling solutions during live
              walkthrough sessions.
            </li>
            <li>
              Rapidly implemented client-requested visual enhancements to
              improve website appearance.
            </li>
            <li>
              Collaborated directly with the client to identify and resolve
              front-end styling issues.
            </li>
            <li>
              Delivered immediate fixes for responsive design problems and
              cross-browser inconsistencies.
            </li>
            <li>
              Worked under tight deadlines to complete CSS modifications during
              active development.
            </li>
          </ul>
        </div>
        <div>
          <div
            onMouseEnter={() => {
              if (!hasCursor) return;
              cursorHoverIn();
            }}
            onMouseLeave={() => {
              if (!hasCursor) return;
              cursorHoverOut();
            }}
          >
            <h4>Expertise</h4>
            <ul>
              <li>HTML</li>
              <li>CSS</li>
              <li>JavaScript</li>
              <li>TypeScript</li>
              <li>React</li>
              <li>Next.js</li>
              <li>Tailwind</li>
              <li>Animation</li>
            </ul>
          </div>
          <div
            onMouseEnter={() => {
              if (!hasCursor) return;
              cursorHoverIn();
            }}
            onMouseLeave={() => {
              if (!hasCursor) return;
              cursorHoverOut();
            }}
          >
            <h4>Language</h4>
            <ul>
              <li>Arabic (Fluent)</li>
              <li>English (Advanced)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
