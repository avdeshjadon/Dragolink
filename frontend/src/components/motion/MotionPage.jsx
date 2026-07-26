import React from 'react';
import { motion } from 'motion/react';
import { VARIANTS } from '../../constants/motion';

export default function MotionPage({ children, className = '', ...props }) {
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
