import ContactUsForm from "@/components/ContactUsFrom";
import FaqPage from "@/components/faqpage";
import { PageHeader } from "@/Shared/PageHeader";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        imge="/assets/faq-banner.jpg"
        height="350px"
        backgroundSize="cover"
      />
      <div className="container">
        <div className="grid grid-cols-3 gap-4 pt-16">
          <div className="hidden lg:col-span-1 lg:block">
            <Image
              src="/assets/faq5.jpg"
              alt="FAQ visual"
              width={500}
              height={500}
              className="hidden h-[450px] w-[350px] rounded-lg object-cover lg:sticky lg:top-[190px] lg:block"
            />
          </div>
          <div className="col-span-3 lg:col-span-2">
            <FaqPage />
          </div>
        </div>
        <div>
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
};

export default page;
