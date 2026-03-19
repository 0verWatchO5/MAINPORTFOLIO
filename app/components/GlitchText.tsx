"use client";

import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`glitch-text text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-primary ${className}`}
      data-text={text}
    >
      {text}
    </motion.h1>
  );
}
