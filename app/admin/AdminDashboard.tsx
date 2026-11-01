"use client";

import { FormEvent, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import type { Blog, Certification, ContactMessage, ContactProfile } from "@/lib/types";

interface BlogFormState {
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  tags: string;
  publishedAt: string;
  order: number;
}

interface CertificationFormState {
  name: string;
  org: string;
  year: string;
  order: number;
}

const initialBlogForm: BlogFormState = {
  title: "",
  slug: "",
  content: "",
  coverImage: "",
  tags: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  order: 0,
};

const initialCertificationForm: CertificationFormState = {
  name: "",
  org: "",
  year: "",
  order: 0,
};

const initialProfile: ContactProfile = {
  _id: "profile",
  type: "profile",
  location: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
};

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [profile, setProfile] = useState<ContactProfile>(initialProfile);
  const [blogForm, setBlogForm] = useState<BlogFormState>(initialBlogForm);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [certificationForm, setCertificationForm] =
    useState<CertificationFormState>(initialCertificationForm);
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null);
  const [blogStatus, setBlogStatus] = useState("");
  const [certificationStatus, setCertificationStatus] = useState("");
  const [contactStatus, setContactStatus] = useState("");

  const loadBlogs = async () => {
    const response = await fetch("/api/blogs", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load blogs");
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Blogs API returned an invalid response");
    }
    setBlogs(data as Blog[]);
  };

  const loadCertifications = async () => {
    const response = await fetch("/api/certifications", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load certifications");
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Certifications API returned an invalid response");
    }
    setCertifications(data as Certification[]);
  };

  const loadContact = async () => {
    const [profileResponse, messagesResponse] = await Promise.all([
      fetch("/api/contact", { cache: "no-store" }),
      fetch("/api/contact/messages", { cache: "no-store" }),
    ]);

    const profileData = (await profileResponse.json()) as ContactProfile;
    const messagesData = (await messagesResponse.json()) as ContactMessage[];

    setProfile({ ...initialProfile, ...profileData });
    setMessages(messagesData);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([loadBlogs(), loadCertifications(), loadContact()]);
      } catch (error) {
        console.error(error);
      }
    };

    void loadData();
  }, []);

  const resetBlogForm = () => {
    setBlogForm(initialBlogForm);
    setEditingBlogId(null);
  };

  const resetCertificationForm = () => {
    setCertificationForm(initialCertificationForm);
    setEditingCertificationId(null);
  };

  const onSaveBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBlogStatus("Saving...");

    const payload = {
      ...blogForm,
      order: Number(blogForm.order),
    };

    const url = editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs";
    const method = editingBlogId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setBlogStatus("Failed to save blog");
      return;
    }

    await loadBlogs();
    resetBlogForm();
    setBlogStatus("Blog saved");
  };

  const onEditBlog = (blog: Blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      coverImage: blog.coverImage,
      tags: blog.tags.join(", "),
      publishedAt: blog.publishedAt,
      order: blog.order ?? 0,
    });
  };

  const onDeleteBlog = async (id: string) => {
    const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setBlogStatus("Failed to delete blog");
      return;
    }

    await loadBlogs();
    if (editingBlogId === id) {
      resetBlogForm();
    }
    setBlogStatus("Blog deleted");
  };

  const onMoveBlog = async (id: string, direction: -1 | 1) => {
    const currentIndex = blogs.findIndex((blog) => blog._id === id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= blogs.length) {
      return;
    }

    const reordered = [...blogs];
    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];
    setBlogs(reordered.map((blog, order) => ({ ...blog, order })));

    const response = await fetch("/api/blogs/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((blog) => blog._id) }),
    });

    if (!response.ok) {
      await loadBlogs();
      setBlogStatus("Failed to reorder blogs");
      return;
    }

    setBlogStatus("Blog order updated");
  };

  const onSaveCertification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCertificationStatus("Saving...");

    const url = editingCertificationId
      ? `/api/certifications/${editingCertificationId}`
      : "/api/certifications";
    const response = await fetch(url, {
      method: editingCertificationId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...certificationForm,
        order: Number(certificationForm.order),
      }),
    });

    if (!response.ok) {
      setCertificationStatus("Failed to save certification");
      return;
    }

    await loadCertifications();
    resetCertificationForm();
    setCertificationStatus("Certification saved");
  };

  const onEditCertification = (certification: Certification) => {
    setEditingCertificationId(certification._id);
    setCertificationForm({
      name: certification.name,
      org: certification.org,
      year: certification.year,
      order: certification.order ?? 0,
    });
  };

  const onDeleteCertification = async (id: string) => {
    const response = await fetch(`/api/certifications/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setCertificationStatus("Failed to delete certification");
      return;
    }

    await loadCertifications();
    if (editingCertificationId === id) {
      resetCertificationForm();
    }
    setCertificationStatus("Certification deleted");
  };

  const onMoveCertification = async (id: string, direction: -1 | 1) => {
    const currentIndex = certifications.findIndex((certification) => certification._id === id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= certifications.length) {
      return;
    }

    const reordered = [...certifications];
    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];
    setCertifications(reordered.map((certification, order) => ({ ...certification, order })));

    const response = await fetch("/api/certifications/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((certification) => certification._id) }),
    });

    if (!response.ok) {
      await loadCertifications();
      setCertificationStatus("Failed to reorder certifications");
      return;
    }

    setCertificationStatus("Certification order updated");
  };

  const onSaveContactProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("Saving...");

    const response = await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        linkedin: profile.linkedin,
        github: profile.github,
      }),
    });

    if (!response.ok) {
      setContactStatus("Failed to save contact profile");
      return;
    }

    await loadContact();
    setContactStatus("Contact profile updated");
  };

  const onDeleteMessage = async (id: string) => {
    const response = await fetch(`/api/contact/messages/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setContactStatus("Failed to delete message");
      return;
    }

    await loadContact();
    setContactStatus("Message deleted");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-2xl border border-white/10 bg-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-text-muted">
                Manage blogs, certifications and contact data stored in MongoDB.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/admin/login" })}
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-foreground hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="text-xl font-semibold text-foreground">
              {editingBlogId ? "Edit Blog" : "Create Blog"}
            </h2>
            <p className="mt-2 text-xs text-text-muted">
              Write blog content in Markdown. Tags should be comma separated.
            </p>

            <form onSubmit={onSaveBlog} className="mt-4 space-y-3">
              <input
                value={blogForm.title}
                onChange={(e) =>
                  setBlogForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Blog title"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={blogForm.slug}
                onChange={(e) =>
                  setBlogForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="Slug (e.g. iso-27001-audit-guide)"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={blogForm.coverImage}
                onChange={(e) =>
                  setBlogForm((prev) => ({ ...prev, coverImage: e.target.value }))
                }
                placeholder="Cloudinary cover image URL (optional)"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={blogForm.tags}
                onChange={(e) =>
                  setBlogForm((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Tag 1, Tag 2"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <textarea
                value={blogForm.content}
                onChange={(e) =>
                  setBlogForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write your blog in Markdown"
                required
                rows={12}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={blogForm.publishedAt}
                onChange={(e) =>
                  setBlogForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
                type="date"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
                >
                  {editingBlogId ? "Update Blog" : "Create Blog"}
                </button>
                {editingBlogId && (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {blogStatus && <p className="text-xs text-text-muted">{blogStatus}</p>}
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="text-xl font-semibold text-foreground">
              {editingCertificationId ? "Edit Certification" : "Create Certification"}
            </h2>
            <p className="mt-2 text-xs text-text-muted">
              Add the certification name, issuing organization and validity period.
            </p>

            <form onSubmit={onSaveCertification} className="mt-4 space-y-3">
              <input
                value={certificationForm.name}
                onChange={(e) =>
                  setCertificationForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Certification name"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={certificationForm.org}
                onChange={(e) =>
                  setCertificationForm((prev) => ({ ...prev, org: e.target.value }))
                }
                placeholder="Issuing organization"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={certificationForm.year}
                onChange={(e) =>
                  setCertificationForm((prev) => ({ ...prev, year: e.target.value }))
                }
                placeholder="Validity period (e.g. Feb 2026 - Feb 2029)"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
                >
                  {editingCertificationId ? "Update Certification" : "Create Certification"}
                </button>
                {editingCertificationId && (
                  <button
                    type="button"
                    onClick={resetCertificationForm}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {certificationStatus && (
                <p className="text-xs text-text-muted">{certificationStatus}</p>
              )}
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="text-xl font-semibold text-foreground">Contact Profile</h2>

            <form onSubmit={onSaveContactProfile} className="mt-4 space-y-3">
              <input
                value={profile.location}
                onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Location"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={profile.phone}
                onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={profile.linkedin}
                onChange={(e) => setProfile((prev) => ({ ...prev, linkedin: e.target.value }))}
                placeholder="LinkedIn URL"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={profile.github}
                onChange={(e) => setProfile((prev) => ({ ...prev, github: e.target.value }))}
                placeholder="GitHub URL"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <button
                type="submit"
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
              >
                Save Contact Profile
              </button>
              {contactStatus && <p className="text-xs text-text-muted">{contactStatus}</p>}
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">Certifications</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-text-muted">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Organization</th>
                  <th className="px-3 py-2">Validity</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((certification) => (
                  <tr key={certification._id} className="border-b border-white/5">
                    <td className="px-3 py-2 text-foreground">{certification.name}</td>
                    <td className="px-3 py-2 text-text-muted">{certification.org}</td>
                    <td className="px-3 py-2 text-text-muted">{certification.year}</td>
                    <td className="px-3 py-2 text-text-muted">{(certification.order ?? 0) + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => void onMoveCertification(certification._id, -1)}
                          disabled={certification.order === 0}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          onClick={() => void onMoveCertification(certification._id, 1)}
                          disabled={certification.order === certifications.length - 1}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button
                          onClick={() => onEditCertification(certification)}
                          className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => void onDeleteCertification(certification._id)}
                          className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {certifications.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-text-muted" colSpan={5}>
                      No certifications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">Blogs</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-text-muted">
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Published</th>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-white/5">
                    <td className="px-3 py-2 text-foreground">{blog.title}</td>
                    <td className="px-3 py-2 text-text-muted">{blog.publishedAt}</td>
                    <td className="px-3 py-2 text-text-muted">{blog.slug}</td>
                    <td className="px-3 py-2 text-text-muted">{(blog.order ?? 0) + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => void onMoveBlog(blog._id, -1)}
                          disabled={blog.order === 0}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          onClick={() => void onMoveBlog(blog._id, 1)}
                          disabled={blog.order === blogs.length - 1}
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button
                          onClick={() => onEditBlog(blog)}
                          className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => void onDeleteBlog(blog._id)}
                          className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-text-muted" colSpan={5}>
                      No blogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">Contact Messages</h2>
          <div className="mt-4 space-y-3">
            {messages.map((message) => (
              <article
                key={message._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{message.subject}</h3>
                  <button
                    onClick={() => void onDeleteMessage(message._id)}
                    className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-400"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  {message.name} - {message.email}
                </p>
                <p className="mt-2 text-sm text-foreground/90">{message.message}</p>
              </article>
            ))}
            {messages.length === 0 && (
              <p className="text-sm text-text-muted">No contact messages yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
