import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";

export const instalationRouter = createTRPCRouter({
  createInstalation: protectedProcedure
    .input(
      z.object({
        nome: z.string().max(20, "Nome muito grande"),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.instalation.create({
          data: {
            ...input,
            threshold: 0.5,
          },
        });
      } catch (error) {
        const _error = error as PrismaClientKnownRequestError;
        if (_error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Instalação já cadastrada",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),
  getAllInstalation: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.instalation.findMany({ orderBy: { nome: "asc" } });
  }),
});
