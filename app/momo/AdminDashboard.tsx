"use client";

import { FormEvent, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import type { ContactMessage, ContactProfile, Project } from "@/lib/types";

interface ProjectFormState {
  title: string;
  description: string;
  category: string;
  tags: string;
  details: string;
  approach: string;
  order: number;
}

const initialProjectForm: ProjectFormState = {
  title: "",
  description: "",
  category: "web",
  tags: "",
  details: "",
  approach: "",
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [profile, setProfile] = useState<ContactProfile>(initialProfile);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(initialProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState("");
  const [contactStatus, setContactStatus] = useState("");

  const loadProjects = async () => {
    const response = await fetch("/api/projects", { cache: "no-store" });
    const data = (await response.json()) as Project[];
    setProjects(data);
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
        await Promise.all([loadProjects(), loadContact()]);
      } catch (error) {
        console.error(error);
      }
    };

    void loadData();
  }, []);

  const resetProjectForm = () => {
    setProjectForm(initialProjectForm);
    setEditingProjectId(null);
  };

  const onSaveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProjectStatus("Saving...");

    const payload = {
      title: projectForm.title,
      description: projectForm.description,
      category: projectForm.category,
      tags: projectForm.tags,
      details: projectForm.details,
      approach: projectForm.approach,
      order: Number(projectForm.order),
    };

    const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";
    const method = editingProjectId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setProjectStatus("Failed to save project");
      return;
    }

    await loadProjects();
    resetProjectForm();
    setProjectStatus("Project saved");
  };

  const onEditProject = (project: Project) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags.join(", "),
      details: project.details,
      approach: project.approach.join("\n"),
      order: project.order ?? 0,
    });
  };

  const onDeleteProject = async (id: string) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setProjectStatus("Failed to delete project");
      return;
    }

    await loadProjects();
    if (editingProjectId === id) {
      resetProjectForm();
    }
    setProjectStatus("Project deleted");
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
                Manage projects and contact data stored in MongoDB.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/momo/login" })}
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-foreground hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="text-xl font-semibold text-foreground">
              {editingProjectId ? "Edit Project" : "Create Project"}
            </h2>
            <p className="mt-2 text-xs text-text-muted">
              Tags should be comma separated. Approach should be one line per step.
            </p>

            <form onSubmit={onSaveProject} className="mt-4 space-y-3">
              <input
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Title"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Short description"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={projectForm.category}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="Category (web/network)"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                value={projectForm.tags}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Tag 1, Tag 2"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <textarea
                value={projectForm.details}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, details: e.target.value }))
                }
                placeholder="Detailed overview"
                required
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <textarea
                value={projectForm.approach}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, approach: e.target.value }))
                }
                placeholder="Step one&#10;Step two"
                rows={5}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />
              <input
                type="number"
                value={projectForm.order}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, order: Number(e.target.value) }))
                }
                placeholder="Display order"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
                >
                  {editingProjectId ? "Update Project" : "Create Project"}
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {projectStatus && <p className="text-xs text-text-muted">{projectStatus}</p>}
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
          <h2 className="text-xl font-semibold text-foreground">Projects</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-text-muted">
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-b border-white/5">
                    <td className="px-3 py-2 text-foreground">{project.title}</td>
                    <td className="px-3 py-2 text-text-muted">{project.category}</td>
                    <td className="px-3 py-2 text-text-muted">{project.order ?? 0}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditProject(project)}
                          className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => void onDeleteProject(project._id)}
                          className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-text-muted" colSpan={4}>
                      No projects found.
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
