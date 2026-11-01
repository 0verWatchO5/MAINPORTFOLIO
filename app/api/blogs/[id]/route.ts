import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function normalizeBlog(payload: unknown) {
  const body = payload as Record<string, unknown>;
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean)
    : typeof body.tags === "string"
      ? body.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];
  return {
    title: typeof body.title === "string" ? body.title.trim() : "",
    slug: typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "",
    content: typeof body.content === "string" ? body.content.trim() : "",
    coverImage: typeof body.coverImage === "string" ? body.coverImage.trim() : "",
    tags,
    publishedAt: typeof body.publishedAt === "string" ? body.publishedAt.trim() : "",
    order: typeof body.order === "number" ? body.order : 0,
  };
}

async function adminAuthorized() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.email && isAdminEmail(session.user.email));
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (!(await adminAuthorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    const blog = normalizeBlog(await request.json());
    if (!blog.title || !blog.slug || !blog.content || !blog.publishedAt) {
      return NextResponse.json({ error: "Title, slug, content and published date are required." }, { status: 400 });
    }
    const result = await (await getDb()).collection("blogs").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...blog, updatedAt: new Date() } }
    );
    if (!result.matchedCount) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update blog", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (!(await adminAuthorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    const result = await (await getDb()).collection("blogs").deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete blog", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
