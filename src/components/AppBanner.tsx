"use client";

import { useState } from "react";
import { FaApple } from "react-icons/fa";
import { SiGoogleplay } from "react-icons/si";

import IphoneMockup from "@/components/IphoneMockup";
import { MOCKUP_IMAGE_PATHS } from "@/components/mockupImagePaths";
import { ProgressBanner } from "@/components/ProgressBanner";

export default function AppBanner() {
  const [storeNoticeOpen, setStoreNoticeOpen] = useState(false);

  return (
    <>
      <section className="bg-white px-5 pb-10 pt-2 md:px-8 md:pb-14 md:pt-4" aria-labelledby="app-banner-heading">
        <div className="relative mx-auto max-w-[1120px]">
          <div className="relative overflow-hidden rounded-[32px] border border-[#e8eef4] bg-gradient-to-br from-[#f1f5f9] via-[#fafcff] to-white px-7 py-10 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_24px_48px_-28px_rgba(15,23,42,0.08),0_8px_24px_-12px_rgba(15,23,42,0.04)] md:px-10 md:py-12 lg:px-12 lg:pb-0 lg:pt-12">
            <div
              className="pointer-events-none absolute -right-[8%] top-1/2 h-[min(100%,420px)] w-[min(92vw,480px)] -translate-y-1/2 rounded-[50%] opacity-90 md:h-[min(100%,460px)] md:w-[min(92vw,520px)]"
              style={{
                background:
                  "radial-gradient(ellipse 68% 62% at 50% 50%, rgba(147, 197, 253, 0.42) 0%, rgba(219, 234, 254, 0.22) 48%, rgba(255, 255, 255, 0) 72%)",
              }}
              aria-hidden
            />

            <div className="relative z-[1] flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6">
              <div className="w-full max-w-[520px] text-center lg:max-w-[min(100%,480px)] lg:pb-12 lg:pt-2 lg:text-left">
                <h2
                  id="app-banner-heading"
                  className="text-[clamp(1.6rem,3.4vw,2.35rem)] font-bold leading-[1.14] tracking-[-0.035em] text-[#1a1a1a]"
                >
                  Take Your Personal Style
                  <br />
                  Anywhere!
                </h2>
                <p className="mx-auto mt-4 max-w-[440px] text-[15px] font-normal leading-[1.65] text-[#666666] lg:mx-0 lg:max-w-none md:text-[16px] md:leading-[1.68]">
                  Plan outfits with AI on the go—calendar and weather-aware looks, your digital closet, and smart
                  suggestions right in your pocket.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-[12px] lg:justify-start">
                  <button
                    type="button"
                    onClick={() => setStoreNoticeOpen(true)}
                    className="inline-flex h-[48px] shrink-0 items-center gap-2.5 rounded-full bg-black px-5 pl-[18px] pr-6 text-[14px] font-semibold leading-none text-white shadow-none transition-colors hover:bg-[#1a1a1a] md:h-[50px] md:px-6 md:text-[15px]"
                    aria-haspopup="dialog"
                  >
                    <FaApple className="h-[22px] w-[22px] shrink-0 text-white" aria-hidden />
                    Download iOS
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoreNoticeOpen(true)}
                    className="inline-flex h-[48px] shrink-0 items-center gap-2.5 rounded-full border border-[#e8eaed] bg-white px-5 pl-[16px] pr-6 text-[14px] font-semibold leading-none text-[#374151] shadow-[0_10px_36px_-14px_rgba(15,23,42,0.14),0_2px_8px_-4px_rgba(15,23,42,0.06)] transition-[box-shadow,background-color] hover:bg-[#fafafa] md:h-[50px] md:px-6 md:text-[15px]"
                    aria-haspopup="dialog"
                  >
                    <SiGoogleplay className="h-[20px] w-[20px] shrink-0 text-[#1a1a1a]" aria-hidden />
                    Download Android
                  </button>
                </div>
              </div>

              <div className="relative flex w-full shrink-0 justify-center overflow-hidden lg:w-auto lg:min-w-0 lg:flex-1 lg:justify-end">
                <div className="flex h-[min(260px,52vw)] w-full max-w-[300px] items-start justify-center overflow-hidden sm:h-[min(300px,48vw)] sm:max-w-[320px] lg:h-[min(380px,36vw)] lg:max-w-none lg:max-h-[420px] lg:w-[min(340px,38vw)]">
                  <div className="translate-y-3 sm:translate-y-4 md:translate-y-5 lg:translate-y-6">
                    <IphoneMockup
                      imageBasePath={MOCKUP_IMAGE_PATHS.smartClosetScreen}
                      screenWidth={292}
                      alt="ClosetAI app on iPhone"
                      priority={false}
                      className="drop-shadow-[0_20px_50px_-12px_rgba(15,23,42,0.25)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgressBanner open={storeNoticeOpen} onDismiss={() => setStoreNoticeOpen(false)} />
    </>
  );
}
