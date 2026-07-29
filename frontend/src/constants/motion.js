/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

export const TRANSITIONS = {
  SPRING: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 1,
  },
  SPRING_BOUNCY: {
    type: "spring",
    stiffness: 500,
    damping: 25,
    mass: 1,
  },
  EASE_OUT: {
    type: "tween",
    ease: "easeOut",
    duration: 0.2,
  },
  EASE_IN_OUT: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  },
};

export const VARIANTS = {
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: TRANSITIONS.EASE_OUT },
    exit: { opacity: 0, transition: TRANSITIONS.EASE_OUT },
  },
  FADE_UP: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: TRANSITIONS.SPRING },
    exit: { opacity: 0, y: 10, transition: TRANSITIONS.EASE_OUT },
  },
  SCALE_UP: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: TRANSITIONS.SPRING },
    exit: { opacity: 0, scale: 0.95, transition: TRANSITIONS.EASE_OUT },
  },
  STAGGER_CONTAINER: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1 },
    },
  },
  STAGGER_ITEM: {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: TRANSITIONS.SPRING },
    exit: { opacity: 0, scale: 0.95, transition: TRANSITIONS.EASE_OUT },
  },
  PAGE_FADE_BLUR: {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      transition: TRANSITIONS.EASE_OUT,
    },
    exit: { opacity: 0, filter: "blur(4px)", transition: TRANSITIONS.EASE_OUT },
  },
};
