import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { ids?: unknown };
    if (
      !Array.isArray(body.ids) ||
      body.ids.some((id) => typeof id !== "string")
    ) {
      return NextResponse.json({ error: "A valid certification order is required." }, { status: 400 });
    }

    const db = await getDb();
    const certifications = db.collection("certifications");
    await Promise.all(
      body.ids.map((id, order) =>
        ObjectId.isValid(id)
          ? certifications.updateOne(
              { _id: new ObjectId(id) },
              { $set: { order, updatedAt: new Date() } }
            )
          : Promise.resolve()
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to reorder certifications", error);
    return NextResponse.json({ error: "Failed to reorder certifications" }, { status: 500 });
  }
}
