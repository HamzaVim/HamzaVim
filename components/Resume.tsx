import { useGlobal } from "@/context/GlobalContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RiDownloadCloud2Line } from "react-icons/ri";

// Img sources.
const IMAGES = process.env.NEXT_PUBLIC_IMAGES_URLS as string;
const IMAGES_URLS = IMAGES.split(",");

// Load image api link.
const LOAD_IMAGE_API = process.env.NEXT_PUBLIC_LOAD_IMAGE_API;

// Masked version
const ResumeMasked = () => (
  <div className="resume">
    <div className="image-resuem-container">
      <div className="image-container">
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
        <h4>Professional Summary</h4>
        <p>
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
          My skills in animation and styling further enhance the user experience
          and engagement of the products I create.
        </p>
      </div>
      <div className="work-experience">
        <h4>Work Experience</h4>
        <p>
          <span className="work-title">
            Front-End Developer (CSS Specialist)
            <br />
            Upwork Freelance Contract | [ Nov 17 / 2024 ] - Present
          </span>
          <br />
          <span className="work-client">Client: Katy (United States)</span>
          <br />
        </p>
        <ul>
          <li>
            Provided real-time CSS debugging and styling solutions during live
            walkthrough sessions.
          </li>
          <li>
            Rapidly implemented client-requested visual enhancements to improve
            website appearance.
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
        <div>
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
        <div>
          <h4>Language</h4>
          <ul>
            <li>Arabic (Fluent)</li>
            <li>English (Advanced)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
const Resume = ({ masked }: { masked?: boolean }) => {
  // NOTE: States & Refs: ---------------------------------------------------

  // State: Initial image reveal.
  const [initialImgReveal, setInitialImgReveal] = useState(false);

  // Ref: Img elements & images loaded.
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const imagesLoadedRef = useRef<number[]>([]);

  // Ref: Img index for animation.
  const imgIndex = useRef(0);

  const {
    setLoading,
    loading,
    cursorHoverIn,
    cursorHoverOut,
    cursorHoverVanish,
  } = useGlobal();

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Animation: Handle image change.
  /**
   * Animation: Handle image change
   * - Manage the current image index in `imgIndex`
   */
  useGSAP(
    () => {
      if (!initialImgReveal || masked) return;

      const overlayImg = gsap.utils.toArray(".image-overlay")[
        masked ? 1 : 0
      ] as HTMLDivElement;

      // Skip if the overlay image is not found
      if (!overlayImg) return;

      const imgsParent = imagesRef.current.map((img) => img.parentElement); // Get all parent elements of images

      // Function to change t

      /**
       * Handle image change by
       * - Manage the current image index in `imgIndex` to make the current image hidden and after incrementing the `imgIndex` (next image) the image will be visible
       */
      const changeImg = () => {
        if (imgIndex.current === IMAGES_URLS.length - 1) {
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
      gsap.delayedCall(3, () => {
        gsap
          .timeline({
            defaults: {
              repeat: -1,
              repeatDelay: 3, // Repeat the animation every 3 seconds
              ease: "power3.out",
            },
          })
          .set(overlayImg, {
            xPercent: 0,
          })
          .to(overlayImg, {
            xPercent: -100,
            duration: 0.5,
          })
          .to(overlayImg, {
            xPercent: -200,
            duration: 0.5,
            onStart: () => changeImg(), // on animation start call the `changeImg` function.
            onRepeat: () => changeImg(), // on animation repeat call the `changeImg` function.
          });
      });
    },
    { dependencies: [initialImgReveal] }, // Run the animation when the `initialImgReveal` state changes
  );

  /**
   * Animation: Image reveal when the page is loaded (one time use)
   * - Manage the `initialImgReveal` state
   */
  useGSAP(
    () => {
      if (!imagesRef.current || loading || masked) return;

      const overlayImg = gsap.utils.toArray(".image-overlay")[
        masked ? 1 : 0
      ] as HTMLDivElement;

      // Skip if the overlay image is not found
      if (!overlayImg) return;

      const imgParent = imagesRef.current[0].parentElement; // Get the first image parent.

      // Animate the overlay to reveal the first image.
      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })
        .from(overlayImg, {
          xPercent: 0,
        })
        .to(overlayImg, {
          xPercent: -100,
          delay: 1.1,
          duration: 0.5,
          onComplete: () => {
            gsap.set(imgParent, {
              visibility: "visible",
            });
          },
        })
        .to(overlayImg, {
          xPercent: -200,
          duration: 0.5,
          onComplete: () => {
            setInitialImgReveal(true);
          },
        });
    },
    { dependencies: [loading] },
  );

  /**
   * Tracks image loading state and handles completion logic
   * - Manages `loading` state
   * - Scrolls to the top when the `loading` state changed to false
   */
  useEffect(() => {
    if (!imagesRef.current || masked) return;

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
      if (loadedIndices.length !== IMAGES_URLS.length) return;

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

  // Masked Resume section
  if (masked) return <ResumeMasked />;

  return (
    <section id="resume">
      <div className="image-resuem-container">
        <div
          onMouseEnter={cursorHoverVanish}
          onMouseLeave={cursorHoverOut}
          className="image-container"
        >
          {IMAGES_URLS.map((src, index) => (
            <div
              key={index}
              className="image-holder"
              style={{
                zIndex: IMAGES_URLS.length - index,
                visibility: "hidden",
                position: index === 0 ? "relative" : "absolute",
                top: index === 0 ? "" : "0",
                left: index === 0 ? "" : "0",
              }}
            >
              <Image
                src={`${LOAD_IMAGE_API}${src}`}
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
          <div
            className="image-overlay"
            style={{
              transform: "translateX(100%)",
            }}
          />
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
          <h4 onMouseEnter={cursorHoverIn} onMouseLeave={cursorHoverOut}>
            Professional Summary
          </h4>
          <p onMouseEnter={cursorHoverIn} onMouseLeave={cursorHoverOut}>
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
          <h4 onMouseEnter={cursorHoverIn} onMouseLeave={cursorHoverOut}>
            Work Experience
          </h4>
          <p onMouseEnter={cursorHoverIn} onMouseLeave={cursorHoverOut}>
            <span className="work-title">
              Front-End Developer (CSS Specialist)
              <br />
              Upwork Freelance Contract | [ Nov 17 / 2024 ] - Present
            </span>
            <br />
            <span className="work-client">Client: Katy (United States)</span>
            <br />
          </p>
          <ul onMouseEnter={cursorHoverIn} onMouseLeave={cursorHoverOut}>
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
          <div onMouseEnter={cursorHoverIn} onMouseLeave={cursorHoverOut}>
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
          <div onMouseEnter={cursorHoverIn} onMouseLeave={cursorHoverOut}>
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
