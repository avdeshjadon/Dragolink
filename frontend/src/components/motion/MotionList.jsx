/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React from "react";
import { motion } from "motion/react";
import { VARIANTS } from "../../constants/motion";

export const MotionList = ({
  children,
  className = "",
  as: Component = motion.ul,
  ...props
}) => {
  return (
    <Component
      variants={VARIANTS.STAGGER_CONTAINER}
      initial="hidden"
      animate="show"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

export const MotionListItem = ({
  children,
  className = "",
  as: Component = motion.li,
  ...props
}) => {
  return (
    <Component
      variants={VARIANTS.STAGGER_ITEM}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};
