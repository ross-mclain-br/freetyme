import { RouterOutputs } from "./api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
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
    return null;
  }
  const startAMPM = duration.startHour > 12 ? "PM" : "AM";
  const endAMPM = duration.endHour > 12 ? "PM" : "AM";

  const startTime =
    duration.startHour === 0
      ? 12
      : duration.startHour > 12
      ? duration.startHour - 12
      : duration.startHour;
  const endTime =
    duration.endHour > 12 ? duration.endHour - 12 : duration.endHour;

  return `${String(startTime).padStart(2, "0")}:${String(
    duration.startMin
  ).padStart(2, "0")} ${startAMPM} - ${String(endTime).padStart(
    2,
    "0"
  )}:${String(duration.endMin).padStart(2, "0")} ${endAMPM}`;
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
