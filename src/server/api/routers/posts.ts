import { z } from "zod";
import type { User } from "@clerk/nextjs/dist/api";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "npm/server/api/trpc";
import clerkClient from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
        orderBy: [{ createdAt: "desc" }],
    });

    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    });

    // console.log(users);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author || !author.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });

      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
    });
  }),

  create: privateProcedure
    .input(z.object({
        content: z.string().min(1).max(280),

    })
    )
    .mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId;

    const post = await ctx.prisma.post.create({
        data: {
            authorId,
            content: input.content,
        },
    });



  }),
});
