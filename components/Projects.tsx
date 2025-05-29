"use client";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger, SplitText } from "gsap/all";
import projectsData from "../db/projects.json";
import { useRef } from "react";
import Image from "next/image";

const Projects = () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const projects = projectsData;

  const { contextSafe } = useGSAP();

  const projectContainerRef = useRef<HTMLAnchorElement[]>([]);

  useGSAP(() => {
    if (!projectContainerRef.current) return;

    // Height of the pinned container * the number of projects
    const pinnedHeight =
      projectContainerRef.current[0].offsetHeight * projects.length;

    // Last cycle
    let lastCycle = 0;

    ScrollTrigger.create({
      trigger: ".projects-pinned",
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
          gsap.to(projectContainerRef.current[currentCycle], {
            overwrite: "auto",
            scale,
            duration: 0.1,
          });

          // Animate the progress
          gsap.to("#progress", {
            overwrite: true,
            height: `${cycleProgress}%`,
            duration: 0,
          });

          // If the cycle progress is less than 1 and the direction is backward
          if (cycleProgress < 1 && self.direction > 0) {
            gsap.set("#progress", {
              height: "0%",
            });

            // Else if the cycle progress is greater than 99 and the direction is forward
          } else if (cycleProgress > 99 && self.direction < 0) {
            gsap.set("#progress", {
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
          gsap.to("#progress", {
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
        ease: "power2.inOut",
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
  });

  // Animate the first project (initial)
  useGSAP(() => {
    animateProjectEntery(projectContainerRef.current[0]);
    gsap.delayedCall(0.5, () => updateProjectTitle(0));
  });

  return (
    <section id="projects">
      <div className="projects-pinned">
        <h2>projects</h2>
        <div className="projects-container">
          <p id="project-title"></p>
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
