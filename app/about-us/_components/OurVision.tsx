import Image from "next/image";

const OurVision = () => {
  return (
    <section className="mt-12 px-4 sm:px-6 md:mt-24 lg:px-8">
      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:gap-14">
        <div className="relative flex flex-1 justify-center lg:justify-start">
          <Image
            src="/assets/newcontact1.jpg"
            alt="Walk Throughz vision"
            height={468}
            width={400}
            className="h-auto w-full max-w-[400px] rounded-xl object-cover sm:h-[468px]"
            priority
          />
          <Image
            src="/assets/newcontact2.jpg"
            alt="Walk Throughz community"
            height={1000}
            width={1000}
            className="absolute bottom-[-100px] left-[250px] z-10 hidden h-[400px] w-[200px] rounded-xl object-cover xl:block xl:w-[300px]"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="h-7 w-4 rounded bg-[var(--site-accent)] sm:h-9 sm:w-5" />
            <h1
              className="text-[40px] font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]"
              style={{ fontFamily: "cursive" }}
            >
              Our Vision
            </h1>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl lg:text-[26px]">
            What does Walk Throughz want to build over time?
          </h3>
          <p className="mt-4 hyphens-auto text-sm font-normal leading-[150%] text-white sm:mt-5 sm:text-base lg:text-[17px]">
            We imagine cities that are not just inhabited, but genuinely lived
            in by people who feel connected to something bigger than
            themselves. In the long run, Walk Throughz aims to create a culture
            of openness, curiosity, and local participation. We want it to grow
            across many cities as a network for urban inspiration, small
            discoveries, and real connection. The more people share, the more a
            city starts to give back.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurVision;
