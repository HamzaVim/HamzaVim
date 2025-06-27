import { useRef } from "react";

const ListItem = ({
  title, // Original title
  body, // paragraph text
}: {
  title: string;
  body: string;
}) => {
  // NOTE: States & Refs: ---------------------------------------------------

  // Ref: li
  const liRef = useRef<HTMLLIElement>(null);

  // NOTE: Functions & Animations: ---------------------------------------------------

  return (
    <li ref={liRef}>
      <div className="text-container">
        <span>{title}</span>
      </div>

      <div className="text-container-masked">
        <p dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </li>
  );
};

const WhyMeMask = () => (
  <div className="why-me">
    <h2>why me</h2>
    <ul>
      <ListItem
        title="Custom Solutions"
        body="The idea of one-size-fits-all does not appeal to me. In every project,<br /> I know exactly what it is and how to implement the right solution just the way you want it."
      />
      <ListItem
        title="Full-Stack Expertise"
        body="As both a UX/UI designer and developer, I bridge the gap between design and functionality,<br /> ensuring a seamless user experience."
      />
      <ListItem
        title="Modern Tech"
        body="I specialize in Next.js, React, and Tailwind CSS for fast, responsive, and scalable websites."
      />
      <ListItem
        title="Fast & Responsive"
        body="Your site will look fantastic and work perfectly on any device."
      />
      <ListItem
        title="Your Vision, Delivered"
        body="Your vision is my priority. I work closely with you to bring your ideas to life."
      />
    </ul>
  </div>
);

export default WhyMeMask;
