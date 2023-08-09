import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { eventRouter } from "./routers/event";
import { recurringEventRouter } from "./routers/recurringEvent";
import { eventTypeRouter } from "./routers/eventType";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  event: eventRouter,
  recurringEvent: recurringEventRouter,
  eventType: eventTypeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
