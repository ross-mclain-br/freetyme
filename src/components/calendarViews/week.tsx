import {
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfToday,
} from "date-fns";
import { useEffect, useRef } from "react";

export const CalendarWeekView = () => {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  const today = startOfToday();
  const weekDays = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60;
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
            <button
              type="button"
              className="flex flex-col items-center pb-3 pt-2"
            >
              M{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-bold text-secondary">
                10
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center pb-3 pt-2"
            >
              T{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-bold text-secondary">
                11
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center pb-3 pt-2"
            >
              W{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-secondary">
                12
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center pb-3 pt-2"
            >
              T{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-bold text-secondary">
                13
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center pb-3 pt-2"
            >
              F{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-bold text-secondary">
                14
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center pb-3 pt-2"
            >
              S{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-bold text-secondary">
                15
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center pb-3 pt-2"
            >
              S{" "}
              <span className="mt-1 flex h-8 w-8 items-center justify-center font-bold text-secondary">
                16
              </span>
            </button>
          </div>

          <div className="font bold -mr-px hidden grid-cols-7 divide-x divide-secondary border-r border-secondary text-sm leading-6 text-secondary sm:grid">
            <div className="col-end-1 w-14" />
            <div className="flex items-center justify-center py-3">
              <span>
                Mon{" "}
                <span className="items-center justify-center font-bold text-secondary">
                  10
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Tue{" "}
                <span className="items-center justify-center font-bold text-secondary">
                  11
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span className="flex items-baseline">
                Wed{" "}
                <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary">
                  12
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Thu{" "}
                <span className="items-center justify-center font-bold text-secondary">
                  13
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Fri{" "}
                <span className="items-center justify-center font-bold text-secondary">
                  14
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Sat{" "}
                <span className="items-center justify-center font-bold text-secondary">
                  15
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Sun{" "}
                <span className="items-center justify-center font-bold text-secondary">
                  16
                </span>
              </span>
            </div>
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
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  12AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  1AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  2AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  3AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  4AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  5AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  6AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  7AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  8AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  9AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  10AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  11AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  12PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  1PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  2PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  3PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  4PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  5PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  6PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  7PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  8PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  9PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  10PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs font-bold leading-5 text-secondary">
                  11PM
                </div>
              </div>
              <div />
            </div>

            {/* Vertical lines */}
            <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-secondary sm:grid sm:grid-cols-7">
              <div className="col-start-1 row-span-full" />
              <div className="col-start-2 row-span-full" />
              <div className="col-start-3 row-span-full" />
              <div className="col-start-4 row-span-full" />
              <div className="col-start-5 row-span-full" />
              <div className="col-start-6 row-span-full" />
              <div className="col-start-7 row-span-full" />
              <div className="col-start-8 row-span-full w-8" />
            </div>

            {/* Events */}
            <ol
              className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
              style={{
                gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
              }}
            >
              <li
                className="relative mt-px flex sm:col-start-3"
                style={{ gridRow: "74 / span 12" }}
              >
                <a
                  href="#"
                  className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                >
                  <p className="order-1 text-blue-700">Breakfast</p>
                  <p className="text-blue-500 group-hover:text-blue-700">
                    <time dateTime="2022-01-12T06:00">6:00 AM</time>
                  </p>
                </a>
              </li>
              <li
                className="relative mt-px flex sm:col-start-3"
                style={{ gridRow: "92 / span 30" }}
              >
                <a
                  href="#"
                  className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
                >
                  <p className="order-1 text-pink-700">Flight to Paris</p>
                  <p className="text-pink-500 group-hover:text-pink-700">
                    <time dateTime="2022-01-12T07:30">7:30 AM</time>
                  </p>
                </a>
              </li>
              <li
                className="relative mt-px hidden sm:col-start-6 sm:flex"
                style={{ gridRow: "122 / span 24" }}
              >
                <a
                  href="#"
                  className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200"
                >
                  <p className="order-1 text-gray-700">
                    Meeting with design team at Disney
                  </p>
                  <p className="text-gray-500 group-hover:text-gray-700">
                    <time dateTime="2022-01-15T10:00">10:00 AM</time>
                  </p>
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CalendarWeekView;
