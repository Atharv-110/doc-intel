// =====================================================
// DocIntel — Framer Motion Transition Presets & Variants
// =====================================================

import type { Variants, Transition } from "framer-motion";

// --- Transition presets ---

export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 15,
};

export const springStiff: Transition = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

export const smooth: Transition = {
  type: "tween",
  duration: 0.3,
  ease: "easeInOut",
};

export const snappy: Transition = {
  type: "tween",
  duration: 0.15,
  ease: [0.25, 0.1, 0.25, 1],
};

// --- Shared animation variants ---

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// --- Stagger containers ---

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// --- Log entry animation ---

export const logEntryVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// --- Tree node children ---

export const treeChildrenVariant: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};
