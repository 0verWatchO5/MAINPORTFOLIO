import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function normalizeProject(payload: unknown) {
  const body = payload as {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[] | string;
    details?: string;
    approach?: string[] | string;
    order?: number;
  };

  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tags === "string"
      ? body.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  const approach = Array.isArray(body.approach)
    ? body.approach
    : typeof body.approach === "string"
      ? body.approach.split("\n").map((step) => step.trim()).filter(Boolean)
      : [];

  return {
    title: (body.title ?? "").trim(),
    description: (body.description ?? "").trim(),
    category: (body.category ?? "").trim().toLowerCase(),
    tags,
    details: (body.details ?? "").trim(),
    approach,
    order: typeof body.order === "number" ? body.order : 0,
  };
}

export async function GET() {
  try {
    const db = await getDb();
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json(
      projects.map((project) => ({
        ...project,
        _id: project._id.toString(),
        createdAt: project.createdAt?.toISOString?.() ?? undefined,
        updatedAt: project.updatedAt?.toISOString?.() ?? undefined,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch projects", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const project = normalizeProject(payload);

    if (!project.title || !project.description || !project.category) {
      return NextResponse.json(
        { error: "Title, description and category are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();
    const result = await db.collection("projects").insertOne({
      ...project,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
