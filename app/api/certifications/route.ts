import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

const defaultCertifications = [
  {
    name: "ISO/IEC 42001 Lead Auditor",
    org: "Mastermind",
    year: "May 2026 – May 2029",
    order: 0,
  },
  {
    name: "ISO/IEC 27001 Lead Auditor",
    org: "Mastermind",
    year: "Feb 2026 – Feb 2029",
    order: 1,
  },
  {
    name: "ISO/IEC 27701 Lead Auditor",
    org: "Mastermind",
    year: "Oct 2026 – Oct 2029",
    order: 2,
  },
];

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

export async function GET() {
  try {
    const db = await getDb();
    const certificationsCollection = db.collection("certifications");
    const certificationCount = await certificationsCollection.countDocuments();
    const seedMarker = await db
      .collection("settings")
      .findOne({ _id: "certifications-seeded" });

    if (certificationCount === 0 && !seedMarker) {
      const now = new Date();
      await certificationsCollection.insertMany(
        defaultCertifications.map((certification) => ({
          ...certification,
          createdAt: now,
          updatedAt: now,
        }))
      );
      await db.collection("settings").insertOne({
        _id: "certifications-seeded",
        createdAt: now,
      });
    }

    const certifications = await certificationsCollection
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json(
      certifications.map((certification) => ({
        ...certification,
        _id: certification._id.toString(),
        createdAt: certification.createdAt?.toISOString?.() ?? undefined,
        updatedAt: certification.updatedAt?.toISOString?.() ?? undefined,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch certifications", error);
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certification = normalizeCertification(await request.json());
    if (!certification.name || !certification.org || !certification.year) {
      return NextResponse.json(
        { error: "Name, organization and validity period are required." },
        { status: 400 }
      );
    }

    const now = new Date();
    const db = await getDb();
    const result = await db.collection("certifications").insertOne({
      ...certification,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to create certification", error);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}
