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
import * as events from "events";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const FreeTyme = () => {
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

  return (
    <>
      <div className="flex h-full w-full flex-col rounded-lg text-secondary">
        <header className="flex flex-none items-center justify-between py-4 ">
          <h1 className="text-base leading-6 text-secondary">
            <time dateTime="2022-01">{format(today, "MMMM dd yyyy")}</time>
          </h1>
        </header>
        <div className={"flex flex-grow flex-col"}>
          {eventsData?.map((eventData) => {
            const event = eventData.event;
            return (
              <div key={event.id} className={"space-4 flex flex-col gap-y-4"}>
                <div
                  className={
                    "mb-3 flex flex-col gap-4 rounded-lg bg-secondary p-3"
                  }
                >
                  <div className={"flex flex-row gap-4"}>
                    <span className={"text-sm text-primary"}>
                      {event.title}
                    </span>
                    <span className={"text-sm text-primary"}>
                      {event.description}
                    </span>
                    <span className={"text-sm text-primary"}>
                      {event.start.toISOString()}
                    </span>
                    <span className={"text-sm text-primary"}>
                      {event.end.toISOString()}
                    </span>
                  </div>
                  <div className={"flex flex-row gap-2"}>
                    <span className={"text-sm text-primary"}>
                      {event.location}
                    </span>
                    <span className={"text-sm text-primary"}>
                      {event.type.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default FreeTyme;
