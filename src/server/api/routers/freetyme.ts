import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Event } from "@prisma/client";
import { addDays } from "date-fns";

export const freetymeRouter = createTRPCRouter({
  getFreetymeForUser: privateProcedure
    .input(z.object({ userId: z.number(), start: z.date(), end: z.date() }))
    .query(async ({ ctx, input }) => {
      const userEventsInDuration = await ctx.prisma.userEvents.findMany({
        where: {
          userId: input.userId,
          event: {
            start: {
              gte: input.start,
              lte: input.end,
            },
            end: {
              gte: input.start,
              lte: input.end,
            },
          },
        },
        include: {
          event: {
            include: {
              type: true,
            },
          },
        },
      });

      const userRecurringEventsInDuration =
        await ctx.prisma.userRecurringEvents.findMany({
          where: {
            userId: input.userId,
          },
          include: {
            type: true,
          },
        });

      type FreetymeEvent = Event;

      const freetymeEventList = new Map<Date, FreetymeEvent[]>();
      let currentDate = new Date(input.start);
      while (currentDate <= input.end) {
        freetymeEventList.set(currentDate, []);
        currentDate = addDays(currentDate, 1);
      }
      console.log(JSON.stringify(freetymeEventList, null, 2));

      return freetymeEventList;
    }),
});
