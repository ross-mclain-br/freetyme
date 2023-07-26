import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isEqual,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  differenceInMinutes,
} from "date-fns";
import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { CalendarEvent } from "../calendar";

export const CalendarWeekView = ({
  selectedDay,
  setSelectedDay,
  events,
}: {
  selectedDay: Date;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
  events: CalendarEvent[];
}) => {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  const today = new Date();
  const thisMorning = startOfDay(today);

  const selectedMorning = startOfDay(selectedDay);
  const selectedEvening = endOfDay(selectedDay);
  const selectedHours = eachHourOfInterval({
    start: selectedMorning,
    end: selectedEvening,
  });
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedMorning),
    end: endOfWeek(selectedMorning),
  });

  const currentMinute = today.getHours() * 60;

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
  }, []);

  const rowHeight = 6;
  return (
    <div
      style={{ width: "165%" }}
      className="flex max-w-full flex-none flex-col bg-tertiary/40 sm:max-w-none md:max-w-full"
    >
      <div
        ref={container}
        className="isolate flex max-h-[65vh] flex-auto flex-col overflow-y-scroll rounded-lg"
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
                  className={
                    isEqual(day, thisMorning)
                      ? `mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary`
                      : `mt-1 flex h-8 w-8 items-center justify-center font-bold text-secondary`
                  }
                >
                  {format(day, "d")}
                </span>
              </button>
            ))}
          </div>

          <div className="font bold -mr-px hidden grid-cols-7 divide-x divide-secondary border-r border-secondary text-sm leading-6 text-secondary sm:grid">
            <div className="col-end-1 w-14" />
            {weekDays.map((day) => (
              <div
                key={`week-day-button-${day.getDay()}`}
                className="flex items-center justify-center py-3"
              >
                <div className="flex items-center">
                  <span className="mr-1">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span
                    className={
                      isEqual(day, thisMorning)
                        ? `ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary`
                        : `ml-1 flex h-8 w-8 items-center justify-center rounded-full font-bold text-secondary`
                    }
                  >
                    {format(day, "d")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-auto">
          <div className="sticky left-0 z-10 w-14 flex-none bg-tertiary/60 ring-1 ring-secondary" />
          <div className="grid  flex-auto grid-cols-1 grid-rows-1 ">
            {/* Horizontal lines */}
            <div
              className="col-start-1 col-end-2 row-start-1 grid divide-y divide-secondary"
              style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
            >
              <div ref={containerOffset} className="row-end-1 h-7"></div>
              {selectedHours.map((hour) => (
                <>
                  <div key={`hour-${hour.getHours()}`}>
                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                      {format(hour, "ha")}
                    </div>
                  </div>
                  <div key={`hour-extra-${hour.getHours()}`} />
                </>
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
              {events.map((event) => {
                const eventDurationDays = eachDayOfInterval({
                  start: event.start,
                  end: event.end,
                });
                console.log(eventDurationDays);

                return eventDurationDays.map((day) => {
                  console.log(day);
                  const eventStart = isEqual(day, startOfDay(event.start))
                    ? event.start
                    : startOfDay(day);
                  const startOfEventMorning = startOfDay(eventStart);
                  const eventEnd = isEqual(day, startOfDay(event.end))
                    ? event.end
                    : endOfDay(day);

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
                      className={`relative mt-px flex sm:col-start-${dayIndex}`}
                      style={{
                        gridRow: `${2 + startingRow} / span ${hoursRowHeight}`,
                      }}
                    >
                      <a
                        href="#"
                        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                      >
                        <p className="order-1 text-blue-700">{event.title}</p>
                        <p className="text-blue-500 group-hover:text-blue-700">
                          <time dateTime={eventStart.toISOString()}>
                            {format(eventStart, "h:mm a")}
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
  );
};
export default CalendarWeekView;
