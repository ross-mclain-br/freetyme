import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isEqual,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  differenceInMinutes,
  isSameWeek,
  isSameDay,
  addHours,
  addMinutes,
  addDays,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import type { RouterOutputs } from "~/utils/api";
import UpsertEventModal from "~/components/events/upsertEventModal";

export const CalendarWeekView = ({
  selectedDay,
  setSelectedDay,
  selectedWeek,
  userEvents,
  userRecurringEvents,
  setShowUserPreferencesModal,
}: {
  selectedDay: Date;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
  selectedWeek: Date;
  userEvents: RouterOutputs["event"]["getEventsByUserId"];
  userRecurringEvents: RouterOutputs["recurringEvent"]["getRecurringEventsByUserId"];
  setShowUserPreferencesModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  const [showUpsertEventModal, setShowUpsertEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<RouterOutputs["event"]["getEventsByUserId"][0]["event"]>();

  const today = new Date();
  const thisMorning = startOfDay(today);

  const selectedMorning = startOfDay(selectedDay);
  const selectedEvening = endOfDay(selectedDay);
  const selectedHours = eachHourOfInterval({
    start: selectedMorning,
    end: selectedEvening,
  });
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedWeek),
    end: endOfWeek(selectedWeek),
  });

  const currentMinute = today.getHours() * 60;

  const events = [];
  for (const recurringEvent of userRecurringEvents ?? []) {
    // create events for all visible days that span the time of the recurring event.
    const recurringEventOverlaps =
      recurringEvent?.startHour > recurringEvent?.endHour;

    for (const day of weekDays) {
      switch (day.getDay()) {
        case 0:
          if (!recurringEvent.isOnSunday) continue;
          break;
        case 1:
          if (!recurringEvent.isOnMonday) continue;
          break;
        case 2:
          if (!recurringEvent.isOnTuesday) continue;
          break;
        case 3:
          if (!recurringEvent.isOnWednesday) continue;
          break;
        case 4:
          if (!recurringEvent.isOnThursday) continue;
          break;
        case 5:
          if (!recurringEvent.isOnFriday) continue;
          break;
        case 6:
          if (!recurringEvent.isOnSaturday) continue;
          break;
      }

      let startDate = addMinutes(
        addHours(new Date(day), recurringEvent.startHour),
        recurringEvent.startMin
      );
      if (recurringEventOverlaps) {
        startDate = addDays(startDate, -1);
      }
      const endDate = addMinutes(
        addHours(new Date(day), recurringEvent.endHour),
        recurringEvent.endMin
      );
      const event: RouterOutputs["event"]["getEventsByUserId"][0]["event"] = {
        id: recurringEvent.id,
        title: recurringEvent.title ?? recurringEvent.type.name,
        description: recurringEvent.description ?? "",
        ownerId: recurringEvent.userId,
        color: recurringEvent.type.color,
        textColor: recurringEvent.type.textColor,
        start: startDate,
        end: endDate,
        typeId: recurringEvent.typeId,
        type: recurringEvent.type,
        createdAt: recurringEvent.createdAt,
        updatedAt: recurringEvent.updatedAt,
        image: recurringEvent.type.image,
        location: "",
      };
      events.push(event);
    }
    // Then loop over all the events and render them.
  }
  events.push(...userEvents?.map((userEvent) => userEvent.event));

  useEffect(() => {
    // Set the container scroll position based on the current time.
    if (
      container?.current &&
      containerNav?.current &&
      containerOffset?.current
    ) {
      container.current.scrollTop =
        ((container.current.scrollHeight -
          containerNav.current.offsetHeight -
          containerOffset.current.offsetHeight) *
          currentMinute) /
        1440;
    }
  }, [currentMinute]);

  const rowHeight = 6;
  return (
    <>
      <div
        style={{ width: "165%" }}
        className="flex max-w-full flex-none flex-col rounded-lg bg-tertiary/40 sm:max-w-none md:max-w-full"
      >
        <div
          ref={container}
          className="isolate flex max-h-[70vh] flex-auto flex-col overflow-y-auto rounded-lg"
        >
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-tertiary/60 ring-1 ring-primary ring-opacity-5 sm:pr-8"
          >
            <div className="grid grid-cols-7 text-sm leading-6 text-secondary sm:hidden">
              {weekDays.map((day) => (
                <button
                  key={`week-day-button-${day.getDay()}`}
                  type="button"
                  className="flex flex-col items-center pb-3 pt-2"
                >
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                  <span
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border ${
                      isEqual(day, selectedDay)
                        ? `bg-secondary text-primary`
                        : isEqual(day, thisMorning)
                        ? `border-secondary text-secondary`
                        : `border-transparent text-secondary`
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </button>
              ))}
            </div>

            <div className="-mr-px hidden grid-cols-7 divide-x divide-secondary border-r border-secondary text-sm font-bold leading-6 text-secondary sm:grid">
              <div className="col-end-1 w-14" />
              {weekDays.map((day) => (
                <button
                  key={`week-day-button-${day.getDay()}`}
                  className="flex items-center justify-center py-3"
                >
                  <div className="flex items-center">
                    <span className="mr-1">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span
                      onClick={() => setSelectedDay(day)}
                      className={`ml-1 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:bg-secondary hover:text-primary ${
                        isEqual(day, selectedDay)
                          ? `bg-secondary text-primary`
                          : isEqual(day, thisMorning)
                          ? ` border-secondary text-secondary`
                          : ` border-transparent text-secondary`
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-tertiary/60 ring-1 ring-secondary" />
            <div className="grid  flex-auto grid-cols-1 grid-rows-1 ">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-secondary"
                style={{ gridTemplateRows: "repeat(24, minmax(1.75rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {selectedHours.map((hour) => (
                  <div key={`hour-${hour.getHours()}`}>
                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                      {format(hour, "ha")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-secondary sm:grid sm:grid-cols-7">
                <div className="row-span-full sm:col-start-1" />
                <div className="row-span-full sm:col-start-2" />
                <div className="row-span-full sm:col-start-3" />
                <div className="row-span-full sm:col-start-4" />
                <div className="row-span-full sm:col-start-5" />
                <div className="row-span-full sm:col-start-6" />
                <div className="row-span-full sm:col-start-7" />
                <div className="row-span-full w-8 sm:col-start-8" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                }}
              >
                {events
                  ?.filter(
                    (event) =>
                      isSameWeek(event?.start, selectedWeek) ||
                      isSameWeek(event?.end, selectedWeek)
                  )
                  .map((event) => {
                    const eventDurationDays = eachDayOfInterval({
                      start: event.start,
                      end: event.end,
                    });

                    return eventDurationDays.map((day) => {
                      const isEventStartToday = isEqual(
                        day,
                        startOfDay(event.start)
                      );
                      const isEventEndToday = isEqual(
                        day,
                        startOfDay(event.end)
                      );
                      const title = isEventStartToday
                        ? event.title
                        : `${event.title} (continued)`;

                      const eventStart = isEventStartToday
                        ? event.start
                        : startOfDay(day);
                      const startOfEventMorning = startOfDay(eventStart);
                      const eventEnd = isEventEndToday
                        ? event.end
                        : endOfDay(day);

                      const eventDurationDisplay =
                        isEventStartToday && isEventEndToday
                          ? `${format(eventStart, "h:mm a")} - ${format(
                              eventEnd,
                              "h:mm a"
                            )}`
                          : isEventStartToday
                          ? `${format(eventStart, "h:mm a")} ->`
                          : isEventEndToday
                          ? `-> ${format(eventEnd, "h:mm a")}`
                          : "-> All Day ->";

                      const durationMinutes = differenceInMinutes(
                        eventEnd,
                        eventStart
                      );
                      const startingDurationMinutes = differenceInMinutes(
                        eventStart,
                        startOfEventMorning
                      );

                      const hoursRowHeight = Math.round(
                        rowHeight * (durationMinutes / 30)
                      );

                      const startingRow = Math.round(
                        rowHeight * (startingDurationMinutes / 30)
                      );

                      const dayIndex = day.getDay() + 1;

                      return (
                        <li
                          key={`event-${event.id}-${day.getDay()}`}
                          className={`relative mt-px flex sm:col-start-${dayIndex} ${
                            isSameDay(eventStart, selectedDay) ||
                            isSameDay(eventEnd, selectedDay)
                              ? ""
                              : "hidden sm:block"
                          }`}
                          style={{
                            gridRow:
                              isEventStartToday && isEventEndToday
                                ? `${2 + startingRow} / span ${hoursRowHeight}`
                                : isEventStartToday
                                ? `${2 + startingRow} / span ${hoursRowHeight}`
                                : isEventEndToday
                                ? `1 / span ${hoursRowHeight}`
                                : `1 / span ${hoursRowHeight}`,
                          }}
                        >
                          <a
                            href="#"
                            className={`group absolute inset-1 flex flex-col overflow-y-auto ${
                              isEventStartToday && isEventEndToday
                                ? "rounded-lg"
                                : isEventStartToday
                                ? "rounded-t-lg"
                                : isEventEndToday
                                ? "rounded-b-lg"
                                : ""
                            } border border-quaternary p-2 text-xs leading-5 hover:bg-primary/70`}
                            style={{ backgroundColor: event.color }}
                            onClick={(e) => {
                              e.preventDefault();
                              if (event.type.code === "calendar") {
                                setSelectedEvent(event);
                                setShowUpsertEventModal(true);
                              } else {
                                setShowUserPreferencesModal(true);
                              }
                            }}
                          >
                            <p
                              style={{ color: event?.textColor ?? "white" }}
                              className="order-1"
                            >
                              {title}
                            </p>
                            <p
                              style={{ color: event?.textColor ?? "white" }}
                              className=" group-hover:text-secondary"
                            >
                              <time dateTime={eventStart.toISOString()}>
                                {eventDurationDisplay}
                              </time>
                            </p>
                          </a>
                        </li>
                      );
                    });
                  })}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {showUpsertEventModal && selectedEvent && (
        <UpsertEventModal
          open={showUpsertEventModal}
          setOpen={setShowUpsertEventModal}
          existingEvent={selectedEvent}
          setExistingEvent={setSelectedEvent}
        />
      )}
    </>
  );
};
export default CalendarWeekView;
