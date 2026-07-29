/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React from "react";
import { motion } from "motion/react";
import { VARIANTS } from "../../constants/motion";

export default function MotionPage({ children, className = "", ...props }) {
  return (
    <motion.div
      variants={VARIANTS.PAGE_FADE_BLUR}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
