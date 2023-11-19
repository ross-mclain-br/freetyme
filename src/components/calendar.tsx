import { Fragment, useCallback, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { format, startOfToday, addWeeks, startOfWeek } from "date-fns";
import CalendarWeekView from "./calendarViews/week";
import UpsertEventModal from "./events/upsertEventModal";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import UserPreferencesModal from "./user/userPreferencesModal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Calendar = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  const { data: userData } = api.user.getUserByExternalId.useQuery(
    {
      externalUserId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    }
  );

  const { data: eventsData } = api.event.getEventsByUserId.useQuery(
    {
      userId: userData?.id ?? 0,
    },
    {
      enabled: !!userData?.id,
    }
  );

  const { data: recurringEventsData } =
    api.recurringEvent.getRecurringEventsByUserId.useQuery(
      {
        userId: userData?.id ?? 0,
      },
      {
        enabled: !!userData?.id,
      }
    );

  const today = startOfToday();

  const [showUpsertEventModal, setShowUpsertEventModal] =
    useState<boolean>(false);
  const [showUserPreferencesModal, setUserPreferencesModal] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(today));
  const [selectedCalendarView, setSelectedCalendarView] = useState<
    "day" | "week" | "month" | "year"
  >("week");
  const lastCallback = useCallback(() => {
    switch (selectedCalendarView) {
      case "day":
        break;
      case "week":
        setSelectedWeek((prev) => addWeeks(prev, -1));
        break;
      case "month":
        break;
      case "year":
        break;
    }
  }, [selectedCalendarView]);
  const nextCallback = useCallback(() => {
    switch (selectedCalendarView) {
      case "day":
        break;
      case "week":
        setSelectedWeek((prev) => addWeeks(prev, 1));
        break;
      case "month":
        break;
      case "year":
        break;
    }
  }, [selectedCalendarView]);

  // const events = api.events.getEventsByUser.useQuery({
  //   externalId: user?.id ?? "",
  // });

  return (
    <>
      <div className="flex h-full w-full flex-col rounded-lg text-secondary">
        <header className="flex flex-none items-center justify-between py-4 ">
          <h1 className="text-base leading-6 text-secondary">
            <time dateTime="2022-01">{format(today, "MMMM yyyy")}</time>
          </h1>
          <div className="flex items-center">
            <div className="relative flex items-center rounded-md bg-transparent md:items-stretch">
              <button
                onClick={() => setUserPreferencesModal(true)}
                type="button"
                className="hidden rounded-md px-3.5 py-2 text-sm ring-1 ring-inset ring-secondary transition-all duration-300 hover:border-tertiary  hover:bg-tertiary  hover:text-secondary hover:ring-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary md:block"
              >
                Preferences
              </button>
            </div>
            <div className="group relative ml-6 flex items-center rounded-md bg-transparent shadow-sm md:items-stretch">
              <div
                className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-secondary "
                aria-hidden="true"
              />
              <button
                onClick={lastCallback}
                type="button"
                className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4  transition-all duration-300 hover:border-tertiary  hover:bg-tertiary  hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary md:w-9 md:px-2"
              >
                <span className="sr-only">Previous week</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setSelectedWeek(startOfWeek(today))}
                type="button"
                className="hidden px-3.5 text-sm  transition-all duration-300 hover:border-tertiary  hover:bg-tertiary  hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary md:block"
              >
                Today
              </button>
              <span className="relative -mx-px h-5 w-px  md:hidden" />
              <button
                onClick={nextCallback}
                type="button"
                className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 transition-all duration-300 hover:border-tertiary  hover:bg-tertiary  hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary md:w-9 md:px-2"
              >
                <span className="sr-only">Next week</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden md:flex md:items-center">
              {/* <Menu as="div" className="relative">
                <Menu.Button
                  type="button"
                  className="flex items-center gap-x-1.5 rounded-md bg-secondary px-3 py-2 text-sm text-primary shadow-sm ring-1 ring-inset ring-secondary transition-all duration-300 hover:bg-secondary"
                >
                  {capitalize(selectedCalendarView)} view
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        <button
                          onClick={() => {
                            setSelectedCalendarView("day");
                          }}
                          className={classNames(
                            selectedCalendarView === "day"
                              ? "bg-primary text-secondary"
                              : "text-primary hover:bg-primary hover:text-secondary",
                            "block w-full px-4 py-2 text-sm"
                          )}
                        >
                          Day view
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          onClick={() => {
                            setSelectedCalendarView("week");
                          }}
                          className={classNames(
                            selectedCalendarView === "week"
                              ? "bg-primary text-secondary"
                              : "text-primary hover:bg-primary hover:text-secondary",
                            "block w-full px-4 py-2 text-sm"
                          )}
                        >
                          Week view
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          onClick={() => {
                            setSelectedCalendarView("month");
                          }}
                          className={classNames(
                            selectedCalendarView === "month"
                              ? "bg-primary text-secondary"
                              : "text-primary hover:bg-primary hover:text-secondary",
                            "block w-full px-4 py-2 text-sm"
                          )}
                        >
                          Month view
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          onClick={() => {
                            setSelectedCalendarView("year");
                          }}
                          className={classNames(
                            selectedCalendarView === "year"
                              ? "bg-primary text-secondary"
                              : "text-primary hover:bg-primary hover:text-secondary",
                            "block w-full px-4 py-2 text-sm"
                          )}
                        >
                          Year view
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu> */}
              <div className="ml-6 h-6 w-px bg-secondary" />
              <button
                type="button"
                onClick={() => setShowUpsertEventModal(true)}
                className="ml-6 rounded-md  border border-secondary px-3 py-2 text-sm text-secondary shadow-sm transition-all duration-300 hover:border-tertiary  hover:bg-tertiary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
              >
                Add Event
              </button>
            </div>
            <Menu as="div" className="relative ml-6 md:hidden">
              <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-secondary transition-all  duration-300 hover:text-secondary/50">
                <span className="sr-only">Open menu</span>
                <EllipsisHorizontalIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-secondary overflow-hidden rounded-md bg-secondary shadow-lg ring-1 ring-secondary ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          onClick={() => setShowUpsertEventModal(true)}
                          className={classNames(
                            active
                              ? "bg-primary text-secondary"
                              : "text-primary",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Create event
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => setSelectedWeek(startOfWeek(today))}
                        className={"block px-4 py-2 text-sm text-primary"}
                      >
                        Go to today
                      </a>
                    </Menu.Item>
                  </div>

                  <div className="py-1">
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => setUserPreferencesModal(true)}
                        className={"block px-4 py-2 text-sm text-primary"}
                      >
                        User Preferences
                      </a>
                    </Menu.Item>
                  </div>
                  {/* <div className="py-1">
                    <Menu.Item>
                      <button
                        onClick={() => {
                          setSelectedCalendarView("day");
                        }}
                        className={classNames(
                          selectedCalendarView === "day"
                            ? "bg-primary text-secondary"
                            : "text-primary",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Day view
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => {
                          setSelectedCalendarView("week");
                        }}
                        className={classNames(
                          selectedCalendarView === "week"
                            ? "bg-primary text-secondary"
                            : "text-primary",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Week view
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => {
                          setSelectedCalendarView("month");
                        }}
                        className={classNames(
                          selectedCalendarView === "month"
                            ? "bg-primary text-secondary"
                            : "text-primary",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Month view
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => {
                          setSelectedCalendarView("year");
                        }}
                        className={classNames(
                          selectedCalendarView === "year"
                            ? "bg-primary text-secondary"
                            : "text-primary",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Year view
                      </button>
                    </Menu.Item>
                  </div> */}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>
        <CalendarWeekView
          selectedDay={selectedDate}
          setSelectedDay={setSelectedDate}
          selectedWeek={selectedWeek}
          userEvents={eventsData ?? []}
          userRecurringEvents={recurringEventsData ?? []}
        />
      </div>

      {showUpsertEventModal && (
        <UpsertEventModal
          open={showUpsertEventModal}
          setOpen={setShowUpsertEventModal}
          selectedDay={selectedDate}
        />
      )}

      {showUserPreferencesModal && (
        <UserPreferencesModal
          open={showUserPreferencesModal}
          setOpen={setUserPreferencesModal}
        />
      )}
    </>
  );
};
export default Calendar;
