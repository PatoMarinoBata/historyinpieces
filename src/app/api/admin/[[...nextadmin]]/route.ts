import { createHandler } from "@premieroctet/next-admin/appHandler";
import { prisma } from "@/lib/prisma";
import { options } from "@/options";
import type { NextRequest } from "next/server";

const handler = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options,
});

export async function GET(req: NextRequest, context: { params: Promise<{ nextadmin?: string[] }> }) {
  const params = await context.params;
  return handler.run(req, { params: { nextadmin: params.nextadmin || [] } } as any);
}

export async function POST(req: NextRequest, context: { params: Promise<{ nextadmin?: string[] }> }) {
  const params = await context.params;
  return handler.run(req, { params: { nextadmin: params.nextadmin || [] } } as any);
}