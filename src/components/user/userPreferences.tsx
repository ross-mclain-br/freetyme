import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { parseRecurringEventDuration } from "~/utils/util";

export const UserPreferences = () => {
  const { user } = useUser();

  const { data: userData } = api.user.getUserByExternalId.useQuery(
    {
      externalUserId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    }
  );

  const { data: recurringEventData } =
    api.recurringEvent.getRecurringEventsByUserId.useQuery(
      {
        userId: userData?.id ?? 0,
      },
      {
        enabled: !!userData?.id,
      }
    );

  const sleepData = recurringEventData?.find(
    (event) => event.type.code === "sleep"
  );

  const workData = recurringEventData?.find(
    (event) => event.type.code === "work"
  );

  const sleepDuration = parseRecurringEventDuration(sleepData);
  const workDuration = parseRecurringEventDuration(workData);

  return (
    <div className="rounded-lg bg-tertiary/40 text-secondary">
      <header className="flex h-[56px] items-center justify-between rounded-t-lg bg-tertiary/60 px-3">
        <h2 className="text-md font-semibold">User Preferences</h2>
        <h2 className="cursor-pointer rounded-full p-1 text-sm font-semibold transition-all duration-300 hover:bg-secondary hover:text-tertiary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </h2>
      </header>
      <div className="p-3">
        <div className="flex flex-col gap-y-6">
          {sleepData && (
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold">
                Sleep
              </label>
              <div className="flex items-center gap-x-2">
                <h3>{sleepDuration}</h3>
              </div>
            </div>
          )}
          {workData && (
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold">
                Work
              </label>
              <div className="flex items-center gap-x-2">
                <h3>{workDuration}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
