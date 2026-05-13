"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RiInfinityFill } from "react-icons/ri";
import { SiAppstore, SiGoogleplay } from "react-icons/si";

import { ProgressBanner } from "@/components/ProgressBanner";

/** Stylized loop mark — compact black glyph beside the wordmark. */
function BrandMark({ className }: { className?: string }) {
  return (
    <RiInfinityFill
      className={className}
      aria-hidden
      size={22}
      style={{ color: "#0a0a0a" }}
    />
  );
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [storeNoticeOpen, setStoreNoticeOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6 md:pt-5">
      <div
        className={`pointer-events-auto flex w-full max-w-[min(100%,880px)] items-center rounded-full border border-[#e8eaed] bg-white py-[10px] pl-[18px] pr-[10px] shadow-[0_10px_40px_-16px_rgba(15,23,42,0.14),0_2px_10px_-4px_rgba(15,23,42,0.08)] transition-[box-shadow,border-color] duration-300 md:py-[11px] md:pl-5 md:pr-3 ${
          scrolled
            ? "shadow-[0_16px_48px_-14px_rgba(15,23,42,0.18),0_4px_14px_-4px_rgba(15,23,42,0.1)]"
            : ""
        }`}
      >
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-[10px] text-[#0a0a0a] no-underline transition-opacity hover:opacity-80"
        >
          <BrandMark className="shrink-0" />
          <span className="truncate text-[15px] font-bold tracking-[-0.02em] md:text-[16px]">
             ClosetAI
          </span>
        </Link>

        <div className="min-w-[1rem] flex-1" aria-hidden />

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <Link
            href="/auth/signin"
            className="shrink-0 rounded-full bg-black px-3.5 py-2 text-[13px] font-semibold leading-none text-white no-underline transition-colors hover:bg-[#1f2937] md:px-5 md:py-2.5 md:text-[14px]"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={() => setStoreNoticeOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#f3f4f6] text-[#0a0a0a] transition-colors hover:bg-[#eceef1] md:h-[42px] md:w-[42px] md:rounded-xl"
            aria-label="Download on the App Store"
            aria-haspopup="dialog"
          >
            <SiAppstore className="h-[19px] w-[19px]" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setStoreNoticeOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#f3f4f6] text-[#0a0a0a] transition-colors hover:bg-[#eceef1] md:h-[42px] md:w-[42px] md:rounded-xl"
            aria-label="Get it on Google Play"
            aria-haspopup="dialog"
          >
            <SiGoogleplay className="h-[19px] w-[19px]" aria-hidden />
          </button>
        </div>
      </div>
    </nav>
    <ProgressBanner open={storeNoticeOpen} onDismiss={() => setStoreNoticeOpen(false)} />
    </>
  );
};
