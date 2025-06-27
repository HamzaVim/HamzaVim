import { RiDownloadCloud2Line } from "react-icons/ri";

const ResumeMask = () => {
  return (
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
            My skills in animation and styling further enhance the user
            experience and engagement of the products I create.
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
};

export default ResumeMask;
