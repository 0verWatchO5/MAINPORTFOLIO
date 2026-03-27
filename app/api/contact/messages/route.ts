import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
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
