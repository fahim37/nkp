import { SignInForm } from "@/components/ui/LoginFrom";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gray-900 lg:block">
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/assets/auth.jpg"
              alt="Background"
              fill
              className="object-cover opacity-50"
              priority
            />
          </div>
          <div className="z-10 flex flex-col items-center justify-center text-center text-white">
            <Link href="/">
              <div className="mb-4 rounded-full bg-gray-800/70 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <Home />
                </svg>
              </div>
            </Link>
            <h2 className="mb-2 text-4xl font-bold">Welcome back</h2>
            <div className="max-w-lg text-gray-300">
              Ready for your next Walk Through?
              <div>New places and perspectives are waiting for you.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-[var(--site-bg)] lg:w-1/2">
        <div className="w-full max-w-md space-y-8 rounded-lg p-8 text-white">
          <div className="text-center">
            <h1 className="text-[26px] font-semibold leading-[120%] lg:text-[32px]">
              Welcome back
            </h1>
            <div className="text-[14px] font-normal text-white lg:text-[16px]">
              Enter your login details
              <div>to continue.</div>
            </div>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
