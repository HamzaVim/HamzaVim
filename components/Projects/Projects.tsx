"use client";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger, SplitText } from "gsap/all";
import projectsData from "../../db/projects.json";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGlobal } from "@/context/GlobalContext";

const Projects = () => {
  // NOTE: States & Refs: ---------------------------------------------------

  // Set the projects
  const projects = projectsData;

  // Ref: Projects elements
  const projectContainerRef = useRef<HTMLAnchorElement[]>([]);

  const { setLoading } = useGlobal();

  // Ref: Img elements & images loaded
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const imagesLoadedRef = useRef<number[]>([]);

  // GSAP: ContextSafe for functions outside useGSAP
  const { contextSafe } = useGSAP();

  // NOTE: Functions & Animations: ---------------------------------------------------

  // Animation: Pinned container
  useGSAP(() => {
    if (!projectContainerRef.current) return;

    // Height of the pinned container * the number of projects
    const pinnedHeight =
      projectContainerRef.current[0].offsetHeight * projects.length;

    // Last cycle
    let lastCycle = 0;

    ScrollTrigger.create({
      trigger: "#projects .projects-pinned",
      start: "bottom bottom",
      end: `+=${pinnedHeight * 2}`,
      scrub: 0.1,
      pin: true,
      pinSpacing: true,
      fastScrollEnd: true, // For better performance when the user scrolls fast
      onUpdate: (self) => {
        // Progress, Current cycle, Cycle progress
        const totalProgress = self.progress * projects.length;
        const currentCycle = Math.floor(totalProgress);
        const cycleProgress = (totalProgress % 1) * 100;

        // If the current cycle is less than the number of projects
        if (currentCycle < projects.length) {
          // Animate the scale
          const scale = 1 - (0.25 * cycleProgress) / 100;
          gsap.to([projectContainerRef.current[currentCycle], ".img-empty"], {
            overwrite: "auto",
            scale,
            duration: 0.1,
          });

          // Animate the progress
          gsap.to("#progress, .projects .progress", {
            overwrite: true,
            height: `${cycleProgress}%`,
            duration: 0,
          });

          // If the cycle progress is less than 1 and the direction is backward
          if (cycleProgress < 1 && self.direction > 0) {
            gsap.set("#progress, .projects .progress", {
              height: "0%",
            });

            // Else if the cycle progress is greater than 99 and the direction is forward
          } else if (cycleProgress > 99 && self.direction < 0) {
            gsap.set("#progress, .projects .progress", {
              height: "100%",
            });
          }

          // If the current cycle is different from the last cycle
          if (currentCycle !== lastCycle) {
            // If the direction is forward
            if (self.direction > 0) {
              // If the last cycle is less than the number of projects
              if (lastCycle < projects.length) {
                animateProjectExitForward(
                  projectContainerRef.current[lastCycle],
                );

                // If the current cycle is less than the number of projects
                if (currentCycle < projects.length) {
                  animateProjectEntery(
                    projectContainerRef.current[currentCycle],
                  );
                  gsap.delayedCall(0.5, () => updateProjectTitle(currentCycle));
                }
              }

              // Else if the direction is backward
            } else {
              // If the current cycle is less than the number of projects
              if (currentCycle < projects.length) {
                animateProjectEntery(projectContainerRef.current[currentCycle]);
                gsap.delayedCall(0.5, () => updateProjectTitle(currentCycle));
              }

              // If the last cycle is less than the number of projects
              if (lastCycle < projects.length) {
                animateProjectExitBackward(
                  projectContainerRef.current[lastCycle],
                );
              }
            }

            // Update the last cycle
            lastCycle = currentCycle;
          }

          // Else if the current cycle is greater than the number of projects or equal to the number of projects
        } else {
          gsap.to("#progress, .projects .progress", {
            overwrite: true,
            height: self.progress > 0 ? "100%" : `${cycleProgress}%`,
            duration: 0.1,
          });
        }
      },
    });
  });

  // Animation: Project entery
  const animateProjectEntery = contextSafe((project: HTMLAnchorElement) => {
    gsap.fromTo(
      project,
      {
        scale: 1.25,
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        opacity: 0,
        visibility: "hidden",
      },
      {
        overwrite: true, // To avoid conflicts
        scale: 1,
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        opacity: 1,
        visibility: "visible",
        duration: 1,
        ease: "power2.inOut",
      },
    );

    gsap.fromTo(
      project.children[0],
      {
        filter: "contrast(2) brightness(10) blur(5px)",
      },
      {
        filter: "contrast(1) brightness(1) blur(0px)",
        duration: 1,
        ease: "power2.inOut",
      },
    );
  });

  // Animation: Project exit (Forward)
  const animateProjectExitForward = contextSafe(
    (project: HTMLAnchorElement) => {
      gsap.to(project, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });

      gsap.to(project, {
        visibility: "hidden",
        delay: 1,
      });
    },
  );

  // Animation: Project exit (Backward)
  const animateProjectExitBackward = contextSafe(
    (project: HTMLAnchorElement) => {
      gsap.to(project, {
        scale: 1.5,
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power2.inOut",
      });

      // Hide the image project
      gsap.to(project, {
        visibility: "hidden",
        delay: 1,
      });

      gsap.to(project.children[0], {
        filter: "contrast(2) brightness(10) blur(5px)",
        duration: 1,
        ease: "power2.inOut",
      });
    },
  );

  // Update the project title
  const updateProjectTitle = contextSafe((index: number) => {
    if (!projectContainerRef.current) return;

    // Reset the project title
    const projectTitle = gsap.utils.toArray(
      "#project-title",
    )[0] as HTMLParagraphElement;
    projectTitle.innerHTML = "";

    // Set the opacity to 0
    gsap.set(projectTitle, {
      opacity: 0,
    });

    // Get the project data and set the title
    const data = projects[index];
    projectTitle.innerText = data.title;

    // Split the title
    const split = SplitText.create(projectTitle, {
      type: "chars",
    });

    // Set the opacity of the chars to 0 and set the opacity of the title to 1
    gsap.set(split.chars, {
      opacity: 0,
    });
    gsap.set(projectTitle, {
      opacity: 1,
    });

    // Animate the chars
    gsap.to(split.chars, {
      opacity: 1,
      duration: 0.01,
      stagger: 0.04,
      ease: "power1.inOut",
    });

    const maskedTitle = gsap.utils.toArray(
      ".projects .project-title",
    )[0] as HTMLParagraphElement;

    maskedTitle.innerText = data.title;
  });

  // Check if the images are loaded
  useEffect(() => {
    if (!imagesRef.current) return;

    // Get the images
    const images = imagesRef.current;

    // Function: Check if the images are loaded
    const checkComplete = () => {
      if (imagesLoadedRef.current.length !== projects.length) return;

      // Set loading to false
      setLoading(false);
    };

    // Function: Handle the load event
    const handleLoad = (ev: Event) => {
      const image = ev.target as HTMLImageElement;

      // If the image is already loaded, skip
      if (imagesLoadedRef.current.includes(imagesRef.current.indexOf(image)))
        return;

      imagesLoadedRef.current.push(imagesRef.current.indexOf(image));
      checkComplete();
    };

    // Loop over images
    images.forEach((image) => {
      // If the image is loaded
      if (image.complete) {
        imagesLoadedRef.current.push(imagesRef.current.indexOf(image));
        checkComplete();
        return;
      }

      // Else add an event listener `load`
      image.addEventListener("load", handleLoad);
    });

    return () => {
      images.forEach((image) => {
        image.removeEventListener("load", handleLoad);
      });
    };
  }, [projects.length, setLoading]);

  return (
    <section id="projects">
      <div className="projects-pinned">
        <h2>projects</h2>
        <div className="projects-container">
          <p id="project-title">{projects[0].title}</p>
          <div className="projects-list">
            {projects.map((project, index) => {
              return (
                <a
                  href={`#project-${project.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  target="_blank"
                  key={index}
                  ref={(el) => {
                    projectContainerRef.current.push(el!);
                  }}
                  style={{
                    zIndex: projects.length - index,
                  }}
                >
                  <Image
                    ref={(el) => {
                      if (!el || imagesRef.current.includes(el)) return;
                      imagesRef.current.push(el!);
                    }}
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    sizes="100vw"
                  />
                </a>
              );
            })}

            <div className="progress-bar">
              <div id="progress" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
