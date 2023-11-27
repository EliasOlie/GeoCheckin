import * as z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { isInRange } from "@/utils/geo";
import { TRPCError } from "@trpc/server";
import { Instalation } from "@prisma/client";

export const daillyRouter = createTRPCRouter({
  /*
    Procedimento padrão para checkin e checkout:
    1° Mapear sobre todas as instalações
    2° Testar se a localização está no range
    3° Se nenhuma retronar true, jogar error de localização
    4° Apenas uma retornará true o que continuara o fluxo dos chekins e checkouts

    Prós:
      Simples
    Contra:
      Muito custosa! A instalação que o usuário está pode ser a última do array então ele teria que fazer n-1 operações antes de fazer a valida, sem contar que quando for em um
      local não cadastrado ele fará n operações

    Alternativa:
    1° User o query raw para trazer o array de instalações ordenado do mais próximo ao mais longe e tentar fazer o procedimento sempre a partir do mais próximo
    const results = await prisma.$queryRaw`
    SELECT *, (
      6371 * acos(
        cos(radians(${userLatitude})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${userLongitude})) +
        sin(radians(${userLatitude})) * sin(radians(latitude))
      )
    ) AS distance
    FROM Instalation
    ORDER BY distance ASC
    `;

  */
  checkIn: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.db.$queryRaw<Instalation[]>`
      SELECT *, (
      6371 * acos(
        cos(radians(${input.latitude})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${input.longitude})) +
        sin(radians(${input.latitude})) * sin(radians(latitude))
      )
    ) AS distance
    FROM "Instalation"
    ORDER BY distance ASC
    `;

      const instalacao = results[0]
      if (!instalacao) {
        return null;
      }
      if (
        isInRange(
          instalacao.latitude,
          instalacao.longitude,
          input.latitude,
          input.longitude,
          instalacao.threshold,
        )
      ) {
        await ctx.db.checkin.create({
          data: {
            userId: parseInt(ctx.session.user.id.toString()),
            instalationName: instalacao.nome
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Parece que você não está em uma localização registrada",
        });
      }
    }),

  checkOut: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.db.$queryRaw<Instalation[]`
      SELECT *, (
      6371 * acos(
        cos(radians(${input.latitude})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${input.longitude})) +
        sin(radians(${input.latitude})) * sin(radians(latitude))
      )
    ) AS distance
    FROM "Instalation"
    ORDER BY distance ASC
    `;

      const instalacao = results[0]
      if (!instalacao) {
        return null;
      }
      if (
        isInRange(
          instalacao.latitude,
          instalacao.longitude,
          input.latitude,
          input.longitude,
          instalacao.threshold,
        )
      ) {
        await ctx.db.checkout.create({
          data: {
            userId: parseInt(ctx.session.user.id.toString()),
            instalationName: instalacao.nome
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Parece que você não está em uma localização registrada",
        });
      }
    }),
  getMonthCheckins: protectedProcedure.query(({ ctx }) => {
    return ctx.db.checkin.findMany({
      where: {
        userId: parseInt(ctx.session.user.id.toString()),
      },
    });
  }),
});
