import { Fragment, SetStateAction, Dispatch, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { parseRecurringEventDuration } from "~/utils/util";
import { TimePicker } from "antd";
import dayjs from "dayjs";
export const UserPreferencesModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [editingSleep, setEditingSleep] = useState(false);
  const [editingWork, setEditingWork] = useState(false);

  const [sleepStart, setSleepStart] = useState<string | undefined>(undefined);
  const [sleepEnd, setSleepEnd] = useState<string | undefined>(undefined);

  const [workStart, setWorkStart] = useState<string | undefined>(undefined);
  const [workEnd, setWorkEnd] = useState<string | undefined>(undefined);

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-tertiary/50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
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
                          className=" h-12 w-12 text-secondary"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                          />
                        </svg>
                      </div>
                      <form className="text-secondary">
                        <div className="space-y-12">
                          <div className=" flex flex-col items-center gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 ">
                            <div className="px-3">
                              <div className="flex flex-col gap-y-6">
                                <div className="flex flex-col">
                                  <label
                                    htmlFor="name"
                                    className="text-sm font-semibold"
                                  >
                                    Sleep
                                  </label>
                                  <div className="flex items-center gap-x-2 text-3xl font-bold">
                                    {!editingSleep ? (
                                      <h3>
                                        {sleepDuration ?? "00:00 AM - 00:00 PM"}
                                      </h3>
                                    ) : (
                                      <h3 className="flex items-center space-x-2">
                                        <TimePicker
                                          name="sleep-start-time"
                                          use12Hours
                                          defaultValue={
                                            sleepData
                                              ? dayjs(
                                                  `${String(
                                                    sleepData.startHour
                                                  ).padStart(2, "0")}:${String(
                                                    sleepData.startMin
                                                  ).padStart(2, "0")} ${
                                                    sleepData.startHour < 12
                                                      ? "AM"
                                                      : "PM"
                                                  }`,
                                                  "hh:mm A"
                                                )
                                              : undefined
                                          }
                                          onChange={(time) => {
                                            setSleepStart(
                                              dayjs(time, "hh:mm A").format(
                                                "hh:mm A"
                                              )
                                            );
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
                                            setSleepEnd(
                                              dayjs(time, "hh:mm A").format(
                                                "hh:mm A"
                                              )
                                            );
                                          }}
                                          placeholder="End"
                                          defaultValue={
                                            sleepData
                                              ? dayjs(
                                                  `${String(
                                                    sleepData.endHour
                                                  ).padStart(2, "0")}:${String(
                                                    sleepData.endMin
                                                  ).padStart(2, "0")} ${
                                                    sleepData.endHour < 12
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
                                      <div
                                        className="ml-3 cursor-pointer rounded-full p-1  transition-all duration-300 hover:bg-secondary hover:text-primary"
                                        onClick={() => {
                                          setSleepStart(undefined);
                                          setSleepEnd(undefined);
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
                                      </div>
                                    ) : (
                                      <div className="ml-3 flex cursor-pointer items-center space-x-2 rounded-full transition-all duration-300">
                                        <div
                                          className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                          onClick={() => {
                                            setSleepStart(undefined);
                                            setSleepEnd(undefined);
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
                                        </div>
                                        <div
                                          className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                          onClick={() => {
                                            //TODO: mutate
                                            //hide and reset
                                            setSleepStart(undefined);
                                            setSleepEnd(undefined);
                                            setEditingSleep(false);
                                          }}
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
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <label
                                    htmlFor="name"
                                    className="text-sm font-semibold"
                                  >
                                    Work
                                  </label>
                                  <div className="flex items-center gap-x-2 text-3xl font-bold">
                                    {!editingWork ? (
                                      <h3>
                                        {workDuration ?? "00:00 AM - 00:00 PM"}
                                      </h3>
                                    ) : (
                                      <h3 className="flex items-center space-x-2">
                                        <TimePicker
                                          name="work-start-time"
                                          use12Hours
                                          defaultValue={
                                            workData
                                              ? dayjs(
                                                  `${String(
                                                    workData.startHour
                                                  ).padStart(2, "0")}:${String(
                                                    workData.startMin
                                                  ).padStart(2, "0")} ${
                                                    workData.startHour < 12
                                                      ? "AM"
                                                      : "PM"
                                                  }`,
                                                  "hh:mm A"
                                                )
                                              : undefined
                                          }
                                          onChange={(time) => {
                                            setWorkStart(
                                              dayjs(time, "hh:mm A").format(
                                                "hh:mm A"
                                              )
                                            );
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
                                            setWorkEnd(
                                              dayjs(time, "hh:mm A").format(
                                                "hh:mm A"
                                              )
                                            );
                                          }}
                                          placeholder="End"
                                          defaultValue={
                                            workData
                                              ? dayjs(
                                                  `${String(
                                                    workData.endHour
                                                  ).padStart(2, "0")}:${String(
                                                    workData.endMin
                                                  ).padStart(2, "0")} ${
                                                    workData.endHour < 12
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
                                      <div
                                        className="ml-3 cursor-pointer rounded-full p-1  transition-all duration-300 hover:bg-secondary hover:text-primary"
                                        onClick={() => {
                                          setWorkStart(undefined);
                                          setWorkEnd(undefined);
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
                                      </div>
                                    ) : (
                                      <div className="ml-3 flex cursor-pointer items-center space-x-2 rounded-full transition-all duration-300">
                                        <div
                                          className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                          onClick={() => {
                                            setWorkStart(undefined);
                                            setWorkEnd(undefined);
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
                                        </div>
                                        <div
                                          className="group rounded-full p-1 transition-all duration-300 hover:bg-secondary"
                                          onClick={() => {
                                            //TODO: mutate
                                            //close editing
                                            setWorkStart(undefined);
                                            setWorkEnd(undefined);
                                            setEditingWork(false);
                                          }}
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
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-center sm:mt-6">
                  <div className="space-x-4">
                    <button
                      type="button"
                      className="inline-flex w-32 justify-center rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-tertiary shadow-sm transition-all duration-300 hover:bg-transparent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                      onClick={() => setOpen(false)}
                    >
                      Done
                    </button>
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
