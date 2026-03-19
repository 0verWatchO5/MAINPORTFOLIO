"use client";

import { motion } from "framer-motion";

export default function CodeBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
      className="gradient-border p-5 md:p-6 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-text-muted font-mono">
          security_assessment.js
        </span>
      </div>

      <pre className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
        <code>
          <span className="code-comment">
            {"// Penetration Testing Protocol"}
          </span>
          {"\n"}
          <span className="code-keyword">{"function "}</span>
          <span className="code-function">{"securityAssessment"}</span>
          {"() {"}
          {"\n"}
          {"  "}
          <span className="code-keyword">{"const "}</span>
          <span className="code-variable">{"target"}</span>
          {" = "}
          <span className="code-string">{'"network.target.com"'}</span>
          {";"}
          {"\n"}
          {"  "}
          <span className="code-keyword">{"const "}</span>
          <span className="code-variable">{"phases"}</span>
          {" = ["}
          {"\n"}
          {'    '}
          <span className="code-string">{'"reconnaissance"'}</span>
          {","}
          {"\n"}
          {'    '}
          <span className="code-string">{'"scanning"'}</span>
          {","}
          {"\n"}
          {'    '}
          <span className="code-string">{'"vulnerability-analysis"'}</span>
          {","}
          {"\n"}
          {'    '}
          <span className="code-string">{'"exploitation"'}</span>
          {","}
          {"\n"}
          {'    '}
          <span className="code-string">{'"post-exploitation"'}</span>
          {","}
          {"\n"}
          {'    '}
          <span className="code-string">{'"reporting"'}</span>
          {"\n"}
          {"  ];"}
          {"\n\n"}
          {"  "}
          <span className="code-keyword">{"return "}</span>
          <span className="code-function">{"executeAssessment"}</span>
          {"("}
          <span className="code-variable">{"target"}</span>
          {", "}
          <span className="code-variable">{"phases"}</span>
          {");"}
          {"\n"}
          {"}"}
          {"\n\n"}
          <span className="code-function">{"securityAssessment"}</span>
          {"();"}
        </code>
      </pre>
    </motion.div>
  );
}
