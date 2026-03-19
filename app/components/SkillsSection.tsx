"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";

const tabs = [
  { id: "technical", label: "Technical Skills" },
  { id: "tools", label: "Tools & Technologies" },
  { id: "certs", label: "Certifications" },
];

const technicalSkills = [
  "Network Penetration Testing",
  "Web Application Security",
  "API Security Testing",
  "Vulnerability Assessment & Exploitation",
  "Reverse Engineering",
  "OWASP Top 10 Analysis",
  "Endpoint Vulnerability Assessment",
  "SQL Injection & XSS",
  "CSRF & IDOR Detection",
  "Packet Analysis",
  "API Testing",
  "Linux Administration",
];

const tools = [
  { name: "Burp Suite", icon: "🔍" },
  { name: "Kali Linux", icon: "🐉" },
  { name: "Nmap", icon: "📡" },
  { name: "Metasploit", icon: "💉" },
  { name: "Wireshark", icon: "🦈" },
  { name: "OWASP ZAP", icon: "⚡" },
  { name: "SQLMap", icon: "🗃️" },
  { name: "Nessus", icon: "🛡️" },
  { name: "Python", icon: "🐍" },
  { name: "Bash", icon: "💻" },
  { name: "Caido", icon: "🔧" },
  { name: "ZAProxy", icon: "🌐" },
];

const certifications = [
  {
    name: "ISO 27001 Lead Auditor",
    org: "Mastermind",
    year: "2026",
  },
  {
    name: "Ethical Hacker",
    org: "CISCO",
    year: "2025",
  },
  {
    name: "Jr. Penetration Tester",
    org: "TryHackMe",
    year: "2025",
  },
  {
    name: "Vulnerability Assessment & Penetration Testing (VAPT)",
    org: "Alison",
    year: "2025",
  },
];

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState("technical");

  return (
    <section id="skills" className="py-24 md:py-32 relative bg-surface/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="My Skills"
          subtitle="Technical expertise, tools, and certifications in cybersecurity"
        />

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-2.5 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-text-muted hover:text-foreground border border-white/10 hover:border-white/20"
              }`}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="skills-tab-bg"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-secondary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "technical" && (
            <motion.div
              key="technical"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
            >
              {technicalSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-5 py-2.5 rounded-full bg-surface-light/50 border border-white/5 hover:border-primary/25 text-sm font-medium text-foreground hover:text-primary transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          )}

          {activeTab === "tools" && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-xl bg-surface-light/50 border border-white/5 hover:border-primary/20 transition-all text-center group"
                >
                  <span className="text-2xl block mb-2">{tool.icon}</span>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h4>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "certs" && (
            <motion.div
              key="certs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto space-y-4"
            >
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-light/50 border border-white/5 hover:border-accent/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {cert.name}
                    </h4>
                    <p className="text-xs text-text-muted">{cert.org}</p>
                  </div>
                  <span className="text-xs font-medium text-text-muted bg-white/5 px-3 py-1 rounded-full shrink-0">
                    {cert.year}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
