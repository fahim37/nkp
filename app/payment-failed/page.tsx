"use client";

import { type FC, Suspense } from "react";
import Link from "next/link";
import PaymentErrorContent from "./_component/paymnt_error";

const PaymentFailedPage: FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--site-bg)] px-4">
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[var(--site-border)] bg-[var(--site-panel)] p-6 shadow-md">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-[var(--site-muted-strong)]">
            Payment failed
          </h1>
          <p className="mb-2 text-[var(--site-muted)]">
            We couldn&apos;t process your payment.
          </p>

          <Suspense
            fallback={
              <p className="mb-6 text-sm text-[var(--site-muted)]">
                Loading error details...
              </p>
            }
          >
            <PaymentErrorContent />
          </Suspense>

          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="inline-block rounded-md bg-[var(--site-button-bg)] px-6 py-2 text-[var(--site-button-text)] transition-opacity hover:opacity-90"
            >
              Try again
            </Link>
            <div>
              <Link
                href="/"
                className="inline-block text-[var(--site-accent-strong)] hover:underline"
              >
                Return to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
