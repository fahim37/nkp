import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--site-bg)] px-4">
      <div className="max-w-md rounded-2xl border border-[var(--site-border)] bg-[var(--site-panel)] p-8 text-center text-[var(--site-muted-strong)] shadow-md">
        <h1 className="mb-3 text-2xl font-semibold">Payment canceled</h1>
        <p className="mb-6 text-[var(--site-muted)]">
          Your payment flow was canceled before completion. You can return and
          try again whenever you are ready.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-[var(--site-button-bg)] px-5 py-2 font-medium text-[var(--site-button-text)] transition-opacity hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
