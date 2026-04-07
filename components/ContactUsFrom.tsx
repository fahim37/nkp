"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactUsForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  console.log(submitStatus);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "message") {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > 300) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const successMessage =
    "Thanks for your message. We’ll get back to you as soon as possible.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        success: false,
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitStatus({
        success: false,
        message: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      });

      setSubmitStatus({
        success: true,
        message: successMessage,
      });
    } catch (error) {
      console.error("Feedback submission error:", error);
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      toast.success(successMessage);
    }
  };

  return (
    <div className="container py-24 lg:mt-8">
      <div>
        <h1 className="mb-4 text-center text-xl font-bold text-white lg:text-[34px] lg:text-4xl">
          Have feedback or an idea?
        </h1>
        <h1
          className="heading-size text-center font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]"
          style={{ fontFamily: "cursive" }}
        >
          We’d love to hear from you
        </h1>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="space-y-4 sm:space-y-6 lg:col-span-1">
              <div>
                <label
                  htmlFor="name"
                  className="block pb-2 text-sm font-medium text-white"
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-md border border-[var(--site-border)] bg-[var(--site-bg)] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--site-accent)] sm:text-base"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block pb-2 text-sm font-medium text-white"
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-[var(--site-border)] bg-[var(--site-bg)] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--site-accent)] sm:text-base"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block pb-2 text-sm font-medium text-white"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-md border border-[var(--site-border)] bg-[var(--site-bg)] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--site-accent)] sm:text-base"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label
                htmlFor="message"
                className="block pb-2 text-sm font-medium text-white"
              >
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message"
                className="h-[200px] w-full rounded-md border border-[var(--site-border)] bg-[var(--site-bg)] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--site-accent)] sm:text-base lg:h-[255px]"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="rounded-md bg-[var(--site-button-bg)] px-4 py-2 text-sm text-[var(--site-button-text)] transition-colors hover:bg-white disabled:opacity-70 sm:px-6 sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
