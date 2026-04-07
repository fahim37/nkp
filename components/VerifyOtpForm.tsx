"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOTP, forgotPassword } from "@/app/actions/auth";
import { CustomOtpInput } from "./custom-otp-input";
import { toast } from "sonner";

export function VerifyOtpForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    setIsLoading(true);
    const email = sessionStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Email not found. Please go back to the forgot password page.");
      router.push("/forgot-password");
      return;
    }

    try {
      const result = await verifyOTP(email, otpString);

      if (result.success) {
        toast.success("OTP verified successfully.");

        const token = (result.data as { token?: string })?.token;
        if (token) {
          sessionStorage.setItem("resetToken", token);
        }

        router.push("/reset-password");
      } else {
        toast.error(result.message || "Unable to verify the OTP.");
      }
    } catch {
      toast.error("Unable to verify the OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const email = sessionStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Email not found. Please go back to the forgot password page.");
      return;
    }

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        toast.success("Verification code sent successfully.");
      } else {
        toast.error(result.message || "Unable to send the verification code.");
      }
    } catch {
      toast.error("Unable to send the verification code.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CustomOtpInput value={otp} onChange={setOtp} disabled={isLoading} />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleResendOtp}
          className="text-sm text-[var(--site-accent)] hover:text-[var(--site-accent-strong)]"
          disabled={isLoading}
        >
          Didn&apos;t receive the code?
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          className="text-sm text-[var(--site-accent)] hover:text-[var(--site-accent-strong)]"
          disabled={isLoading}
        >
          RESEND CODE
        </button>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-[var(--site-button-bg)] py-2 font-medium text-[var(--site-button-text)] hover:bg-white disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
