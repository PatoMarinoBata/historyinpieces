import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const pieces = await prisma.piece.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(pieces);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch pieces" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const piece = await prisma.piece.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        history: body.history ?? null,
        images: Array.isArray(body.images)
          ? body.images
          : typeof body.images === "string" && body.images.trim().length
          ? body.images.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        transactionHistory: body.transactionHistory ?? null,
        lastSoldPrice: body.lastSoldPrice ?? null,
        lastSoldDate: body.lastSoldDate ? new Date(body.lastSoldDate) : null,
      },
    });
    return NextResponse.json(piece, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create piece" }, { status: 500 });
  }
}
