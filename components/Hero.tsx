import Image from "next/image";

const Hero = ({ masked }: { masked?: boolean }) => {
  // Masked Hero section
  if (masked)
    return (
      <section className="w-screen h-dvh">
        <div className="w-full h-full text-center uppercase text-(--black) text-nowrap flex flex-col items-center justify-center gap-7 select-none pointer-events-none">
          <p className="font-bold text-xl text-(length:--text-name)">
            hamza hassen
          </p>
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
    <section className="w-screen h-dvh">
      {/* Container for image */}
      <div className="w-screen h-dvh absolute -z-10">
        {/* Overlay */}
        <div className="w-full h-full bg-linear-to-t from-(--black) from-5% to-(--black)/50 absolute z-10 hidden lg:block" />
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
          className="object-cover object-center hidden sm:block lg:hidden"
          sizes="100vw"
          quality={100}
        />
        {/* Desktop */}
        <Image
          src="/images/hero-desktop.png"
          alt="hero image"
          fill
          className="object-cover object-top-left hidden lg:block"
          sizes="100vw"
          quality={100}
        />
      </div>
      <div className="w-full h-full text-center uppercase text-(--white) text-nowrap flex flex-col items-center justify-center gap-7 select-none pointer-events-none">
        <p className="font-bold text-xl text-(length:--text-name)">
          hamza hassen
        </p>
        <h1>
          creating
          <br />
          <span className="text-(--secondary)">
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
