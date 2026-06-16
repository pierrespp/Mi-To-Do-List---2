import type { Variants } from "framer-motion";

export const idleFloat: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const happyBounce: Variants = {
  animate: {
    scale: [1, 1.15, 1, 1.1, 1],
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export const celebrateShake: Variants = {
  animate: {
    rotate: [0, -8, 8, -6, 6, 0],
    scale: [1, 1.1, 1.1, 1.05, 1],
    transition: { duration: 0.7, ease: "easeInOut" },
  },
};

export const sleepBreath: Variants = {
  animate: {
    scale: [1, 1.04, 1],
    opacity: [1, 0.85, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const sadDroop: Variants = {
  animate: {
    y: [0, 4, 0],
    rotate: [-2, 2, -2],
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const excitedWiggle: Variants = {
  animate: {
    rotate: [-5, 5, -5, 5, 0],
    scale: [1, 1.08, 1, 1.08, 1],
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 12, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.9 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export const popIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { scale: 0, opacity: 0 },
};

export const sparkleFloat = {
  initial: { opacity: 0, y: 0, scale: 0 },
  animate: { opacity: [0, 1, 1, 0], y: -40, scale: [0, 1, 1, 0] },
  transition: { duration: 1.2, ease: "easeOut" },
};
