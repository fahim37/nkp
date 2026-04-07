import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly is a Walk Through?",
    answer:
      "A Walk Through is a short guided experience built around a special theme, often in independent shops, studios, workshops, or cafes. Hosts give you a direct, personal look into their craft or passion.",
  },
  {
    question: "How do I book a Walk Through?",
    answer:
      "Choose the Walk Through you want and book it online. After a successful booking, you will receive your access code by email or find it in your account. Show the code on arrival and you are ready to go.",
  },
  {
    question: "How long does a Walk Through last?",
    answer:
      "The exact length can vary, but most Walk Throughz take around 30 to 60 minutes.",
  },
  {
    question: "Do I need to arrive on time?",
    answer:
      "Yes. Please arrive about 10 minutes before the experience starts so everything can begin smoothly.",
  },
  {
    question: "What if I can no longer attend?",
    answer:
      "Rescheduling is not available yet, but we are already working on a better solution for that.",
  },
];

function Faq() {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col gap-4"
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-lg"
          >
            <AccordionTrigger className="text-left text-base font-semibold text-white md:text-xl lg:text-xl">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#E0E0E0]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default Faq;
