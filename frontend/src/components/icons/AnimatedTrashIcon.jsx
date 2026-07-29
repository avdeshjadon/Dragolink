import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function AnimatedTrashIcon({ isDeleting = false, className = "w-5 h-5" }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldAnimate = isDeleting || isHovered;

  // Variants for the lid
  const lidVariants = {
    idle: { y: 0, rotate: 0 },
    deleting: { 
      y: [-2, -6, -2], 
      rotate: [0, -15, 10, -10, 0],
      transition: { 
        duration: 0.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Variants for the bin body
  const binVariants = {
    idle: { rotate: 0 },
    deleting: {
      rotate: [0, -3, 3, -3, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ overflow: 'visible' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Lid */}
      <motion.g variants={lidVariants} animate={shouldAnimate ? "deleting" : "idle"} style={{ transformOrigin: "50% 25%" }}>
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>

      {/* Body */}
      <motion.g variants={binVariants} animate={shouldAnimate ? "deleting" : "idle"} style={{ transformOrigin: "bottom center" }}>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </motion.g>
    </svg>
  );
}
