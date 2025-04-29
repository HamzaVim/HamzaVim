import Image from "next/image";

const Hero = ({ masked }: { masked?: boolean }) => {
  // Masked Hero section
  if (masked)
    return (
      <section className="w-screen h-dvh">
        <div className="flex flex-col gap-7 justify-center items-center w-full h-full text-center text-black uppercase pointer-events-none select-none text-nowrap">
          <p className="text-xl font-bold text-name">hamza hassen</p>
          <h1>
            designing
            <br />
            stunning
            <br />
            websites in
            <br />
            any style
            <br />
            you imagine
          </h1>
        </div>
      </section>
    );
  return (
    <section className="overflow-hidden relative w-screen h-dvh">
      {/* Container for image */}
      <div className="absolute w-screen h-dvh -z-10">
        {/* Overlay */}
        <div className="hidden absolute z-10 top-[0%] w-full h-full lg:block bg-linear-to-t from-black/55 to-black/25" />
        {/* Mobile */}
        <Image
          src="/images/hero-phone.png"
          alt="hero image"
          fill
          className="object-cover sm:hidden"
          sizes="100vw"
          quality={100}
        />
        {/* Tablet */}
        <Image
          src="/images/hero-tablet.png"
          alt="hero image"
          fill
          className="hidden object-cover object-center sm:block lg:hidden"
          sizes="100vw"
          quality={100}
        />
        {/* Desktop */}
        <Image
          src="/images/hero-desktop.png"
          alt="hero image"
          fill
          className="hidden object-cover lg:block object-top-left"
          sizes="100vw"
          quality={100}
        />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center w-full h-full text-center uppercase pointer-events-none select-none lg:gap-7 text-nowrap">
        <p className="text-xl font-bold text-white text-name">hamza hassen</p>
        <h1>
          creating
          <br />
          <span className="text-secondary">
            beautiful
            <br />
            websites
          </span>
          <br />
          that reflect
          <br />
          your vision
        </h1>
      </div>
    </section>
  );
};

export default Hero;
