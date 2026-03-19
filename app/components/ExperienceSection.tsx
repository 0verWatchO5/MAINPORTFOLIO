"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const experiences = [
  {
    title: "Information Security Officer",
    company: "Austrange Solutions",
    period: "Nov 2025 – Present",
    location: "Mumbai, Maharashtra · Hybrid",
    highlights: [
      "Conducted OWASP Top 10–based web security assessments to identify application vulnerabilities",
      "Assisted with risk analysis and remediation recommendations for security findings",
      "Developing an ISO/IEC 27001 aligned ISMS framework to support compliance readiness",
      "Built a custom Python vulnerability scanner to automate web security checks",
    ],
  },
  {
    title: "InfoSec Consultant",
    company: "Quasar CyberTech",
    period: "Mar 2025 – Jun 2025",
    location: "Nashik, Maharashtra · Remote",
    highlights: [
      "Conducted manual web application security assessments aligned with OWASP WSTG",
      "Developed custom CLI tools to automate Clickjacking detection, Google Dorking, and HTTP security header scanning",
      "Used custom scripts and tailored Nessus profiles to improve testing depth and accuracy",
    ],
  },
  {
    title: "PenTesting Intern",
    company: "CyberStriveX",
    period: "Mar 2025",
    location: "Remote",
    highlights: [
      "Conducted a black box penetration test to evaluate the security posture of Acunetix",
      "Identified security gaps and recommended remediation strategies",
      "Strengthened expertise in ethical hacking, exploit testing, and network security",
    ],
  },
  {
    title: "PenTesting Intern",
    company: "InternIntelligence",
    period: "Feb 2025",
    location: "Remote",
    highlights: [
      "Conducted a black box penetration test on OWASP Juice Shop using Burp Suite & Wireshark",
      "Reviewed and enhanced Access Control, Data Protection, and Incident Response policies",
      "Proposed security improvements aligned with ISO 27001 & NIST for compliance and risk management",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 md:py-32 relative bg-surface/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Experience"
          subtitle="Professional journey in cybersecurity & information security"
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent md:-translate-x-px" />

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title + exp.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex flex-col md:flex-row md:gap-8 mb-12 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background -translate-x-1/2 mt-1 z-10" />

              {/* Date badge — positioned on opposite side */}
              <div
                className={`hidden md:flex md:w-1/2 items-start ${
                  i % 2 === 0 ? "justify-end pr-10" : "justify-start pl-10"
                }`}
              >
                <span className="mt-1 inline-block text-xs font-semibold text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
                  {exp.period}
                </span>
              </div>

              {/* Content card */}
              <div
                className={`ml-14 md:ml-0 md:w-1/2 ${
                  i % 2 === 0 ? "md:pl-10" : "md:pr-10"
                }`}
              >
                {/* Mobile date badge */}
                <span className="md:hidden inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-3">
                  {exp.period}
                </span>

                <div className="p-5 rounded-2xl bg-surface-light/50 border border-white/5 hover:border-primary/15 transition-all group">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-accent font-medium mb-1">
                    {exp.company}
                  </p>
                  <p className="text-xs text-text-muted mb-4">{exp.location}</p>
                  <ul className="space-y-2.5">
                    {exp.highlights.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-text-muted"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
