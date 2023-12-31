import { Fragment } from "react";

import { format, startOfToday, addWeeks } from "date-fns";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

export const FreeTyme = () => {
  const today = startOfToday();
  const nextWeek = addWeeks(today, 1);

  const { user, isSignedIn, isLoaded } = useUser();

  const { data: userData } = api.user.getUserByExternalId.useQuery(
    {
      externalUserId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    }
  );

  const { data: freetymeEventData } = api.freetyme.getFreetymeForUser.useQuery(
    {
      userId: userData?.id ?? 0,
      start: today,
      end: nextWeek,
    },
    {
      enabled: !!userData?.id,
    }
  );

  return (
    <>
      <div className="flex h-full w-full flex-col rounded-lg text-secondary">
        <div className={"flex flex-grow flex-col"}>
          {[...(freetymeEventData?.keys() ?? [])]?.map((date) => {
            const events = freetymeEventData?.get(date) ?? [];
            return (
              <div
                key={`freetyme-event-date-${date?.toISOString()}`}
                className={"space-4 flex flex-col gap-y-4 p-3"}
              >
                <h1 className={"font-bold text-secondary"}>
                  {format(new Date(date), "EEEE, MMMM do")}
                </h1>
                {events?.length > 0 ? (
                  <div
                    className={
                      "mb-3 flex flex-col gap-4 rounded-lg bg-secondary p-3"
                    }
                  >
                    {events.map((event) => (
                      <>
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
                            FreeTyme
                          </span>
                        </div>
                      </>
                    ))}
                  </div>
                ) : (
                  <div className={"flex flex-row"}>
                    <span
                      className={
                        "ml-3 rounded-lg bg-secondary p-3 text-sm text-primary"
                      }
                    >
                      You are all booked!
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default FreeTyme;
