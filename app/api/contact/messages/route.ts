import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const messages = await db
      .collection("contact")
      .find({ type: "message" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      messages.map((message) => ({
        ...message,
        _id: message._id.toString(),
        createdAt: message.createdAt?.toISOString?.() ?? undefined,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch contact messages", error);
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
  }
}
