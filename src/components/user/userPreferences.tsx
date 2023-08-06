import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

export const UserPreferences = () => {
  const { user, isSignedIn, isLoaded } = useUser();

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

  return (
    <div className="rounded-lg bg-tertiary/40 text-secondary">
      <header className="flex h-[56px] items-center rounded-t-lg bg-tertiary/60 px-3">
        <h2 className="text-xl font-semibold">User Preferences</h2>
      </header>
      <div className="p-3">
        <div className="flex flex-col gap-y-6">
          {sleepData && (
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold">
                Sleep
              </label>
              <div className="flex items-center gap-x-2">
                <h3>
                  {sleepData.startHour}:{sleepData.startMin} -{" "}
                  {sleepData.endHour}:{sleepData.endMin}
                </h3>
              </div>
            </div>
          )}
          {workData && (
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold">
                Work
              </label>
              <div className="flex items-center gap-x-2">
                <h3>
                  {workData.startHour}:{workData.startMin} - {workData.endHour}:
                  {workData.endMin}
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
