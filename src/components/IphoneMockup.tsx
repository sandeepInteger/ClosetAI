"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { IPhoneMockup } from "react-device-mockup";

import { MOCKUP_IMAGE_PATHS } from "@/components/mockupImagePaths";

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

export type IphoneMockupProps = {
  /** Path without extension (tries .png, .jpg, .jpeg, .webp). Default: Outfit Planner screen. */
  imageBasePath?: string;
  screenWidth?: number;
  className?: string;
  alt?: string;
  /** Pass `false` below the fold (e.g. promo banners) so the hero keeps LCP priority. */
  priority?: boolean;
};

/**
 * Full-screen app screenshots inside `react-device-mockup`.
 * Uses `hideStatusBar` + `hideNavBar` so the library does not reserve extra gray strips
 * (your PNG usually already includes app chrome); screenshot scales with `object-contain`
 * so the full UI stays visible without bottom clipping from `object-cover`.
 */
export default function IphoneMockup({
  imageBasePath = MOCKUP_IMAGE_PATHS.outfitPlanner,
  screenWidth = 300,
  className,
  alt = "App screenshot",
  priority = true,
}: IphoneMockupProps) {
  const { src, onError, exhausted } = useResilientSrc(imageBasePath);

  return (
    <div className={`flex shrink-0 items-center justify-center ${className ?? ""}`}>
      <IPhoneMockup
        screenWidth={screenWidth}
        screenType="island"
        hideStatusBar
        hideNavBar
        frameColor="#2c2c2e"
        statusbarColor="#ffffff"
      >
        <div
          className="relative box-border min-h-0 w-full flex-[1_1_0%] overflow-hidden bg-white"
          style={{
            // Fills the library’s flex slot so `Image fill` has a definite box (avoids crop/offset bugs).
            flex: "1 1 0%",
            minHeight: 0,
          }}
        >
          {!exhausted && src ? (
            <Image
              key={src}
              src={src}
              alt={alt}
              fill
              sizes={`${Math.round(screenWidth)}px`}
              className="object-contain object-top"
              onError={onError}
              unoptimized
              priority={priority}
            />
          ) : (
            <div className="flex h-full min-h-[120px] w-full flex-col items-center justify-center gap-2 bg-neutral-100 px-4 text-center text-[11px] leading-snug text-neutral-500">
              <span>Missing image for</span>
              <code className="max-w-full break-all text-[10px] text-neutral-700">{imageBasePath}.*</code>
            </div>
          )}
        </div>
      </IPhoneMockup>
    </div>
  );
}
