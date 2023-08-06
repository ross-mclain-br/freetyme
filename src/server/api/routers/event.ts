import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

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
});
