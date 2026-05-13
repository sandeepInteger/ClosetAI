import type { ReactNode } from "react";
import {
  FaCalendarAlt,
  FaChartLine,
  FaCloudSun,
  FaGem,
  FaRobot,
  FaTshirt,
} from "react-icons/fa";

type NotchFeature = { label: string; icon: ReactNode };

const FEATURES: NotchFeature[] = [
  { label: "AI outfit planning", icon: <FaRobot className="h-[15px] w-[15px] shrink-0" aria-hidden /> },
  { label: "Weather-smart looks", icon: <FaCloudSun className="h-[15px] w-[15px] shrink-0" aria-hidden /> },
  { label: "Calendar sync", icon: <FaCalendarAlt className="h-[15px] w-[15px] shrink-0" aria-hidden /> },
  { label: "Virtual try-on", icon: <FaTshirt className="h-[15px] w-[15px] shrink-0" aria-hidden /> },
  { label: "Wear & style insights", icon: <FaChartLine className="h-[15px] w-[15px] shrink-0" aria-hidden /> },
  { label: "Curated AI stylist", icon: <FaGem className="h-[15px] w-[15px] shrink-0" aria-hidden /> },
];

function FeatureChip({ label, icon }: NotchFeature) {
  return (
    <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e8eaed] bg-white px-4 py-2 text-[13px] font-medium tracking-[-0.01em] text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.06)] md:px-[18px] md:py-2.5 md:text-sm">
      <span className="text-[#0a0a0a]">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function Notch() {
  return (
    <section className="relative bg-white px-4 pb-10 pt-2 md:pb-14 md:pt-4" aria-labelledby="notch-features-heading">
      <h2
        id="notch-features-heading"
        className="mb-5 text-center text-[13px] font-medium tracking-[-0.01em] text-[#6b7280] md:mb-6 md:text-sm"
      >
        Our Top Notch Features
      </h2>

      <div className="relative mx-auto max-w-[1100px]">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 rounded-l-full bg-gradient-to-r from-white to-transparent md:w-14"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 rounded-r-full bg-gradient-to-l from-white to-transparent md:w-14"
          aria-hidden
        />

        <div className="overflow-hidden rounded-full border border-[#eceef1] bg-[#f3f4f6]/90 py-3 pl-1 pr-1 shadow-inner md:py-[14px]">
          <div className="notch-marquee-track flex w-max items-center gap-3 md:gap-4">
            <div className="flex shrink-0 items-center gap-3 md:gap-4">
              {FEATURES.map((f, i) => (
                <FeatureChip key={`a-${i}`} {...f} />
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-3 md:gap-4" aria-hidden>
              {FEATURES.map((f, i) => (
                <FeatureChip key={`b-${i}`} {...f} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
