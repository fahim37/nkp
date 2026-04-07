"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const successMessage = "Thanks for your message. We’ll be in touch shortly.";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.message) {
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
            name: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phone,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });

      setSubmitStatus({
        success: true,
        message: successMessage,
      });

      console.log("API Response:", data);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      toast.success(submitStatus?.message || successMessage);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="block pb-2 text-sm font-medium text-white"
          >
            Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full rounded-md border border-[var(--site-border)] bg-[var(--site-bg)] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--site-accent)] sm:text-base"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
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
              htmlFor="phone"
              className="block pb-2 text-sm font-medium text-white"
            >
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
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
            className="h-[150px] w-full rounded-md border border-[var(--site-border)] bg-[var(--site-bg)] p-3 pb-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--site-accent)] sm:h-[189px] sm:text-base lg:h-[189px]"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="mt-6 flex justify-center">
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
  );
}
