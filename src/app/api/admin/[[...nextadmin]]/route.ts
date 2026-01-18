import { createHandler } from "@premieroctet/next-admin/appRouter";
import { prisma } from "@/lib/prisma";
import { options } from "@/options";

export const { GET, POST } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options,
});