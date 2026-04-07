"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomOtpInput } from "./custom-otp-input";

export function VerifyEmailForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get("email") || "");
  const hasAutoVerified = useRef(false);

  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async () => {
      const otpValue = otp.join("").toLowerCase();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            code: otpValue,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed.");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Verification failed.");
        return;
      }
      toast.success("Email verified successfully.");
      router.push("/login");
    },
    onError: () => {
      toast.error("Invalid verification code.");
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to resend the verification code.");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("A new verification code has been sent.");
      setOtp(Array(6).fill(""));
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Unable to resend the code. Please try again."
      );
    },
  });

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const joined = otp.join("");
    if (joined.length === 6 && !hasAutoVerified.current) {
      hasAutoVerified.current = true;
      verifyOtp();
    } else if (joined.length < 6) {
      hasAutoVerified.current = false;
    }
  }, [otp, verifyOtp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 characters.");
      return;
    }
    verifyOtp();
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-[var(--site-surface)] px-[16px] py-[32px] shadow-md">
      <h2 className="mb-2 text-center text-[26px] font-semibold leading-[120%] text-white lg:text-[32px]">
        Enter code
      </h2>
      <p className="mb-6 text-center text-[var(--site-muted)]">
        Enter the 6-character code we sent to{" "}
        <span className="font-semibold text-white">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomOtpInput
          value={otp}
          onChange={setOtp}
          disabled={isVerifying || isResending}
          numericOnly={false}
          className="justify-center gap-2"
          inputClassName="h-12 w-12 rounded-md border border-[var(--site-border)] bg-[var(--site-panel)] text-center text-white placeholder:text-[var(--site-muted)] focus:border-[var(--site-accent)] focus:outline-none focus:ring-0"
        />

        <button
          type="submit"
          disabled={isVerifying || isResending}
          className="w-full rounded-md bg-[var(--site-button-bg)] py-3 font-medium text-[var(--site-button-text)] transition-colors hover:bg-white disabled:opacity-50"
        >
          {isVerifying ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => resendOtp()}
          disabled={!canResend || isResending}
          className="text-sm text-white hover:text-[var(--site-accent)] disabled:opacity-50"
        >
          {isResending
            ? "Sending..."
            : canResend
              ? "Resend code"
              : `Resend available in ${resendTimer}s`}
        </button>
      </div>
    </div>
  );
}
