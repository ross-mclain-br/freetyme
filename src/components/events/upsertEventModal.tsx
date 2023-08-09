import { Fragment, SetStateAction, Dispatch } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ColorPicker, DatePicker, TimePicker } from "antd";

export const UpsertEventModal = ({
  open,
  setOpen,
  selectedDay,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDay: Date;
}) => {
  const { RangePicker } = DatePicker;
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
              <Dialog.Panel className="sm:max-w-9xl relative transform overflow-hidden rounded-lg bg-tertiary/50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto max-w-md sm:max-w-3xl">
                    <div>
                      <form className="text-secondary">
                        <div className="space-y-12">
                          <div className=" gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12">
                            <div className="text-leftr">
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
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                />
                              </svg>

                              <h2 className="mt-2 text-base font-semibold leading-6 text-secondary">
                                Add Event
                              </h2>
                            </div>

                            <div className="mt-4 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 md:col-span-2">
                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="title"
                                  className="block text-sm font-medium leading-6"
                                >
                                  Title
                                </label>
                                <div className="mt-2">
                                  <input
                                    id="title"
                                    name="title"
                                    type="title"
                                    autoComplete="title"
                                    placeholder="Add title for your event"
                                    className=" block w-full rounded-md border-0 p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:font-bold placeholder:text-primary/40 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div className="divide-b col-span-full">
                                <label
                                  htmlFor="description"
                                  className="block text-sm font-medium leading-6"
                                >
                                  Description
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    name="description"
                                    id="description"
                                    autoComplete="description"
                                    placeholder="Add description for your event"
                                    className="block w-full rounded-md border-0 p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:font-bold placeholder:text-primary/40 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div className="divide-b col-span-full flex items-center">
                                <div className="">
                                  <ColorPicker size="small" />
                                </div>
                                <label
                                  htmlFor="region"
                                  className="ml-2 block whitespace-nowrap text-sm font-medium leading-6"
                                >
                                  Color Picker
                                </label>
                              </div>

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="duration"
                                  className="block text-sm font-medium leading-6"
                                >
                                  Select Event Duration
                                </label>
                                <div className="mt-2">
                                  <RangePicker
                                    showTime
                                    use12Hours
                                    format={"YYYY-MM-DD hh:mm A"}
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-full">
                                <label
                                  htmlFor="postal-code"
                                  className="block text-sm font-medium leading-6"
                                >
                                  Location
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="search"
                                    name="postal-code"
                                    id="postal-code"
                                    autoComplete="postal-code"
                                    className=" block w-full rounded-md border-0 p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:font-bold placeholder:text-primary/40 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  />
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
                      className="inline-flex w-24 justify-center rounded-md border border-secondary px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                      onClick={() => setOpen(false)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-24 justify-center rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-tertiary shadow-sm transition-all duration-300 hover:bg-transparent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                      onClick={() => setOpen(false)}
                    >
                      Save
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
export default UpsertEventModal;
