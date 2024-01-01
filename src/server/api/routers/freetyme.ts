import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Event } from "@prisma/client";
import { addDays, isSameDay, setHours } from "date-fns";
import { isRecurringEventOnDay } from "~/server/utils";

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
        if (!freetymeEventList.has(currentDate)) {
          freetymeEventList.set(currentDate, []);
        }
        const currentDayFreetymeArray = freetymeEventList.get(currentDate);
        const currentDayEvents = userEventsInDuration.filter(
          (userEvent) =>
            isSameDay(userEvent.event.start, currentDate) ||
            isSameDay(userEvent.event.end, currentDate)
        );
        const currentDayRecurringEvents = userRecurringEventsInDuration.filter(
          (userRecurringEvent) => {
            return isRecurringEventOnDay(userRecurringEvent, currentDate);
          }
        );

        let currentHour = 1;
        let freetymeEventStartHour: number | null = null;
        let freetymeEventEndHour: number | null = null;
        while (currentHour <= 24) {
          const currentDayEvent = currentDayEvents.find((userEvent) => {
            return (
              userEvent.event.start.getHours() <= currentHour &&
              userEvent.event.end.getHours() >= currentHour
            );
          });
          const currentDayRecurringEvent = currentDayRecurringEvents.find(
            (userRecurringEvent) => {
              return (
                userRecurringEvent.startHour <= currentHour &&
                userRecurringEvent.endHour >= currentHour
              );
            }
          );
          if (!currentDayEvent && !currentDayRecurringEvent) {
            if (freetymeEventStartHour === null) {
              freetymeEventStartHour = currentHour;
            }
            freetymeEventEndHour = currentHour;
          } else if (
            freetymeEventStartHour !== null &&
            freetymeEventEndHour !== null &&
            freetymeEventEndHour > freetymeEventStartHour
          ) {
            const start = setHours(
              new Date(currentDate),
              freetymeEventStartHour
            );
            const end = setHours(new Date(currentDate), freetymeEventEndHour);

            currentDayFreetymeArray?.push({
              id: -1,
              title: "Freetyme",
              description: "Freetyme",
              start: start,
              end: end,
              color: "#000000",
              textColor: "#ffffff",
              location: "",
              image: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              typeId: 1,
              ownerId: 1,
            });
            freetymeEventStartHour = null;
            freetymeEventEndHour = null;
          }
          currentHour++;
        }

        if (
          freetymeEventStartHour !== null &&
          freetymeEventEndHour !== null &&
          freetymeEventEndHour > freetymeEventStartHour
        ) {
          const start = setHours(new Date(currentDate), freetymeEventStartHour);
          const end = setHours(new Date(currentDate), freetymeEventEndHour);

          currentDayFreetymeArray?.push({
            id: start.getMilliseconds(),
            title: "Freetyme",
            description: "Freetyme",
            start: start,
            end: end,
            color: "#000000",
            textColor: "#ffffff",
            location: "",
            image: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            typeId: 1,
            ownerId: 1,
          });
          freetymeEventStartHour = null;
          freetymeEventEndHour = null;
        }

        currentDate = addDays(currentDate, 1);
      }
      console.log(JSON.stringify(freetymeEventList, null, 2));

      return freetymeEventList;
    }),
});
