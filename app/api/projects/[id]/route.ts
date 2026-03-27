import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
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
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...project,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update project", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete project", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
