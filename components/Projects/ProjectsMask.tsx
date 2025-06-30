import { useGSAP } from "@gsap/react";
import projectsData from "../../db/projects.json";
import gsap, { ScrollTrigger } from "gsap/all";

const ProjectsMask = () => {
  // Set the projects
  const projects = projectsData;

  useGSAP(() => {
    const pinnedHeight = gsap.getProperty("#projects .pin-spacer", "height");

    ScrollTrigger.create({
      trigger: ".projects .projects-pinned",
      start: "bottom bottom",
      end: `+=${pinnedHeight}`,
      scrub: 0.1,
      pin: true,
      pinSpacing: true,
      fastScrollEnd: true, // For better performance when the user scrolls fast
    });
  });

  return (
    <div className="projects">
      <div className="projects-pinned">
        <h2>projects</h2>
        <div className="projects-container">
          <p className="project-title">{projects[0].title}</p>
          <div className="projects-list">
            <div className="img-empty" />

            <div className="progress-bar">
              <div className="progress" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsMask;
