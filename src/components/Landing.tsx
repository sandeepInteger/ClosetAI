import IphoneMockup from "./IphoneMockup";
import Notch from "./Notch";
import AppBanner from "./AppBanner";
import { MOCKUP_IMAGE_PATHS } from "@/components/mockupImagePaths";
import {Footer} from "./Footer";
function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden className="shrink-0">
      <path d="M1 2.5v9L10.5 7 1 2.5z" fill="currentColor" />
    </svg>
  );
}

function SocialBadge() {
  return (
    <div className="inline-flex items-center gap-[10px] rounded-full border border-[#e5e7eb] bg-white py-[5px] pl-[6px] pr-[5px] shadow-[0_2px_14px_-4px_rgba(15,23,42,0.1),0_1px_3px_-1px_rgba(15,23,42,0.06)]">
      <div className="flex shrink-0 items-center pl-[2px]">
        <span
          className="relative z-[3] h-[28px] w-[28px] shrink-0 rounded-full border-[2px] border-white bg-gradient-to-br from-amber-200 to-rose-300 shadow-sm"
          aria-hidden
        />
        <span
          className="relative z-[2] -ml-[10px] h-[28px] w-[28px] shrink-0 rounded-full border-[2px] border-white bg-gradient-to-br from-sky-300 to-indigo-400 shadow-sm"
          aria-hidden
        />
        <span
          className="relative z-[1] -ml-[10px] h-[28px] w-[28px] shrink-0 rounded-full border-[2px] border-white bg-gradient-to-br from-emerald-200 to-teal-400 shadow-sm"
          aria-hidden
        />
      </div>
      <span className="text-[13px] font-medium leading-none tracking-[-0.01em] text-[#374151]">Join 3k+ Members</span>
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-[4px] rounded-full bg-[#2563eb] px-[12px] py-[6px] text-[12px] font-semibold leading-none text-white transition-colors hover:bg-[#1d4ed8]"
      >
        Get Access
        <IconArrowRight />
      </button>
    </div>
  );
}

/** Three `IphoneMockup`s in a fan: planner (left), closet hero (center), AI stylist (right). */
function HeroPhonePresentation() {
  return (
    <div className="relative z-0 mx-auto mt-4 max-w-[1200px] overflow-x-clip px-0 pb-8 pt-0 sm:mt-8 md:mt-16 md:pb-24 md:pt-6 lg:mt-20 lg:pt-8">
      <div
        className="pointer-events-none absolute left-1/2 top-[40%] h-[min(420px,85vw)] w-[min(720px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] sm:h-[min(520px,72vw)] sm:w-[min(920px,96vw)]"
        style={{
          background:
            "radial-gradient(ellipse 72% 58% at 50% 50%, rgba(191, 219, 254, 0.72) 0%, rgba(219, 234, 254, 0.38) 42%, rgba(255, 255, 255, 0) 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-20 bg-gradient-to-t from-white via-white/90 to-transparent sm:h-28 md:h-40"
        aria-hidden
      />

      <div className="relative z-[2] mx-auto flex max-w-[1100px] justify-center px-0 sm:px-2 [perspective:1200px]">
        <div className="relative flex w-full max-w-[min(100vw,960px)] flex-nowrap items-end justify-center gap-0 pb-0 [transform-origin:50%_100%] scale-[0.72] max-[380px]:scale-[0.68] sm:scale-[0.78] md:scale-[0.88] lg:scale-100">
          <div className="relative z-[5] shrink-0 origin-bottom [transform:translateY(10px)_rotate(-12deg)_scale(0.78)] sm:[transform:translateY(22px)_rotate(-12deg)_scale(0.78)] md:[transform:translateY(32px)_rotate(-12deg)_scale(0.78)] lg:[transform:translateY(40px)_rotate(-12deg)_scale(0.78)]">
            <div className="landing-hero-float-left">
              <IphoneMockup
                imageBasePath={MOCKUP_IMAGE_PATHS.outfitPlanner}
                screenWidth={252}
                alt="Outfit planner"
              />
            </div>
          </div>

          <div className="relative z-[30] -mx-7 shrink-0 origin-bottom drop-shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] [transform:translateY(0)_scale(1.04)] sm:-mx-8 sm:[transform:translateY(-6px)_scale(1.05)] md:-mx-10 md:[transform:translateY(0)_scale(1.08)] lg:[transform:translateY(-8px)_scale(1.08)]">
            <div className="landing-hero-float-center">
              <IphoneMockup
                imageBasePath={MOCKUP_IMAGE_PATHS.smartClosetScreen}
                screenWidth={300}
                alt="Smart closet"
              />
            </div>
          </div>

          <div className="relative z-[5] shrink-0 origin-bottom [transform:translateY(10px)_rotate(12deg)_scale(0.78)] sm:[transform:translateY(22px)_rotate(12deg)_scale(0.78)] md:[transform:translateY(32px)_rotate(12deg)_scale(0.78)] lg:[transform:translateY(40px)_rotate(12deg)_scale(0.78)]">
            <div className="landing-hero-float-right">
              <IphoneMockup imageBasePath={MOCKUP_IMAGE_PATHS.aiStylist} screenWidth={252} alt="AI stylist" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function Landing() {
  return (
    <>
    <section className="relative overflow-x-clip bg-white pb-6 pt-[88px] md:pb-10 md:pt-[104px]">
      <div className="relative z-[1] mx-auto flex max-w-[1120px] flex-col items-center px-5 md:px-8">
        <div className="mb-[28px] md:mb-[32px]">
          <SocialBadge />
        </div>

        <h1 className="max-w-[920px] text-center text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.12] tracking-[-0.035em] text-[#111827]">
          The Future of Your Wardrobe
          <br />
          {"& Personal Style"}
        </h1>

        <p className="mx-auto mt-[22px] max-w-[560px] text-center text-[17px] font-normal leading-[1.65] tracking-[-0.01em] text-[#4b5563] md:text-[18px] md:leading-[1.7]">
          Plan outfits with AI, sync looks to your calendar and weather, and keep every piece in your closet working for
          you—effortlessly.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-[14px] md:mt-10">
          <button
            type="button"
            className="rounded-full bg-black px-[28px] py-[14px] text-[14px] font-semibold leading-none text-white shadow-none transition-colors hover:bg-[#1f2937]"
          >
            Download For Free
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-[8px] rounded-full border border-[#e5e7eb]/90 bg-gradient-to-b from-white to-[#f9fafb] px-[26px] py-[13px] text-[14px] font-semibold leading-none text-[#111827] shadow-[0_10px_40px_-12px_rgba(15,23,42,0.18),0_2px_8px_-4px_rgba(15,23,42,0.08)] transition-[box-shadow,transform] hover:shadow-[0_14px_44px_-12px_rgba(15,23,42,0.22)] active:scale-[0.99]"
          >
            <IconPlay />
            Watch Demo
          </button>
        </div>
      </div>

      <HeroPhonePresentation />
    </section>
    <Notch />
    <AppBanner />
    <Footer />
  </>
  );
}
