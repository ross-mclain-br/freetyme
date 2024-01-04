import { Fragment, useState } from "react";
import type { SetStateAction, Dispatch } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { parseRecurringEventDuration } from "~/utils/util";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";

const recurringEventSchema = z.object({
  duration: z.object({
    startHour: z.number(),
    startMin: z.number(),
    endHour: z.number(),
    endMin: z.number(),
  }),
});
export const UserPreferencesModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: eventTypesData } = api.eventType.getEventTypes.useQuery();

  const { mutateAsync: userRecurringEventMutation } =
    api.recurringEvent.upsertRecurringEvent.useMutation();

  const { user } = useUser();

  const { data: userData } = api.user.getUserByExternalId.useQuery(
    {
      externalUserId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    }
  );

  const { data: recurringEventData, refetch: recurringEventDataRefetch } =
    api.recurringEvent.getRecurringEventsByUserId.useQuery(
      {
        userId: userData?.id ?? 0,
      },
      {
        enabled: !!userData?.id,
      }
    );

  const [editingSleep, setEditingSleep] = useState(false);
  const [editingWork, setEditingWork] = useState(false);

  const sleepData = recurringEventData?.find(
    (event) => event.type.code === "sleep"
  );

  const workData = recurringEventData?.find(
    (event) => event.type.code === "work"
  );

  const sleepDuration = parseRecurringEventDuration(sleepData);
  const workDuration = parseRecurringEventDuration(workData);

  const sleepForm = useForm<z.infer<typeof recurringEventSchema>>({
    resolver: zodResolver(recurringEventSchema),
    defaultValues: {
      duration: {
        startHour: sleepData?.startHour ?? 0,
        startMin: sleepData?.startMin ?? 0,
        endHour: sleepData?.endHour ?? 0,
        endMin: sleepData?.endMin ?? 0,
      },
    },
  });

  const onSubmitSleep = (data: z.infer<typeof recurringEventSchema>) => {
    console.log(`SAVE EVENT`, data);
    if (data.duration) {
      userRecurringEventMutation({
        id: sleepData?.id ?? null,
        startHour: data?.duration?.startHour ?? 0,
        startMin: data?.duration?.startMin ?? 0,
        endHour: data?.duration?.endHour ?? 0,
        endMin: data?.duration?.endMin ?? 0,
        isOnSunday: true,
        isOnMonday: true,
        isOnTuesday: true,
        isOnWednesday: true,
        isOnThursday: true,
        isOnFriday: true,
        isOnSaturday: true,
        typeId: eventTypesData?.find((type) => type.code === "sleep")?.id ?? 0,
        userId: userData?.id ?? 0,
        title: "Sleep",
        description: "Sleep",
      })
        .then((res) => {
          console.log(res);
          setEditingSleep(false);
          recurringEventDataRefetch().catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error updating sleep",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(err, null, 2)}
                </code>
              </pre>
            ),
          });
        });
    } else {
      toast({
        title: "Please fill out all required fields",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  const workForm = useForm<z.infer<typeof recurringEventSchema>>({
    resolver: zodResolver(recurringEventSchema),
    defaultValues: {
      duration: {
        startHour: sleepData?.startHour ?? 0,
        startMin: sleepData?.startMin ?? 0,
        endHour: sleepData?.endHour ?? 0,
        endMin: sleepData?.endMin ?? 0,
      },
    },
  });

  const onSubmitWork = (data: z.infer<typeof recurringEventSchema>) => {
    console.log(`SAVE EVENT`, data);
    if (data.duration?.startHour && data.duration?.endHour) {
      userRecurringEventMutation({
        id: workData?.id ?? null,
        startHour: data?.duration?.startHour ?? 0,
        startMin: data?.duration?.startMin ?? 0,
        endHour: data?.duration?.endHour ?? 0,
        endMin: data?.duration?.endMin ?? 0,
        isOnSunday: false,
        isOnMonday: true,
        isOnTuesday: true,
        isOnWednesday: true,
        isOnThursday: true,
        isOnFriday: true,
        isOnSaturday: false,
        typeId: eventTypesData?.find((type) => type.code === "work")?.id ?? 0,
        userId: userData?.id ?? 0,
        title: "Work",
        description: "Work",
      })
        .then((res) => {
          console.log(res);
          setEditingWork(false);
          recurringEventDataRefetch().catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error updating work",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(err, null, 2)}
                </code>
              </pre>
            ),
          });
        });
    } else {
      toast({
        title: "Please fill out all required fields",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-tertiary/50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                <div>
                  <div className="mx-auto max-w-md sm:max-w-3xl">
                    <div>
                      <div className="text-left">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className=" h-6 w-6 text-secondary"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                          />
                        </svg>
                      </div>
                      <Form {...sleepForm}>
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            void sleepForm.handleSubmit(onSubmitSleep, (e) => {
                              console.log(`ERROR`, e);
                            })(event);
                          }}
                          className="text-secondary"
                        >
                          <div className="space-y-12">
                            <div className=" flex flex-col items-start gap-x-8 gap-y-10 border-b border-gray-900/10 py-3 ">
                              <div className="px-6">
                                <div className="flex flex-col gap-y-6">
                                  <FormField
                                    name="duration"
                                    control={sleepForm.control}
                                    render={({ field }) => (
                                      <>
                                        <FormItem className="flex flex-col">
                                          <FormLabel className="text-sm font-bold">
                                            Sleep
                                          </FormLabel>
                                          <div className="flex items-center gap-x-2 text-lg font-bold">
                                            {!editingSleep ? (
                                              <h3>
                                                {sleepDuration ??
                                                  "00:00 AM - 00:00 PM"}
                                              </h3>
                                            ) : (
                                              <h3 className="flex items-center space-x-2">
                                                <TimePicker
                                                  name="sleep-start-time"
                                                  use12Hours
                                                  value={
                                                    field.value
                                                      ? dayjs(
                                                          `${String(
                                                            field.value
                                                              .startHour
                                                          ).padStart(
                                                            2,
                                                            "0"
                                                          )}:${String(
                                                            field.value.startMin
                                                          ).padStart(2, "0")} ${
                                                            field.value
                                                              .startHour < 12
                                                              ? "AM"
                                                              : "PM"
                                                          }`,
                                                          "hh:mm A"
                                                        )
                                                      : undefined
                                                  }
                                                  onChange={(time) => {
                                                    if (time) {
                                                      field.onChange({
                                                        ...field.value,
                                                        startHour: time.hour(),
                                                        startMin: time.minute(),
                                                      });
                                                    }
                                                  }}
                                                  placeholder="Start"
                                                  format={"hh:mm A"}
                                                  suffixIcon={null}
                                                  allowClear={false}
                                                />
                                                <span>-</span>
                                                <TimePicker
                                                  name="sleep-end-time"
                                                  use12Hours
                                                  format={"hh:mm A"}
                                                  suffixIcon={null}
                                                  allowClear={false}
                                                  onChange={(time) => {
                                                    if (time) {
                                                      field.onChange({
                                                        ...field.value,
                                                        endHour: time.hour(),
                                                        endMin: time.minute(),
                                                      });
                                                    }
                                                  }}
                                                  placeholder="End"
                                                  value={
                                                    field.value
                                                      ? dayjs(
                                                          `${String(
                                                            field.value.endHour
                                                          ).padStart(
                                                            2,
                                                            "0"
                                                          )}:${String(
                                                            field.value.endMin
                                                          ).padStart(2, "0")} ${
                                                            field.value
                                                              .endHour < 12
                                                              ? "AM"
                                                              : "PM"
                                                          }`,
                                                          "hh:mm A"
                                                        )
                                                      : undefined
                                                  }
                                                />
                                              </h3>
                                            )}
                                            {!editingSleep ? (
                                              <Button
                                                className="ml-3 cursor-pointer rounded-full p-1  transition-all duration-300 hover:bg-secondary hover:text-primary"
                                                onClick={() => {
                                                  setEditingSleep(true);
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth={1.5}
                                                  stroke="currentColor"
                                                  className="h-6 w-6"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                  />
                                                </svg>
                                              </Button>
                                            ) : (
                                              <div className="ml-3 flex cursor-pointer items-center space-x-2 rounded-full transition-all duration-300">
                                                <Button
                                                  className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                                  onClick={() => {
                                                    setEditingSleep(false);
                                                  }}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="h-6 w-6  group-hover:stroke-red-500"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M6 18L18 6M6 6l12 12"
                                                    />
                                                  </svg>
                                                </Button>
                                                <Button
                                                  className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                                  type={"submit"}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="h-6 w-6  group-hover:stroke-green-500"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M4.5 12.75l6 6 9-13.5"
                                                    />
                                                  </svg>
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                          <FormDescription></FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </Form>
                      <Form {...workForm}>
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            void workForm.handleSubmit(onSubmitWork, (e) => {
                              console.log(`ERROR`, e);
                            })(event);
                          }}
                          className="text-secondary"
                        >
                          <div className="space-y-12">
                            <div className=" flex flex-col gap-x-8 gap-y-10 border-b border-gray-900/10 py-3 ">
                              <div className="px-6">
                                <div className="flex flex-col gap-y-6">
                                  <FormField
                                    name={"duration"}
                                    control={workForm.control}
                                    render={({ field }) => (
                                      <>
                                        <FormItem className="flex flex-grow flex-col">
                                          <FormLabel className="text-sm font-bold">
                                            Work
                                          </FormLabel>
                                          <div className="flex items-center gap-x-2 text-lg font-bold">
                                            {!editingWork ? (
                                              <h3>
                                                {workDuration ??
                                                  "00:00 AM - 00:00 PM"}
                                              </h3>
                                            ) : (
                                              <h3 className="flex items-center space-x-2">
                                                <TimePicker
                                                  name="work-start-time"
                                                  use12Hours
                                                  defaultValue={
                                                    field.value
                                                      ? dayjs(
                                                          `${String(
                                                            field.value
                                                              .startHour
                                                          ).padStart(
                                                            2,
                                                            "0"
                                                          )}:${String(
                                                            field.value.startMin
                                                          ).padStart(2, "0")} ${
                                                            field.value
                                                              .startHour < 12
                                                              ? "AM"
                                                              : "PM"
                                                          }`,
                                                          "hh:mm A"
                                                        )
                                                      : undefined
                                                  }
                                                  onChange={(time) => {
                                                    if (time) {
                                                      field.onChange({
                                                        ...field.value,
                                                        startHour: time.hour(),
                                                        startMin: time.minute(),
                                                      });
                                                    }
                                                  }}
                                                  placeholder="Start"
                                                  format={"hh:mm A"}
                                                  suffixIcon={null}
                                                  allowClear={false}
                                                />
                                                <span>-</span>
                                                <TimePicker
                                                  name="work-end-time"
                                                  use12Hours
                                                  format={"hh:mm A"}
                                                  suffixIcon={null}
                                                  allowClear={false}
                                                  onChange={(time) => {
                                                    if (time) {
                                                      field.onChange({
                                                        ...field.value,
                                                        endHour: time.hour(),
                                                        endMin: time.minute(),
                                                      });
                                                    }
                                                  }}
                                                  placeholder="End"
                                                  value={
                                                    field.value
                                                      ? dayjs(
                                                          `${String(
                                                            field.value.endHour
                                                          ).padStart(
                                                            2,
                                                            "0"
                                                          )}:${String(
                                                            field.value.endMin
                                                          ).padStart(2, "0")} ${
                                                            field.value
                                                              .endHour < 12
                                                              ? "AM"
                                                              : "PM"
                                                          }`,
                                                          "hh:mm A"
                                                        )
                                                      : undefined
                                                  }
                                                />
                                              </h3>
                                            )}

                                            {!editingWork ? (
                                              <Button
                                                className="ml-3 cursor-pointer rounded-full p-1  transition-all duration-300 hover:bg-secondary hover:text-primary"
                                                onClick={() => {
                                                  setEditingWork(true);
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth={1.5}
                                                  stroke="currentColor"
                                                  className="h-6 w-6"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                  />
                                                </svg>
                                              </Button>
                                            ) : (
                                              <div className="ml-3 flex cursor-pointer items-center space-x-2 rounded-full transition-all duration-300">
                                                <Button
                                                  className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                                  onClick={() => {
                                                    setEditingWork(false);
                                                  }}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="h-6 w-6  group-hover:stroke-red-500"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M6 18L18 6M6 6l12 12"
                                                    />
                                                  </svg>
                                                </Button>
                                                <Button
                                                  className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                                  type={"submit"}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="h-6 w-6  group-hover:stroke-green-500"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M4.5 12.75l6 6 9-13.5"
                                                    />
                                                  </svg>
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                          <FormDescription></FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-end sm:mt-6">
                  <div className="space-x-4">
                    <Button
                      type="button"
                      className="inline-flex w-32 justify-center rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-tertiary shadow-sm transition-all duration-300 hover:bg-transparent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                      onClick={() => setOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default UserPreferencesModal;
