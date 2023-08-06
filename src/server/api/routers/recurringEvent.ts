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
});
