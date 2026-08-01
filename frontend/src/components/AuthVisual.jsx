/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React from "react";
import { motion } from "motion/react";
import Shuffle from "./Shuffle";

export default function AuthVisual({ title, subtitle }) {
  return (
    <div className="hidden lg:flex flex-1 flex-col justify-center relative overflow-hidden bg-[#05100a] text-surface-light border-r border-outline-variant/10">
      {/* Smoky / Black Hole Effect Container */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        {/* Deep background */}
        <div className="absolute inset-0 bg-[#05100a]"></div>

        {/* Animated glowing orbs (smoky effect) */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-brand-dark/40 blur-[100px] mix-blend-screen"
          style={{ left: "-20%", top: "-10%" }}
        />

        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full bg-brand-emerald/30 blur-[120px] mix-blend-screen"
          style={{ right: "-10%", bottom: "-10%" }}
        />

        <motion.div
          animate={{
            rotate: [0, -360],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-[40%_60%_70%_30%] bg-brand/20 blur-[100px] mix-blend-screen"
          style={{ left: "10%", top: "20%" }}
        />

        {/* Removed black hole center based on user request */}
      </div>

      {/* Content overlay */}
      <div className="relative z-20 w-full px-12 lg:px-20 xl:px-24 h-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <img
            src="/dragolink.svg"
            alt="Dragolink Logo"
            className="h-16 w-16 mb-8 opacity-90 drop-shadow-[0_0_15px_rgba(33,197,94,0.3)]"
          />
          <Shuffle
            text={title}
            tag="h2"
            className="text-4xl lg:text-5xl font-display-lg font-bold text-white tracking-tight mb-4 leading-tight drop-shadow-lg"
            shuffleDirection="right"
            duration={0.4}
            stagger={0.05}
            ease="power3.out"
          />
          <p className="text-lg text-white/70 font-body-md max-w-md leading-relaxed drop-shadow mt-4">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
