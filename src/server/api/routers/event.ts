import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { startOfToday } from "date-fns";

export const eventRouter = createTRPCRouter({
  getEventsByUserId: privateProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.userEvents.findMany({
        where: { userId: input.userId },
        include: {
          event: true,
        },
      });
    }),
  upsertEvent: privateProcedure
    .input(
      z.object({
        id: z.number().or(z.null()),
        title: z.string(),
        description: z.string(),
        start: z.date(),
        end: z.date(),
        color: z.string(),
        textColor: z.string(),
        location: z.string(),
        image: z.string(),
        typeId: z.number(),
        ownerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const upsertEventReturn = await ctx.prisma.event.upsert({
          where: { id: input.id ?? -1 },
          create: {
            title: input.title,
            description: input.description,
            typeId: input.typeId,
            ownerId: input.ownerId,
            start: input.start,
            end: input.end,
            color: input.color,
            textColor: input.textColor,
            location: input.location,
            image: input.image,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          update: {
            title: input.title,
            description: input.description,
            typeId: input.typeId,
            ownerId: input.ownerId,
            start: input.start,
            end: input.end,
            color: input.color,
            textColor: input.textColor,
            location: input.location,
            image: input.image,
            updatedAt: new Date().toISOString(),
          },
        });
        if (upsertEventReturn?.id) {
          await ctx.prisma.userEvents.upsert({
            where: {
              userId_eventId: {
                userId: input.ownerId,
                eventId: upsertEventReturn.id,
              },
            },
            create: {
              userId: input.ownerId,
              eventId: upsertEventReturn.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            update: {
              userId: input.ownerId,
              eventId: upsertEventReturn.id,
              updatedAt: new Date().toISOString(),
            },
          });
        }
        return upsertEventReturn;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error upserting user recurring event.",
        });
      }
    }),
});
