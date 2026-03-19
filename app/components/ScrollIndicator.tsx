"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
    >
      {/* Mouse outline */}
      <div className="w-7 h-11 rounded-full border-2 border-foreground/40 relative bg-white/5 backdrop-blur-sm">
        <div
          className="w-1.5 h-1.5 bg-foreground/70 rounded-full absolute left-1/2 -translate-x-1/2"
          style={{ animation: "scroll-wheel 1.5s infinite" }}
        />
      </div>

      {/* Arrow chevrons */}
      <div className="mt-3 flex flex-col items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2.5 h-2.5 border-b-2 border-r-2 border-foreground/40 -mt-1"
            style={{
              transform: "rotate(45deg)",
              animation: `scroll-arrows 1.5s infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
