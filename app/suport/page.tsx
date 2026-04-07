"use client";

import { PageHeader } from "@/Shared/PageHeader";
import ContactForm from "@/components/contactForm";
import { useEffect } from "react";

export default function SupportPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PageHeader title="Support" imge="/assets/support.jpg" />

      <div className="flex items-center justify-center p-4 py-16 text-white">
        <div className="container w-full">
          <h1 className="mb-5 text-[32px] font-semibold">We’re here to help</h1>
          <div className="mb-8 text-base font-normal leading-[150%] text-white">
            Have a question about your booking, need help with a deal, or just
            want to say hello?
            <p>We’re here with direct, practical support.</p>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
