import { lazy, Suspense } from "react";
import { petSettings } from "./petBridge";

const LazyPetWidget = lazy(() =>
  import("../pet-system/src/pet-system/components/PetWidget").then(module => ({
    default: module.PetWidget
  }))
);

export function PetSystemMount() {
  if (!petSettings.petEnabled) {
    return null;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <Suspense fallback={<div id="pet-system-loading-placeholder" style={{ display: 'none' }} />}>
      {/*
        Safe boundary for PetWidget.
        - Fixed position: bottom-right, above safe area.
        - env(safe-area-inset-*) for iOS notch/home-indicator.
        - High z-index but below modals.
        - Offset from ThemeToggle (which is at bottom:24px, right:24px).
      */}
      <div
        id="pet-system-safe-boundary"
        style={{
          position: 'fixed',
          bottom: 'max(24px, env(safe-area-inset-bottom, 0px))',
          right: `max(${isMobile ? '16px' : '120px'}, env(safe-area-inset-right, 0px))`,
          zIndex: 9990,
          pointerEvents: 'auto',
          /* Prevent widget from being obscured by virtual keyboard */
          transition: 'bottom 0.3s ease',
        }}
      >
        <LazyPetWidget />
      </div>
    </Suspense>
  );
}
