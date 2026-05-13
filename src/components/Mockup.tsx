"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { MOCKUP_IMAGE_PATHS } from "@/components/mockupImagePaths";

export { MOCKUP_IMAGE_PATHS };

const IMAGE_EXT = ["png", "jpg", "jpeg", "webp"] as const;

function useResilientSrc(baseWithoutExtension: string) {
  const [extIdx, setExtIdx] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  const src = exhausted ? "" : `${baseWithoutExtension}.${IMAGE_EXT[extIdx]}`;
  const onError = useCallback(() => {
    setExtIdx((i) => {
      if (i + 1 < IMAGE_EXT.length) return i + 1;
      setExhausted(true);
      return i;
    });
  }, []);
  return { src, onError, exhausted };
}

function IconMenu() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path d="M0 1.5h22M0 8h22M0 14.5h22" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.5 4.5h15l-5.5 6.2V16l-4-2.2V10.7L2.5 4.5z"
        stroke="#000"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
      <path d="M4 2v14M18 4v10" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="6" r="2.5" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="2.5" fill="#fff" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}

function StatusIcons() {
  return (
    <svg width="68" height="14" viewBox="0 0 68 14" fill="none" aria-hidden>
      <path
        d="M0 10V4c0-1 .8-2 2-2h4c1 0 2 .8 2 2v6c0 1-.8 2-2 2H2c-1 0-2-.8-2-2z"
        fill="#000"
        opacity="0.9"
      />
      <path
        d="M12 3.5c3.5 0 6.5 2.2 7.5 5.5-1 3.3-4 5.5-7.5 5.5S5 12.3 4 9c1-3.3 4-5.5 7.5-5.5z"
        stroke="#000"
        strokeWidth="1.2"
        fill="none"
      />
      <path d="M26 2h10v10H26V2z" fill="#000" opacity="0.85" />
      <rect x="40" y="3" width="26" height="10" rx="2.5" stroke="#000" strokeWidth="1.2" fill="none" />
      <rect x="42" y="5" width="19" height="6" rx="1" fill="#000" opacity="0.85" />
    </svg>
  );
}

function DynamicIsland() {
  return (
    <div className="flex justify-center pb-[6px] pt-[10px]">
      <div className="h-[28px] w-[95px] rounded-full bg-black" />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex shrink-0 items-center justify-between px-[18px] pt-[4px]">
      <span className="text-[15px] font-semibold leading-none tracking-[-0.2px] text-black">9:41</span>
      <StatusIcons />
    </div>
  );
}

function PhoneFrame({
  children,
  className = "",
  tilt = "0deg",
  scale = 1,
  z = 0,
}: {
  children: ReactNode;
  className?: string;
  tilt?: string;
  scale?: number;
  z?: number;
}) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        transform: `rotate(${tilt}) scale(${scale})`,
        zIndex: z,
      }}
    >
      <div
        className="relative rounded-[52px] border-[10px] border-black bg-black p-[2px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35),0_12px_24px_-8px_rgba(0,0,0,0.2)]"
        style={{ width: 276, height: 592 }}
      >
        <div
          className="flex h-full w-full flex-col overflow-hidden rounded-[44px] bg-white antialiased"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, "Segoe UI", sans-serif',
          }}
        >
          <DynamicIsland />
          <StatusBar />
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

function MockupImageFill({
  basePath,
  alt,
  sizes,
  className = "",
}: {
  basePath: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const { src, onError, exhausted } = useResilientSrc(basePath);

  if (exhausted || !src) {
    return <div className={`bg-neutral-200 ${className}`} aria-hidden />;
  }

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover object-top ${className}`}
      onError={onError}
      unoptimized
      priority
    />
  );
}

function MockupImageContain({
  basePath,
  alt,
  sizes,
  className = "",
}: {
  basePath: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const { src, onError, exhausted } = useResilientSrc(basePath);

  if (exhausted || !src) {
    return <div className={`bg-neutral-200 ${className}`} aria-hidden />;
  }

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-contain ${className}`}
      onError={onError}
      unoptimized
      priority
    />
  );
}

function CatalogScreen() {
  const tabs = ["All", "Tops", "Bottoms", "Outerwear", "Shoes"] as const;
  const labels = ["Shein Ruffle Top", "Revolve Satin Dress", "Denim Wide Leg", "Plaid Flannel"];

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between px-[18px] pb-[10px] pt-[4px]">
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg active:bg-neutral-100">
          <IconMenu />
        </button>
        <h1 className="text-[13px] font-bold tracking-[0.12em] text-black">WEARLY AI</h1>
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg active:bg-neutral-100">
          <IconFilter />
        </button>
      </header>

      <div className="no-scrollbar flex shrink-0 gap-[8px] overflow-x-auto px-[16px] pb-[14px] pt-[2px]">
        {tabs.map((t) => {
          const active = t === "Tops";
          return (
            <button
              key={t}
              type="button"
              className={`shrink-0 rounded-[7px] border px-[14px] py-[7px] text-[12px] font-medium leading-none transition-colors ${
                active ? "border-black bg-black text-white" : "border-[#e5e5e5] bg-white text-black"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-baseline gap-[6px] px-[18px] pb-[12px]">
        <span className="text-[17px] font-bold leading-none tracking-[-0.3px] text-black">Tops</span>
        <span className="text-[13px] font-normal leading-none text-[#8e8e93]">15 items</span>
      </div>

      <div className="no-scrollbar grid flex-1 grid-cols-2 gap-x-[12px] gap-y-[14px] overflow-y-auto px-[18px] pb-[20px]">
        {MOCKUP_IMAGE_PATHS.smartClosetGrid.map((src: string, i: number) => (
          <article key={src}>
            <div className="overflow-hidden rounded-[8px] bg-[#f5f5f5] p-[8px]">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[6px] bg-[#f0f0f0]">
                <MockupImageFill basePath={src} alt={labels[i] ?? "Closet item"} sizes="130px" />
              </div>
            </div>
            <p className="mt-[8px] pl-[2px] text-[11px] font-normal leading-[1.25] text-[#3c3c43]">{labels[i]}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function PlannerScreen() {
  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between px-[18px] pb-[8px] pt-[4px]">
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg active:bg-neutral-100">
          <IconMenu />
        </button>
        <span className="max-w-[120px] truncate text-center text-[11px] font-semibold tracking-[0.08em] text-black">
          Plan Set of…
        </span>
        <span className="w-10" />
      </header>

      <div className="relative mx-[14px] mb-[16px] mt-[4px] min-h-0 flex-1 overflow-hidden rounded-[12px] bg-[#f2f2f2]">
        <MockupImageFill
          basePath={MOCKUP_IMAGE_PATHS.outfitPlanner}
          alt="Outfit planner preview"
          sizes="276px"
          className="rounded-[12px]"
        />
      </div>
    </div>
  );
}

function PreviewScreen() {
  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between px-[18px] pb-[8px] pt-[4px]">
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg active:bg-neutral-100">
          <IconMenu />
        </button>
        <h1 className="text-[13px] font-bold tracking-[0.12em] text-black">WEARLY AI</h1>
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg active:bg-neutral-100">
          <IconSliders />
        </button>
      </header>

      <div className="relative mx-[14px] mb-[16px] mt-[6px] min-h-0 flex-1 overflow-hidden rounded-[12px] bg-[#f5f5f5]">
        <MockupImageContain
          basePath={MOCKUP_IMAGE_PATHS.aiStylist}
          alt="AI stylist preview"
          sizes="276px"
          className="rounded-[12px]"
        />
      </div>
    </div>
  );
}

export type MockupVariant = "standalone" | "hero";

export default function Mockup({ variant = "standalone" }: { variant?: MockupVariant }) {
  const isHero = variant === "hero";

  return (
    <div
      className={`flex w-full select-none items-end justify-center px-4 ${
        isHero ? "bg-transparent py-4 md:py-6" : "min-h-[640px] bg-[#d4d4d8] py-12"
      }`}
    >
      <div className="flex items-end justify-center">
        {isHero ? (
          <>
            <PhoneFrame tilt="-13deg" scale={0.78} z={5} className="-mr-3 translate-y-[26px] md:-mr-5 md:translate-y-[32px]">
              <PlannerScreen />
            </PhoneFrame>
            <PhoneFrame tilt="0deg" scale={1.06} z={30} className="-mx-5 -translate-y-[6px] md:-mx-8 md:-translate-y-[10px]">
              <CatalogScreen />
            </PhoneFrame>
            <PhoneFrame tilt="13deg" scale={0.78} z={5} className="-ml-3 translate-y-[26px] md:-ml-5 md:translate-y-[32px]">
              <PreviewScreen />
            </PhoneFrame>
          </>
        ) : (
          <>
            <PhoneFrame tilt="-7deg" scale={0.9} z={1}>
              <PlannerScreen />
            </PhoneFrame>
            <PhoneFrame tilt="0deg" scale={1} z={10} className="-mx-2 md:-mx-3">
              <CatalogScreen />
            </PhoneFrame>
            <PhoneFrame tilt="7deg" scale={0.9} z={1}>
              <PreviewScreen />
            </PhoneFrame>
          </>
        )}
      </div>
    </div>
  );
}
