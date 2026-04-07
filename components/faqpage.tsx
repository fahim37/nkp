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
      "A Walk Through is a short guided experience built around a special theme, often in independent shops, studios, workshops, or cafes. Hosts give you a personal look into their craft or passion.",
  },
  {
    question: "How do I book a Walk Through?",
    answer:
      "Choose the Walk Through you want and book it online. After booking, you will receive your access code by email or find it in your account. Show the code when you arrive and you are ready to start.",
  },
  {
    question: "How long does a Walk Through last?",
    answer:
      "The exact duration can vary, but it is best to plan for about 30 to 60 minutes.",
  },
  {
    question: "Do I need to arrive on time?",
    answer:
      "Yes. Please arrive about 10 minutes before the start so everything can begin smoothly.",
  },
  {
    question: "What if I cannot attend the booking?",
    answer:
      "Rescheduling is not available yet, but we are already working on a solution.",
  },
  {
    question: "Do I need to bring anything?",
    answer:
      "Just your access code, either digital or printed. Beyond that, all you really need is curiosity.",
  },
  {
    question: "Can I join with friends or family?",
    answer: "Yes. You can book multiple spots at the same time.",
  },
  {
    question: "Do Walk Throughz still happen in bad weather?",
    answer:
      "Usually yes. Many formats are weather independent or happen partly indoors. If a session must be cancelled because of weather, you will be informed in good time.",
  },
  {
    question: "Do I need to participate actively?",
    answer:
      "You are welcome to, but only if you want to. Many hosts enjoy questions, conversation, or small interactive moments when they are part of the experience.",
  },
];

function FaqPage() {
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

export default FaqPage;
