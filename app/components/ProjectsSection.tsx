"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  details: string;
  approach: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Metasploitable Network Security Assessment",
    description:
      "Performed a penetration test on Metasploitable, identifying and exploiting vulnerabilities.",
    category: "network",
    tags: ["Network Security", "Penetration Testing", "Vulnerability Assessment"],
    details:
      "Performed a penetration test on Metasploitable, identifying and exploiting vulnerabilities using Nmap, Metasploit, and other tools. Conducted reconnaissance, privilege escalation, and post-exploitation analysis in a controlled environment.",
    approach: [
      "Performed external and internal network scanning using Nmap and custom scripts",
      "Identified vulnerable services and outdated software",
      "Conducted manual testing to verify findings and eliminate false positives",
      "Exploited vulnerabilities to demonstrate potential impact",
      "Developed detailed remediation recommendations",
    ],
  },
  {
    id: 2,
    title: "OWASP Web Application Security Audit",
    description:
      "Conducted a black box penetration test on OWASP Juice Shop.",
    category: "web",
    tags: ["Web Application Security", "Penetration Testing", "OWASP"],
    details:
      "Performed a black box penetration test on OWASP Juice Shop to evaluate its security posture. Identified vulnerabilities such as SQL Injection, IDOR, and admin panel misconfigurations using Burp Suite and Wireshark.",
    approach: [
      "Performed internal network scanning using Nmap",
      "Identified vulnerable services and outdated technologies",
      "Conducted manual testing to verify findings and eliminate false positives",
      "Exploited vulnerabilities to demonstrate potential impact",
      "Developed detailed remediation recommendations",
    ],
  },
  {
    id: 3,
    title: "Acunetix Web Application Security Audit",
    description:
      "Conducted a black box penetration test to assess the security posture of Acunetix.",
    category: "web",
    tags: ["Web Application Security", "Penetration Testing", "Vulnerability Assessment"],
    details:
      "Performed a black box penetration test on Acunetix to evaluate its security posture. Identified security gaps through reconnaissance, vulnerability scanning, and exploit testing.",
    approach: [
      "Gathered information using open-source intelligence (OSINT) and network scanning",
      "Used automated tools to identify potential vulnerabilities and misconfigurations",
      "Attempted to exploit identified vulnerabilities to assess security defenses",
      "Evaluated the impact of successful exploits, including access control flaws",
      "Documented findings, calculated risk ratings, and recommended improvements",
    ],
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Network", value: "network" },
  { label: "Web", value: "web" },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Recent Projects"
          subtitle="Security assessments and penetration testing engagements"
        />

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${
                activeFilter === f.value
                  ? "bg-accent text-white border-accent"
                  : "border-white/10 text-text-muted hover:text-foreground hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-2xl bg-surface-light/50 border border-white/5 hover:border-primary/20 overflow-hidden transition-all"
              >
                {/* Color strip */}
                <div
                  className={`h-1.5 w-full ${
                    project.category === "network"
                      ? "bg-gradient-to-r from-primary to-blue-400"
                      : "bg-gradient-to-r from-accent to-accent-secondary"
                  }`}
                />

                <div className="p-6">
                  {/* Category badge */}
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
                      project.category === "network"
                        ? "text-blue-400 bg-blue-400/10"
                        : "text-accent bg-accent/10"
                    }`}
                  >
                    {project.category === "network"
                      ? "Network Security"
                      : "Web Security"}
                  </span>

                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-text-muted bg-white/5 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read more indicator */}
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Details</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="bg-surface border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header strip */}
              <div
                className={`h-2 w-full rounded-t-2xl ${
                  selectedProject.category === "network"
                    ? "bg-gradient-to-r from-primary to-blue-400"
                    : "bg-gradient-to-r from-accent to-accent-secondary"
                }`}
              />

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${
                        selectedProject.category === "network"
                          ? "text-blue-400 bg-blue-400/10"
                          : "text-accent bg-accent/10"
                      }`}
                    >
                      {selectedProject.category === "network"
                        ? "Network Security"
                        : "Web Security"}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-foreground hover:bg-white/10 transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>

                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                  Overview
                </h4>
                <p className="text-text-muted leading-relaxed mb-6">
                  {selectedProject.details}
                </p>

                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                  Approach
                </h4>
                <ul className="space-y-3 mb-6">
                  {selectedProject.approach.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                      <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-text-muted bg-white/5 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
