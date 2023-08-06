import { RouterOutputs } from "./api";

export const capitalize = (value: string) => {
  return value?.[0]?.toUpperCase() + value?.slice(1);
};

export const parseRecurringEventDuration = (
  duration:
    | RouterOutputs["recurringEvent"]["getRecurringEventsByUserId"][0]
    | null
    | undefined
) => {
  if (!duration) {
    return "";
  }
  const startAMPM = duration.startHour > 12 ? "PM" : "AM";
  const endAMPM = duration.endHour > 12 ? "PM" : "AM";

  const startTime =
    duration.startHour > 12 ? duration.startHour - 12 : duration.startHour;
  const endTime =
    duration.endHour > 12 ? duration.endHour - 12 : duration.endHour;

  return `${String(startTime).padStart(2, "0")}:${String(
    duration.startMin
  ).padStart(2, "0")} ${startAMPM} - ${String(endTime).padStart(
    2,
    "0"
  )}:${String(duration.endMin).padStart(2, "0")} ${endAMPM}`;
};
