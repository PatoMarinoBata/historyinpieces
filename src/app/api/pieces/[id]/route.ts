import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const piece = await prisma.piece.findUnique({ where: { id: params.id } });
    if (!piece) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(piece);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch piece" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const category = typeof body.category === "string" ? body.category.toUpperCase() : undefined;
    const allowed = ["PAINTING", "CAR", "STATUE", "COLLECTIBLE", "DOCUMENT", "OTHER"];
    const piece = await prisma.piece.update({
      where: { id: params.id },
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
        category: allowed.includes(category ?? "") ? (category as any) : undefined,
      },
    });
    return NextResponse.json(piece);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update piece" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.piece.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete piece" }, { status: 500 });
  }
}
