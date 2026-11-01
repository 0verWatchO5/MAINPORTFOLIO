import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function normalizeCertification(payload: unknown) {
  const body = payload as {
    name?: string;
    org?: string;
    year?: string;
    order?: number;
  };

  return {
    name: (body.name ?? "").trim(),
    org: (body.org ?? "").trim(),
    year: (body.year ?? "").trim(),
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
      return NextResponse.json({ error: "Invalid certification id" }, { status: 400 });
    }

    const certification = normalizeCertification(await request.json());
    if (!certification.name || !certification.org || !certification.year) {
      return NextResponse.json(
        { error: "Name, organization and validity period are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection("certifications").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...certification, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update certification", error);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid certification id" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("certifications").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete certification", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
