import Image from "next/image";

const OurMission = () => {
  return (
    <section className="mt-12 px-4 sm:px-6 md:mt-24 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row lg:gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="h-7 w-4 rounded bg-[var(--site-accent)] sm:h-9 sm:w-5" />
            <h1
              className="text-[40px] font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]"
              style={{ fontFamily: "cursive" }}
            >
              Our Mission
            </h1>
          </div>
          <div className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl lg:text-[26px]">
            Why does Walk Throughz exist today?
          </div>
          <div className="mt-4 hyphens-auto text-sm font-normal leading-[150%] text-white sm:mt-5 sm:text-base lg:text-[17x]">
            Our mission is to make cities feel discoverable again. We want to
            connect people more closely with local spaces and build lasting
            relationships with places through shared expertise, passion, and
            personality. Walk Throughz brings like-minded people together in a
            more natural, low-pressure way and encourages conversations around
            topics that inspire. We want to push back against cities feeling
            anonymous and flat, and instead keep them active, human, and full
            of energy.
          </div>
        </div>

        <div className="flex flex-1 justify-center lg:justify-end">
          <Image
            src="/assets/Unsere_Mission.jpg"
            alt="Walk Throughz mission"
            height={1000}
            width={1000}
            className="h-auto w-full max-w-[470px] rounded-xl object-cover sm:h-[650px]"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default OurMission;
