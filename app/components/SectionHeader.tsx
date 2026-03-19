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
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 inline-block relative">
        {title}
        <span className="block h-1 w-20 mx-auto mt-3 rounded-full bg-gradient-to-r from-accent to-accent-secondary" />
      </h2>
      <p className="text-text-muted text-lg max-w-2xl mx-auto mt-4">
        {subtitle}
      </p>
    </motion.div>
  );
}
