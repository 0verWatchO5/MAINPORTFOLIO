"use client";

import { motion } from "framer-motion";
import ScrollIndicator from "./ScrollIndicator";

const focusAreas = [
  { number: "01", label: "Governance", detail: "Policies, ownership & accountability" },
  { number: "02", label: "Risk", detail: "Assessment, treatment & visibility" },
  { number: "03", label: "Assurance", detail: "Controls, evidence & readiness" },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden hero-grid-bg">
      <div className="absolute -right-32 top-24 h-80 w-80 rounded-full border-[48px] border-primary/10 pointer-events-none" />
      <div className="absolute right-16 top-40 h-36 w-36 rounded-full bg-accent/10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32 md:py-40">
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-6"
          >
            Mayuresh Chaubal / GRC Analyst
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-4xl text-5xl sm:text-7xl lg:text-[7.5rem] leading-[0.9] font-bold tracking-[-0.08em] text-foreground"
          >
            Make security
            <span className="block text-primary">make sense.</span>
          </motion.h1>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-xl text-lg md:text-xl leading-relaxed text-text-muted"
            >
              GRC Analyst at <strong className="text-foreground">Securis360 Inc.</strong>,
              connecting risk, controls, and compliance with the technical reality
              of modern information security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <a href="#experience" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white">
                View experience <span aria-hidden="true">↗</span>
              </a>
              <a href="#contact" className="btn-secondary inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm text-foreground">
                Let&apos;s connect
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 border-y border-primary/20"
          >
            {focusAreas.map((area) => (
              <div key={area.number} className="py-5 sm:px-6 first:pl-0 border-primary/20 sm:border-r last:border-r-0">
                <span className="text-xs font-mono text-accent">{area.number}</span>
                <h2 className="mt-3 text-lg font-semibold text-foreground">{area.label}</h2>
                <p className="mt-1 text-sm text-text-muted">{area.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
}
