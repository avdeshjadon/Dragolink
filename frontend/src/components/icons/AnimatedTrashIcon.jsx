import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function AnimatedTrashIcon({ isDeleting = false, className = "w-5 h-5" }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldAnimate = isDeleting || isHovered;

  const lidVariants = {
    idle: { y: 0, rotate: 0 },
    deleting: { 
      y: [-2, -10, -2], 
      rotate: [0, -10, 8, -8, 0],
      transition: { 
        duration: 0.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const binVariants = {
    idle: { rotate: 0 },
    deleting: {
      rotate: [0, -4, 4, -4, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Colors based on the provided screenshot
  const lightRed = "#FE6E6E";
  const darkRed = "#D33737";
  const pillColor = "#FFB3B3";

  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Lid Group */}
      <motion.g variants={lidVariants} animate={shouldAnimate ? "deleting" : "idle"} style={{ transformOrigin: "50% 35%" }}>
        {/* Handle */}
        <path d="M42 28 V 18 C 42 15.8 43.8 14 46 14 H 54 C 56.2 14 58 15.8 58 18 V 28" stroke={lightRed} strokeWidth="6" fill="none" />
        
        {/* Lid Left */}
        <path d="M18 32 C 18 29.8 19.8 28 22 28 H 50 V 42 H 18 V 32 Z" fill={lightRed} />
        
        {/* Lid Right */}
        <path d="M50 28 H 78 C 80.2 28 82 29.8 82 32 V 42 H 50 V 28 Z" fill={darkRed} />
      </motion.g>

      {/* Body Group */}
      <motion.g variants={binVariants} animate={shouldAnimate ? "deleting" : "idle"} style={{ transformOrigin: "50% 85%" }}>
        {/* Body Left */}
        <path d="M26 42 H 50 V 85 H 32 C 28.7 85 26 82.3 26 79 V 42 Z" fill={darkRed} />
        
        {/* Body Right */}
        <path d="M50 42 H 74 V 79 C 74 82.3 71.3 85 68 85 H 50 V 42 Z" fill={lightRed} />
        
        {/* Pills */}
        <rect x="34" y="54" width="6" height="22" rx="3" fill={pillColor} />
        <rect x="47" y="54" width="6" height="22" rx="3" fill={pillColor} />
        <rect x="60" y="54" width="6" height="22" rx="3" fill={pillColor} />
      </motion.g>
    </svg>
  );
}
