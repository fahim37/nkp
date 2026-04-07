"use client";
import ContactUsForm from "@/components/ContactUsFrom";
import OurMission from "./_components/OurMission";
import OurVision from "./_components/OurVision";
import { PageHeader } from "@/Shared/PageHeader";

const page = () => {
  return (
    <div>
      <PageHeader title="What Are We Building?" imge="/assets/about-us.png" />
      <div className="container mt-10 lg:mt-10">
        <div className="text-center">
          <h1 className="text-[25px] font-semibold text-white lg:text-[32px]">
            Walk Throughz is a platform for real city experiences
            <div>that feel local, personal, and alive.</div>
          </h1>

          <div className="mt-5 text-base leading-[150%] text-[#E0E0E0] lg:text-[18px]">
            We connect people with distinctive places and meaningful stories.
            <p>
              Whether it is a tour through a niche store, a look inside an
              independent label, or a short visit to a workshop, cafe, or
              creative space that is easy to miss, Walk Throughz brings out what
              makes each location memorable. Every Walk Through lasts roughly 30
              to 60 minutes and is shaped directly by the people who give the
              place its character. That creates a more human way to experience a
              city.
            </p>
          </div>
        </div>

        <div>
          <OurMission />
        </div>

        <div>
          <OurVision />
        </div>

        <div className="lg:pt-[100px]">
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
};

export default page;
