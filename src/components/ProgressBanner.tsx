"use client";

import Link from "next/link";
import { useEffect } from "react";

export type ProgressBannerProps = {
  open: boolean;
  onDismiss: () => void;
};

/**
 * Shown when users tap App Store / Play Store while native apps are not ready yet.
 */
export function ProgressBanner({ open, onDismiss }: ProgressBannerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/25 px-4 pt-24 pb-8 sm:pt-28"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-banner-title"
        className="relative z-[1] mt-2 w-full max-w-[420px] rounded-2xl border border-[#e8eaed] bg-white p-6 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.22),0_8px_24px_-8px_rgba(15,23,42,0.12)]"
      >
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827]"
          aria-label="Dismiss"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">In development</p>
        <h2 id="progress-banner-title" className="pr-10 text-[1.25rem] font-bold leading-snug tracking-[-0.02em] text-[#111827]">
          Native apps are on the way
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4b5563]">
          Our App Store and Play Store builds are still in active development and will take a little longer. Until then,
          you can use the full experience in your browser.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="order-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#374151] transition-colors hover:bg-[#f9fafb] sm:order-1"
          >
            Got it
          </button>
          <Link
            href="/auth/signin"
            onClick={onDismiss}
            className="order-1 inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-center text-[14px] font-semibold text-white transition-colors hover:bg-[#1f2937] sm:order-2"
          >
            Use web version
          </Link>
        </div>
      </div>
    </div>
  );
}
