import * as z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { isInRange } from "@/utils/geo";
import { TRPCError } from "@trpc/server";
import type { Instalation } from "@prisma/client";

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
        tipo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results: Instalation[] = await ctx.db.$queryRaw<Instalation[]>`
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

      const instalacao = results[0];
      if (!instalacao) {
        return null;
      }

      const lastUserCheckin = await ctx.db.user.findUnique({
        where: {
          id: parseInt(ctx.session.user.id.toString()),
        },
        include: {
          checkins: {
            orderBy: {
              timestamp: "asc",
            },
          },
        },
      });

      if (!lastUserCheckin) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Não conseguimos encontrar seus dados, tente fazer o login novamente e scanear o código",
        });
      }

      if (
        lastUserCheckin.checkins[0] &&
        Math.abs(
          lastUserCheckin.checkins[0].timestamp.getTime() -
            new Date().getTime(),
        ) /
          36e5 <=
          0.25
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Ponto já foi batido, não tentar novamente pelos próximos 15 minutos",
        });
      }

      if (lastUserCheckin.checkins) {
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
              instalationName: instalacao.nome,
              tipo: input.tipo === "in" ? "CHECKIN" : "CHECKOUT",
            },
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Parece que você não está em uma localização registrada",
          });
        }
      }
    }),

  deleteCheckin: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.checkin.delete({
          where: {
            id: input,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  createManuallyCheckin: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        instalation: z.string(),
        date: z.string(),
        time: z.string(),
        kind: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.checkin.create({
          data: {
            userId: parseInt(input.userId),
            instalationName: input.instalation,
            timestamp: new Date(
              new Date(`${input.date}T${input.time}`).toISOString(),
            ),
            tipo: input.kind === "checkin" ? "CHECKIN" : "CHECKOUT",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getMonthCheckins: protectedProcedure.query(({ ctx }) => {
    return ctx.db.checkin.findMany({
      where: {
        userId: parseInt(ctx.session.user.id.toString()),
      },
    });
  }),
  getUserMonthData: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        date: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const today = new Date();

      return await ctx.db.checkin.findMany({
        where: {
          timestamp: {
            lte: input.date
              ? new Date(input.date.getFullYear(), input.date.getMonth() + 1)
              : new Date(today.getFullYear(), today.getMonth() + 1),
            gte: input.date
              ? new Date(input.date.getFullYear(), input.date.getMonth(), 1)
              : new Date(today.getFullYear(), today.getMonth(), 1),
          },
          userId: input.userId,
        },
        orderBy: {
          timestamp: "asc",
        },
      });
    }),
});
