/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React from "react";
import { motion } from "motion/react";
import { TRANSITIONS, VARIANTS } from "../../constants/motion";

export default function MotionCard({
  children,
  className = "",
  interactive = false,
  hoverScale = 1.01,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      variants={VARIANTS.FADE_UP}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ ...TRANSITIONS.SPRING, delay }}
      whileHover={
        interactive
          ? { scale: hoverScale, y: -4, transition: TRANSITIONS.SPRING }
          : {}
      }
      className={`bg-white rounded-xl shadow-sm border border-slate-100/50 ${interactive ? "hover:shadow-lg transition-shadow duration-300 cursor-pointer" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
