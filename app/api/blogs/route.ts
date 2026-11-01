import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function normalizeBlog(payload: unknown) {
  const body = payload as {
    title?: string;
    slug?: string;
    content?: string;
    coverImage?: string;
    tags?: string[] | string;
    publishedAt?: string;
    order?: number;
  };
  const tags = Array.isArray(body.tags)
    ? body.tags.map((tag) => tag.trim()).filter(Boolean)
    : typeof body.tags === "string"
      ? body.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  return {
    title: (body.title ?? "").trim(),
    slug: (body.slug ?? "").trim().toLowerCase(),
    content: (body.content ?? "").trim(),
    coverImage: (body.coverImage ?? "").trim(),
    tags,
    publishedAt: (body.publishedAt ?? "").trim(),
    order: typeof body.order === "number" ? body.order : 0,
  };
}

export async function GET() {
  try {
    const db = await getDb();
    const blogs = await db.collection("blogs").find({}).sort({ order: 1, publishedAt: -1 }).toArray();
    return NextResponse.json(
      blogs.map((blog) => ({
        ...blog,
        _id: blog._id.toString(),
        createdAt: blog.createdAt?.toISOString?.() ?? undefined,
        updatedAt: blog.updatedAt?.toISOString?.() ?? undefined,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch blogs", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const blog = normalizeBlog(await request.json());
    if (!blog.title || !blog.slug || !blog.content || !blog.publishedAt) {
      return NextResponse.json(
        { error: "Title, slug, content and published date are required." },
        { status: 400 }
      );
    }
    const now = new Date();
    const db = await getDb();
    const order = await db.collection("blogs").countDocuments();
    const result = await db.collection("blogs").insertOne({
      ...blog,
      order,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
