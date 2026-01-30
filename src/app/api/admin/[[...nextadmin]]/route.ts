import { createHandler } from "@premieroctet/next-admin/appHandler";
import { prisma } from "@/lib/prisma";
import { options } from "@/options";

export const { GET, POST } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options,
});