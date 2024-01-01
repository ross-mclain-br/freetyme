import { RouterOutputs } from "~/utils/api";

export const isRecurringEventOnDay = (
  recurringEvent: RouterOutputs["recurringEvent"]["getRecurringEventsByUserId"][0],
  currentDate: Date
): boolean => {
  switch (currentDate.getDay()) {
    case 0:
      if (recurringEvent.isOnSunday) return true;
      break;
    case 1:
      if (recurringEvent.isOnMonday) return true;
      break;
    case 2:
      if (recurringEvent.isOnTuesday) return true;
      break;
    case 3:
      if (recurringEvent.isOnWednesday) return true;
      break;
    case 4:
      if (recurringEvent.isOnThursday) return true;
      break;
    case 5:
      if (recurringEvent.isOnFriday) return true;
      break;
    case 6:
      if (recurringEvent.isOnSaturday) return true;
      break;
  }
  return false;
};
