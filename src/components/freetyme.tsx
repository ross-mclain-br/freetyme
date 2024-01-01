import { Fragment } from "react";

import { format, startOfToday, addWeeks } from "date-fns";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@nextui-org/react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Calendar, Clock, Terminal } from "lucide-react";

export const FreeTyme = () => {
  const today = startOfToday();
  const nextWeek = addWeeks(today, 2);

  const { user, isSignedIn, isLoaded } = useUser();

  const { data: userData } = api.user.getUserByExternalId.useQuery(
    {
      externalUserId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    }
  );

  const { data: freetymeEventData, isLoading: freetymeEventLoading } =
    api.freetyme.getFreetymeForUser.useQuery(
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
      <div className="flex h-full w-full flex-col rounded-b-lg text-secondary">
        <div className={"flex flex-grow flex-col p-3"}>
          {freetymeEventLoading ? (
            <div className={"flex flex-row justify-center px-6 py-20"}>
              <Spinner
                label="Loading..."
                color="secondary"
                labelColor="secondary"
              />
            </div>
          ) : (
            <>
              {[...(freetymeEventData?.keys() ?? [])]?.map((date) => {
                const events = freetymeEventData?.get(date) ?? [];
                return (
                  <div
                    key={`freetyme-event-date-${date?.toISOString()}`}
                    className={
                      "space-4 flex flex-col gap-y-4 bg-transparent p-3"
                    }
                  >
                    <Alert
                      key={`freetyme-alert-${date?.toISOString()}`}
                      className={
                        "border-quaternary bg-gradient-to-r from-secondary to-success/90 shadow-lg"
                      }
                    >
                      <Calendar className="h-4 w-4 " color={"black"} />
                      <AlertTitle className={"text-black"}>
                        {format(new Date(date), "EEEE, MMMM do")}
                      </AlertTitle>
                      <AlertDescription className={"gap-y-3 py-3"}>
                        {events?.length > 0 ? (
                          <div className={" flex flex-col gap-4"}>
                            {events.map((event) => {
                              const formattedStart = format(
                                event?.start,
                                "h:mm a"
                              );
                              const formattedEnd = format(event?.end, "h:mm a");
                              const totalHours =
                                (event?.end?.getTime() -
                                  event?.start?.getTime()) /
                                3600000;
                              return (
                                <Alert
                                  key={`freetyme-alert-${event.id}`}
                                  className={"border-quaternary"}
                                >
                                  <Clock className="h-4 w-4" />
                                  <AlertTitle>
                                    {formattedStart} - {formattedEnd} : --{" "}
                                    {totalHours} Hours Available --
                                  </AlertTitle>
                                </Alert>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={"flex flex-row"}>
                            <span className={"ml-3 p-3 text-sm text-primary"}>
                              -- 0 Hours Available --
                            </span>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default FreeTyme;
