import Image from "next/image";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { Suspense } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/assets/new-pass.jpg"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Link href="/">
            <div className="mb-6 rounded-full border border-white/20 bg-black/70 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-white"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </Link>
          <h2 className="mb-3 text-4xl font-bold text-white">
            Back in the city
          </h2>
          <p className="max-w-md text-gray-300">
            Set a new password to get back to your account and keep exploring.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-[var(--site-bg)] lg:w-1/2">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-[var(--site-bg)] p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-[26px] font-semibold leading-[120%] text-white lg:text-[32px]">
              Reset password
            </h1>
            <p className="text-[14px] text-gray-300 lg:text-[16px]">
              Please choose your new password.
            </p>
          </div>
          <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
