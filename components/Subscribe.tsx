"use client";

import type React from "react";
import { useState, useEffect } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      setMessage("Thanks for subscribing to the newsletter.");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "error");
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[85%] max-w-lg md:w-full">
      <h2 className="mb-4 text-xl font-bold text-black">
        Sign up and stay in the loop
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex w-[90%] flex-col gap-2 md:w-full sm:flex-row"
      >
        <div className="flex w-full items-center rounded-lg bg-[var(--site-surface)] p-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full flex-grow rounded-md bg-[var(--site-surface)] px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            aria-label="Email address"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="whitespace-nowrap rounded-md bg-[var(--site-button-bg)] px-4 py-2 font-medium text-[var(--site-button-text)] transition-colors hover:bg-white disabled:opacity-70"
          >
            {isSubmitting ? "Signing up..." : "Subscribe"}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("subscrib") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
