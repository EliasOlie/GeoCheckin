import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";

import * as bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome requerido"),
        contact: z
          .string()
          .min(1, "Contato requerido")
          .max(11, "Numero muito grande"),
        password: z.string().min(1, "Senha requerida"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.user.create({
          data: {
            ...input,
            password: bcrypt.hashSync(input.password, 12),
          },
        });
      } catch (error) {
        const _error = error as PrismaClientKnownRequestError;
        if (_error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exists",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      } else if (!ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: parseInt(ctx.session.user.id as unknown as string),
        },
      });

      return user;
    } catch (error) {
      const _error = error as PrismaClientKnownRequestError;
      if (_error.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
    }
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        contact: z.string().optional(),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        } else if (!ctx.session.user.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        const user = await ctx.db.user.findUniqueOrThrow({
          where: {
            id: parseInt(ctx.session.user.id as unknown as string),
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        await ctx.db.user.update({
          where: {
            id: parseInt(ctx.session.user.id as unknown as string),
          },
          data: {
            ...input,
            password: input.password
              ? await bcrypt.hash(input.password, 12)
              : user.password,
          },
        });
      } catch (error) {
        const _error = error as PrismaClientKnownRequestError;
        if (_error.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
      }
    }),
});