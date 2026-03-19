"use client";

import { motion } from "framer-motion";
import GlitchText from "./GlitchText";
import CodeBlock from "./CodeBlock";
import NetworkCanvas from "./NetworkCanvas";
import ScrollIndicator from "./ScrollIndicator";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden hero-grid-bg"
    >
      {/* Ambient gradient blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

      {/* Network canvas behind everything */}
      <div className="absolute inset-0 z-0">
        <NetworkCanvas />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text Content */}
          <div className="flex flex-col gap-6">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-widest text-primary">
                Available for work
              </span>
            </motion.div>

            {/* Glitch heading */}
            <GlitchText text="CYBERSECURITY" />

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-accent"
            >
              Information Security Officer
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base sm:text-lg text-text-muted max-w-lg leading-relaxed"
            >
              Securing networks and applications through advanced penetration
              testing, vulnerability assessment, and security consulting.
              Implementing ISO/IEC 27001 concepts for compliance-driven security.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <a
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm uppercase tracking-wider text-white"
              >
                <span>Get In Touch</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <a
                href="#projects"
                className="btn-secondary inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm uppercase tracking-wider text-foreground"
              >
                <span>View Projects</span>
              </a>
            </motion.div>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex gap-8 mt-6 pt-6 border-t border-white/10"
            >
              {[
                { value: "3+", label: "Certifications" },
                { value: "5+", label: "Projects" },
                { value: "OWASP", label: "Top 10 Expert" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-xl md:text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Code Block */}
          <div className="relative">
            <CodeBlock />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
