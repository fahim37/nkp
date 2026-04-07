"use client";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

type Feedback = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
};

type FeedbackResponse = {
  success: boolean;
  feedbacks: Feedback[];
};

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isError } = useQuery<FeedbackResponse>({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feedback`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      return response.json();
    },
  });

  const approvedFeedbacks =
    data?.feedbacks?.filter((feedback) => feedback.isApproved) || [];

  const handlePrev = () => {
    if (!approvedFeedbacks.length) return;
    setCurrentIndex(
      (prev) => (prev - 1 + approvedFeedbacks.length) % approvedFeedbacks.length
    );
  };

  const handleNext = () => {
    if (!approvedFeedbacks.length) return;
    setCurrentIndex((prev) => (prev + 1) % approvedFeedbacks.length);
  };

  if (isLoading) {
    return (
      <section className="container py-[50px] lg:mt-24">
        <div className="text-center text-white">Loading feedback...</div>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="container py-[50px] lg:mt-24">
        <div className="text-center text-white">
          We could not load community feedback. Please try again later.
        </div>
      </section>
    );
  }

  if (!approvedFeedbacks.length) {
    return;
  }

  const feedback = approvedFeedbacks[currentIndex];

  return (
    <section className="container py-[50px] lg:mt-24">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="h-9 w-5 rounded bg-[var(--site-accent)]" />
            <div className="flex items-center gap-2">
              <h1 className="heading-size font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
                Testimonial
              </h1>
            </div>
          </div>

          <h2 className="mt-1 text-xl font-bold text-white md:mt-2 md:text-2xl lg:text-[26px]">
            What does our community say?
          </h2>
        </div>

        <div className="col-span-6 md:col-span-4 lg:col-span-4">
          <div className="mb-5 flex flex-col gap-4 pl-6">
            <Image
              src="/assets/E.png"
              alt="quote"
              width={50}
              height={50}
              className="h-[25px] w-[35px] text-white"
            />
            <p className="overflow-hidden text-sm text-white md:text-[17px]">
              {feedback.message}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[var(--site-surface)]">
              <span className="text-lg font-bold text-white">
                {feedback.name.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white lg:text-lg">
                {feedback.name}
              </h4>
              <p className="text-sm text-[var(--site-muted)]">
                Verified guest
              </p>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                className="group flex items-center justify-center rounded-sm border border-white bg-[var(--site-bg)] px-[35px] py-[15px] hover:bg-[var(--site-button-bg)] hover:text-[var(--site-button-text)]"
                onClick={handlePrev}
              >
                <MoveLeft className="h-4 w-4 -rotate-45 text-white group-hover:text-[var(--site-button-text)]" />
                <span className="sr-only">Previous</span>
              </button>
              <button
                className="group flex items-center justify-center rounded-sm border border-white bg-[var(--site-bg)] px-[35px] py-[15px] hover:bg-[var(--site-button-bg)] hover:text-[var(--site-button-text)]"
                onClick={handleNext}
              >
                <MoveRight className="h-4 w-4 -rotate-45 text-white group-hover:text-[var(--site-button-text)]" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
