import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const recurringEventRouter = createTRPCRouter({
  getRecurringEventsByUserId: privateProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.userRecurringEvents.findMany({
        where: { userId: input.userId },
        include: {
          type: true,
        },
      });
    }),
  upsertRecurringEvent: privateProcedure
    .input(
      z.object({
        id: z.number().or(z.null()),
        title: z.string(),
        description: z.string(),
        typeId: z.number(),
        userId: z.number(),
        startHour: z.number(),
        startMin: z.number(),
        endHour: z.number(),
        endMin: z.number(),
        isOnSunday: z.boolean(),
        isOnMonday: z.boolean(),
        isOnTuesday: z.boolean(),
        isOnWednesday: z.boolean(),
        isOnThursday: z.boolean(),
        isOnFriday: z.boolean(),
        isOnSaturday: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.typeId) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error upserting user recurring event. Provide Type Id",
          });
        }
        const upsertRecurringEventReturn =
          await ctx.prisma.userRecurringEvents.upsert({
            where: { id: input.id ?? -1 },
            create: {
              title: input.title,
              description: input.description,
              typeId: input.typeId,
              userId: input.userId,
              startHour: input.startHour,
              startMin: input.startMin,
              endHour: input.endHour,
              endMin: input.endMin,
              isOnSunday: input.isOnSunday,
              isOnMonday: input.isOnMonday,
              isOnTuesday: input.isOnTuesday,
              isOnWednesday: input.isOnWednesday,
              isOnThursday: input.isOnThursday,
              isOnFriday: input.isOnFriday,
              isOnSaturday: input.isOnSaturday,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            update: {
              title: input.title,
              description: input.description,
              typeId: input.typeId,
              userId: input.userId,
              startHour: input.startHour,
              startMin: input.startMin,
              endHour: input.endHour,
              endMin: input.endMin,
              isOnSunday: input.isOnSunday,
              isOnMonday: input.isOnMonday,
              isOnTuesday: input.isOnTuesday,
              isOnWednesday: input.isOnWednesday,
              isOnThursday: input.isOnThursday,
              isOnFriday: input.isOnFriday,
              isOnSaturday: input.isOnSaturday,
              updatedAt: new Date().toISOString(),
            },
          });
        return upsertRecurringEventReturn;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error upserting user recurring event.",
        });
      }
    }),
});
