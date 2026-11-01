"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import type { Blog } from "@/lib/types";

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadBlogs = async () => {
      try {
        const response = await fetch("/api/blogs", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load blogs");
        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Blogs API returned an invalid response");
        }

        setBlogs(data as Blog[]);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setBlogs([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void loadBlogs();
    return () => controller.abort();
  }, []);

  return (
    <section id="blogs" className="editorial-section py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Writing"
          subtitle="Notes on GRC, security governance, audits, and compliance"
        />
        {loading && <p className="py-8 text-center text-sm text-text-muted">Loading blogs...</p>}
        {!loading && blogs.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">
            New articles are coming soon.
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <motion.article
              key={blog._id}
              whileHover={{ y: -6 }}
              className="editorial-card overflow-hidden rounded-2xl"
            >
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt=""
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-6">
                <p className="text-xs text-text-muted">{blog.publishedAt}</p>
                <h3 className="mt-2 text-xl font-bold text-foreground">{blog.title}</h3>
                <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
                  {blog.content}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
