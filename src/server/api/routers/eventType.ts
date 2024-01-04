import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const eventTypeRouter = createTRPCRouter({
  getEventTypes: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.eventType.findMany();
  }),
});
