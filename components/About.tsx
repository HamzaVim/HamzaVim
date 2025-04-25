const About = ({ masked }: { masked?: boolean }) => {
  // Masked About section
  if (masked)
    return (
      <section className="w-screen h-dvh bg-(--secondary) px-[1.3rem] sm:px-12 md:px-24 lg:px-40 2xl:px-0 overflow-hidden">
        <div className="w-full h-full text-nowrap flex flex-col items-start 2xl:items-center justify-center gap-7">
          <div className="text-left text-(--black) flex flex-col 2xl:gap-7 gap-4">
            <h2>about me</h2>
            <p className="text-(length:--text-about)/[135%] md:leading-[125%] lg:leading-[115%] xl:leading-[102%] tracking-[-0.5%] font-extrabold 2xl:text-nowrap text-wrap">
              Your web developer who <br className="hidden 2xl:block" />
              codes with purpose – crafting fast,{" "}
              <br className="hidden 2xl:block" />
              effective solutions while relentlessly{" "}
              <br className="hidden 2xl:block" />
              pursuing excellence for your <br className="hidden 2xl:block" />
              business.
            </p>
          </div>
        </div>
      </section>
    );
  return (
    <section className="w-screen h-dvh px-[1.3rem] sm:px-12 md:px-24 lg:px-40 2xl:px-0 overflow-hidden">
      <div className="w-full h-full text-nowrap flex flex-col items-start 2xl:items-center justify-center gap-7">
        <div className="text-left text-(--white) flex flex-col 2xl:gap-7 gap-4">
          <h2>about me</h2>
          <p className="text-(--white-green) text-(length:--text-about)/[135%] md:leading-[125%] lg:leading-[115%] xl:leading-[102%] tracking-[-0.5%] font-extrabold 2xl:text-nowrap text-wrap">
            I&apos;m a{" "}
            <span className="text-(--secondary)">skilled web developer</span>{" "}
            that <br className="hidden 2xl:block" />
            creates powerful digital solutions.{" "}
            <br className="hidden 2xl:block" />
            Every obstacle overcome and <br className="hidden 2xl:block" />
            every line of code created is a step{" "}
            <br className="hidden 2xl:block" />
            closer to perfection.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
