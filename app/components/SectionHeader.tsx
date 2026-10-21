"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="text-left mb-14 max-w-3xl"
    >
      <p className="eyebrow mb-4">01 / Portfolio</p>
      <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.05em] text-foreground mb-4 inline-block relative">
        {title}
      </h2>
      <p className="text-text-muted text-lg max-w-2xl mt-3">
        {subtitle}
      </p>
    </motion.div>
  );
}
