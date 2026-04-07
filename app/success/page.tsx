import type { FC } from "react";
import Link from "next/link";

const PaymentSuccessPage: FC = () => {
  return (
    <div className="flex h-[70vh] items-center justify-center bg-[var(--site-bg)] lg:h-[60vh]">
      <div className="mx-auto max-w-md rounded-2xl border border-[var(--site-border)] bg-[var(--site-panel)] p-6 shadow-md">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--site-border)] bg-[var(--site-surface)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-emerald-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-[var(--site-muted-strong)]">
            Payment successful
          </h1>
          <p className="mb-6 text-[var(--site-muted)]">
            Thank you for your payment. Your transaction was completed
            successfully.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-block rounded-md bg-[var(--site-button-bg)] px-6 py-2 font-medium text-[var(--site-button-text)] transition-colors hover:opacity-90"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
