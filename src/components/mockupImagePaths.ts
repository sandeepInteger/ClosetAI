/**
 * Screenshot bases under `public/uploads/…` (no extension; use .png / .jpg / .jpeg / .webp).
 */
export const MOCKUP_IMAGE_PATHS = {
  outfitPlanner: "/uploads/OutfitPlanner",
  /** Full-screen closet hero for center phone (add `screen.png` etc. in SmartCloset). */
  smartClosetScreen: "/uploads/SmartCloset",
  smartClosetGrid: [
    "/uploads/SmartCloset",
    
  ],
  aiStylist: "/uploads/AiStylist",
} as const;
