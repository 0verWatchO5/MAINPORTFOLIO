import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const defaultProfile = {
  type: "profile" as const,
  location: "Mumbai, Maharashtra",
  email: "mayureshchaubal57@gmail.com",
  phone: "+91 7021524797",
  linkedin: "https://linkedin.com/in/mayuresh-chaubal",
  github: "https://github.com/0verWatchO5",
};

export async function GET() {
  try {
    const db = await getDb();
    const profile = await db.collection("contact").findOne({ type: "profile" });

    if (!profile) {
      return NextResponse.json(defaultProfile);
    }

    return NextResponse.json({
      ...profile,
      _id: profile._id.toString(),
      updatedAt: profile.updatedAt?.toISOString?.() ?? undefined,
    });
  } catch (error) {
    console.error("Failed to load contact profile", error);
    return NextResponse.json({ error: "Failed to load contact profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      location?: string;
      email?: string;
      phone?: string;
      linkedin?: string;
      github?: string;
    };

    const profile = {
      type: "profile" as const,
      location: (body.location ?? "").trim(),
      email: (body.email ?? "").trim(),
      phone: (body.phone ?? "").trim(),
      linkedin: (body.linkedin ?? "").trim(),
      github: (body.github ?? "").trim(),
      updatedAt: new Date(),
    };

    if (!profile.email || !profile.phone) {
      return NextResponse.json(
        { error: "Email and phone are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection("contact").updateOne(
      { type: "profile" },
      {
        $set: profile,
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update contact profile", error);
    return NextResponse.json({ error: "Failed to update contact profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const message = {
      type: "message" as const,
      name: (body.name ?? "").trim(),
      email: (body.email ?? "").trim(),
      subject: (body.subject ?? "").trim(),
      message: (body.message ?? "").trim(),
      createdAt: new Date(),
    };

    if (!message.name || !message.email || !message.subject || !message.message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection("contact").insertOne(message);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact message", error);
    return NextResponse.json({ error: "Failed to save contact message" }, { status: 500 });
  }
}
