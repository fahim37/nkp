import ContactForm from "@/components/contactForm";
import { PageHeader } from "@/Shared/PageHeader";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <PageHeader title="Contact" imge="/assets/contact-banner.jpg" />

      <div className="container my-20 lg:mt-28">
        <h2 className="heading-size mb-10 text-center font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
          Send us your message here
        </h2>
        <div className="grid grid-cols-2 items-center gap-10 xl:gap-2">
          <div className="col-span-1 hidden md:hidden lg:block">
            <Image
              src="/assets/kontact.jpg"
              alt="Contact visual"
              height={1000}
              width={1000}
              className="h-auto w-full max-w-[470px] rounded-xl object-fill"
              priority
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
