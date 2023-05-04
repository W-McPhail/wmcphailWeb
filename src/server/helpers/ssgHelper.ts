import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "npm/server/api/root";
import { prisma } from "npm/server/db";
import superjson from "superjson";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });