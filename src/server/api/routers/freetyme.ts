import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type Event } from "@prisma/client";
import { addDays, addHours, format, isSameDay } from "date-fns";
import { isRecurringEventOnDay } from "~/server/utils";
import { log } from "next-axiom";

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
      log.debug(
        `Start: ISO: ${input?.start?.toISOString()} - UTC STRING: ${input?.start?.toUTCString()} - LocaleString: ${input?.start?.toLocaleString()}`
      );
      if (input?.start?.toISOString()) {
        let currentDate = new Date(input.start.toUTCString());

        log.debug(
          `CurrentDate: ISO: ${currentDate?.toISOString()} - UTC STRING: ${input?.start?.toUTCString()} - LocaleString: ${currentDate?.toLocaleString()}`
        );
        while (currentDate <= input.end) {
          if (!freetymeEventList.has(currentDate)) {
            freetymeEventList.set(currentDate, []);
          }
          log.debug(
            `Gathering freetyme for current date: ${currentDate?.toISOString()}`
          );
          const currentDayFreetymeArray = freetymeEventList.get(currentDate);
          const currentDayEvents = userEventsInDuration?.length
            ? userEventsInDuration.filter(
                (userEvent) =>
                  isSameDay(userEvent.event.start, currentDate) ||
                  isSameDay(userEvent.event.end, currentDate)
              )
            : [];
          const currentDayRecurringEvents =
            userRecurringEventsInDuration?.length
              ? userRecurringEventsInDuration.filter((userRecurringEvent) => {
                  return isRecurringEventOnDay(userRecurringEvent, currentDate);
                })
              : [];

          let currentHour = 1;
          let freetymeEventStartHour: number | null = null;
          let freetymeEventEndHour: number | null = null;
          while (currentHour < 24) {
            const currentDayEvent = currentDayEvents.find((userEvent) => {
              return (
                userEvent.event.start.getHours() <= currentHour &&
                (userEvent.event.end.getHours() > currentHour ||
                  (userEvent.event.end.getHours() === currentHour &&
                    userEvent.event.end.getMinutes() > 0))
              );
            });
            const currentDayRecurringEvent = currentDayRecurringEvents.find(
              (userRecurringEvent) => {
                return (
                  userRecurringEvent.startHour <= currentHour &&
                  (userRecurringEvent.endHour > currentHour ||
                    (userRecurringEvent.endHour === currentHour &&
                      userRecurringEvent.endMin > 0))
                );
              }
            );
            if (!currentDayEvent && !currentDayRecurringEvent) {
              if (freetymeEventStartHour === null) {
                freetymeEventStartHour = currentHour;
                log.debug(
                  `${currentDate?.toISOString()} - Freetyme Start: ${freetymeEventStartHour}`
                );
              }
              freetymeEventEndHour = currentHour + 1;
            } else if (
              freetymeEventStartHour !== null &&
              freetymeEventEndHour !== null &&
              freetymeEventEndHour > freetymeEventStartHour
            ) {
              log.debug(
                `${currentDate?.toISOString()} - Freetyme End: ${freetymeEventEndHour}`
              );
              const start = addHours(
                new Date(currentDate?.toUTCString()),
                freetymeEventStartHour
              );
              const end = addHours(
                new Date(currentDate?.toUTCString()),
                freetymeEventEndHour
              );

              log.debug(
                `${currentDate?.toISOString()} - Freetyme Event Found: Start: ${format(
                  start,
                  "yyyy-MM-dd HH:mm:ss"
                )} - End:${format(end, "yyyy-MM-dd HH:mm:ss")})}`
              );

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
            currentHour++;
          }

          if (
            freetymeEventStartHour !== null &&
            freetymeEventEndHour !== null &&
            freetymeEventEndHour > freetymeEventStartHour
          ) {
            log.debug(
              `${currentDate?.toISOString()} - Freetyme End: ${freetymeEventEndHour}`
            );
            const start = addHours(
              new Date(currentDate?.toUTCString()),
              freetymeEventStartHour
            );
            const end = addHours(
              new Date(currentDate?.toUTCString()),
              freetymeEventEndHour
            );

            log.debug(
              `${currentDate?.toISOString()} - Freetyme Event After 24 Hours Found: Start: ${format(
                start,
                "yyyy-MM-dd HH:mm:ss"
              )} - End:${format(end, "yyyy-MM-dd HH:mm:ss")})}`
            );

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
        log.debug("Freetyme List:", { freetymeEventList: freetymeEventList });
      }
      return freetymeEventList;
    }),
});
