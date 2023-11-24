import * as z from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { isInRange } from "@/utils/geo";
import { TRPCError } from "@trpc/server";

export const daillyRouter = createTRPCRouter({
  checkIn: protectedProcedure
  .input(z.object({
    latitude: z.number(),
    longitude: z.number()
  }))
  .mutation(async({ ctx, input }) => {
    const instalacao = await ctx.db.instalation.findFirst()
    if(!instalacao) {
      return null
    }
    if(isInRange(instalacao.latitude, instalacao.longitude, input.latitude, input.longitude, instalacao.threshold)) {
      try {
         await ctx.db.checkin.create({
           data: {
             userId: ctx.session.user.id
          }
        })
      } catch (error) {
          throw new TRPCError({
           code: "BAD_REQUEST",
           message: "Tente novamente daqui a pouco, se persistir chame a assistência.",
         });
      }
    } else {
      throw new TRPCError({
         code: "BAD_REQUEST",
         message: "Parece que você não está em uma localização registrada",
       });
    }
  }),

  checkOut: protectedProcedure
  .input(z.object({
    latitude: z.number(),
    longitude: z.number()
  }))
  .mutation(async({ ctx, input }) => {
    const instalacao = await ctx.db.instalation.findFirst()
    if(!instalacao) {
      return null
    }
    if(isInRange(instalacao.latitude, instalacao.longitude, input.latitude, input.longitude, instalacao.threshold)) {
      await ctx.db.checkout.create({
        data: {
          userId: ctx.session.user.id
        }
      })
    } else {
      return null
    }
  }),
});
